<?php

namespace App\Services;

use App\Models\User;
use App\Models\TokenPackage;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use Illuminate\Support\Facades\Log;

class StripeService
{
    private $stripe;

    public function __construct()
    {
        $this->stripe = new \Stripe\StripeClient(config('services.stripe.secret'));
    }

    /**
     * Get or create a Stripe customer for a user.
     */
    public function getOrCreateCustomer(User $user): string
    {
        $stripeCustomer = $user->stripeCustomer;

        if ($stripeCustomer) {
            return $stripeCustomer->stripe_customer_id;
        }

        try {
            $customer = $this->stripe->customers->create([
                'email' => $user->email,
                'name' => $user->full_name,
                'metadata' => [
                    'user_id' => $user->id,
                ],
            ]);

            $user->stripeCustomer()->create([
                'stripe_customer_id' => $customer->id,
            ]);

            return $customer->id;
        } catch (\Exception $e) {
            Log::error('Failed to create Stripe customer', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Create a payment intent for token purchase.
     */
    public function createTokenPurchaseIntent(User $user, TokenPackage $package): array
    {
        try {
            $customerId = $this->getOrCreateCustomer($user);
            $amount = (int) ($package->getPriceForUser($user) * 100); // Convert to cents

            $paymentIntent = $this->stripe->paymentIntents->create([
                'amount' => $amount,
                'currency' => 'usd',
                'customer' => $customerId,
                'metadata' => [
                    'user_id' => $user->id,
                    'package_id' => $package->id,
                    'type' => 'token_purchase',
                ],
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            return [
                'payment_intent_id' => $paymentIntent->id,
                'client_secret' => $paymentIntent->client_secret,
                'amount' => $amount,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to create payment intent', [
                'user_id' => $user->id,
                'package_id' => $package->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Verify a payment intent is successful.
     */
    public function verifyPaymentIntent(string $paymentIntentId): bool
    {
        try {
            $paymentIntent = $this->stripe->paymentIntents->retrieve($paymentIntentId);
            return $paymentIntent->status === 'succeeded';
        } catch (\Exception $e) {
            Log::error('Failed to verify payment intent', [
                'payment_intent_id' => $paymentIntentId,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Create a subscription for a user.
     */
    public function createSubscription(User $user, SubscriptionPlan $plan, string $paymentMethodId): array
    {
        try {
            $customerId = $this->getOrCreateCustomer($user);

            // Attach payment method to customer
            $this->stripe->paymentMethods->attach($paymentMethodId, [
                'customer' => $customerId,
            ]);

            // Set as default payment method
            $this->stripe->customers->update($customerId, [
                'invoice_settings' => [
                    'default_payment_method' => $paymentMethodId,
                ],
            ]);

            // Create subscription
            $subscription = $this->stripe->subscriptions->create([
                'customer' => $customerId,
                'items' => [
                    ['price' => $this->getPriceIdForPlan($plan)],
                ],
                'metadata' => [
                    'user_id' => $user->id,
                    'plan_id' => $plan->id,
                ],
                'expand' => ['latest_invoice.payment_intent'],
            ]);

            return [
                'subscription_id' => $subscription->id,
                'status' => $subscription->status,
                'current_period_end' => $subscription->current_period_end,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to create subscription', [
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Cancel a subscription.
     */
    public function cancelSubscription(string $subscriptionId): bool
    {
        try {
            $this->stripe->subscriptions->cancel($subscriptionId);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to cancel subscription', [
                'subscription_id' => $subscriptionId,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Handle Stripe webhook events.
     */
    public function handleWebhook(string $payload, string $signature): void
    {
        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $signature,
                config('services.stripe.webhook_secret')
            );

            Log::info('Stripe webhook received', ['type' => $event->type]);

            switch ($event->type) {
                case 'payment_intent.succeeded':
                    $this->handlePaymentIntentSucceeded($event->data->object);
                    break;
                case 'payment_intent.payment_failed':
                    $this->handlePaymentIntentFailed($event->data->object);
                    break;
                case 'customer.subscription.updated':
                    $this->handleSubscriptionUpdated($event->data->object);
                    break;
                case 'customer.subscription.deleted':
                    $this->handleSubscriptionDeleted($event->data->object);
                    break;
                case 'invoice.payment_failed':
                    $this->handleInvoicePaymentFailed($event->data->object);
                    break;
            }
        } catch (\Exception $e) {
            Log::error('Webhook handling failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Handle successful payment intent.
     */
    private function handlePaymentIntentSucceeded($paymentIntent): void
    {
        $metadata = $paymentIntent->metadata;
        
        if ($metadata->type === 'token_purchase') {
            // Token purchase is handled by the confirm endpoint
            Log::info('Token purchase payment succeeded', [
                'payment_intent_id' => $paymentIntent->id,
                'user_id' => $metadata->user_id ?? null,
            ]);
        }
    }

    /**
     * Handle failed payment intent.
     */
    private function handlePaymentIntentFailed($paymentIntent): void
    {
        Log::warning('Payment intent failed', [
            'payment_intent_id' => $paymentIntent->id,
            'user_id' => $paymentIntent->metadata->user_id ?? null,
        ]);
        
        // TODO: Send notification to user about failed payment
    }

    /**
     * Handle subscription update.
     */
    private function handleSubscriptionUpdated($subscription): void
    {
        $userId = $subscription->metadata->user_id ?? null;
        
        if (!$userId) {
            return;
        }

        $localSubscription = Subscription::where('stripe_subscription_id', $subscription->id)->first();
        
        if ($localSubscription) {
            $localSubscription->update([
                'status' => $this->mapStripeStatus($subscription->status),
                'ends_at' => $subscription->current_period_end 
                    ? \Carbon\Carbon::createFromTimestamp($subscription->current_period_end)
                    : null,
            ]);
        }
    }

    /**
     * Handle subscription deletion.
     */
    private function handleSubscriptionDeleted($subscription): void
    {
        $localSubscription = Subscription::where('stripe_subscription_id', $subscription->id)->first();
        
        if ($localSubscription) {
            $localSubscription->update([
                'status' => Subscription::STATUS_CANCELLED,
                'cancelled_at' => now(),
            ]);
        }
    }

    /**
     * Handle failed invoice payment.
     */
    private function handleInvoicePaymentFailed($invoice): void
    {
        $subscriptionId = $invoice->subscription;
        
        if ($subscriptionId) {
            $localSubscription = Subscription::where('stripe_subscription_id', $subscriptionId)->first();
            
            if ($localSubscription) {
                $localSubscription->update([
                    'status' => Subscription::STATUS_PAST_DUE,
                ]);
                
                // TODO: Send notification to user about failed payment
            }
        }
    }

    /**
     * Map Stripe subscription status to local status.
     */
    private function mapStripeStatus(string $stripeStatus): string
    {
        return match ($stripeStatus) {
            'active', 'trialing' => Subscription::STATUS_ACTIVE,
            'past_due' => Subscription::STATUS_PAST_DUE,
            'canceled', 'unpaid' => Subscription::STATUS_CANCELLED,
            default => Subscription::STATUS_ACTIVE,
        };
    }

    /**
     * Get Stripe price ID for a subscription plan.
     * In production, these would be stored in the database or config.
     */
    private function getPriceIdForPlan(SubscriptionPlan $plan): string
    {
        // This should be stored in the subscription_plans table
        // For now, return a placeholder
        return 'price_' . $plan->slug;
    }
}

