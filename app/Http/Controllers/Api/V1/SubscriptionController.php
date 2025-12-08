<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{
    /**
     * Get available subscription plans.
     */
    public function index(): JsonResponse
    {
        $plans = SubscriptionPlan::active()
            ->orderBy('price')
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'slug' => $plan->slug,
                    'description' => $plan->description,
                    'price' => $plan->price,
                    'billing_period' => $plan->billing_period,
                    'token_discount_percentage' => $plan->token_discount_percentage,
                    'priority_matching' => $plan->priority_matching,
                    'features' => $plan->features,
                ];
            });

        return response()->json([
            'plans' => $plans,
        ]);
    }

    /**
     * Get user's current subscription.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->subscription;

        if (!$subscription) {
            return response()->json([
                'subscription' => null,
                'has_subscription' => false,
            ]);
        }

        $subscription->load('plan');

        return response()->json([
            'subscription' => [
                'id' => $subscription->id,
                'plan' => [
                    'id' => $subscription->plan->id,
                    'name' => $subscription->plan->name,
                    'price' => $subscription->plan->price,
                    'billing_period' => $subscription->plan->billing_period,
                    'token_discount_percentage' => $subscription->plan->token_discount_percentage,
                    'priority_matching' => $subscription->plan->priority_matching,
                    'features' => $subscription->plan->features,
                ],
                'status' => $subscription->status,
                'starts_at' => $subscription->starts_at,
                'ends_at' => $subscription->ends_at,
                'cancelled_at' => $subscription->cancelled_at,
                'is_active' => $subscription->isActive(),
                'is_expiring_soon' => $subscription->isExpiringSoon(),
                'days_until_expiration' => $subscription->days_until_expiration,
            ],
            'has_subscription' => $subscription->isActive(),
        ]);
    }

    /**
     * Subscribe to a plan.
     */
    public function subscribe(Request $request): JsonResponse
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'payment_method_id' => 'required|string',
        ]);

        $user = $request->user();
        $plan = SubscriptionPlan::findOrFail($request->plan_id);

        if (!$plan->is_active) {
            return response()->json([
                'message' => 'This plan is no longer available',
            ], 400);
        }

        // Check if user already has an active subscription
        if ($user->hasActiveSubscription()) {
            return response()->json([
                'message' => 'You already have an active subscription',
            ], 400);
        }

        try {
            DB::beginTransaction();

            // In production, create Stripe subscription here
            $stripeSubscriptionId = 'sub_' . bin2hex(random_bytes(12));

            $startsAt = now();
            $endsAt = $plan->billing_period === SubscriptionPlan::BILLING_MONTHLY
                ? now()->addMonth()
                : now()->addYear();

            $subscription = Subscription::create([
                'user_id' => $user->id,
                'subscription_plan_id' => $plan->id,
                'stripe_subscription_id' => $stripeSubscriptionId,
                'status' => Subscription::STATUS_ACTIVE,
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
            ]);

            AuditLog::log(
                'subscription_created',
                $user->id,
                Subscription::class,
                $subscription->id,
                null,
                [
                    'plan_id' => $plan->id,
                    'plan_name' => $plan->name,
                    'starts_at' => $startsAt->toISOString(),
                    'ends_at' => $endsAt->toISOString(),
                ]
            );

            DB::commit();

            return response()->json([
                'message' => 'Subscription created successfully',
                'subscription' => [
                    'id' => $subscription->id,
                    'plan' => $plan->name,
                    'status' => $subscription->status,
                    'starts_at' => $subscription->starts_at,
                    'ends_at' => $subscription->ends_at,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Subscription creation failed', [
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Subscription creation failed. Please try again.',
            ], 500);
        }
    }

    /**
     * Cancel subscription.
     */
    public function cancel(Request $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->subscription;

        if (!$subscription || !$subscription->isActive()) {
            return response()->json([
                'message' => 'No active subscription found',
            ], 400);
        }

        try {
            DB::beginTransaction();

            // In production, cancel Stripe subscription here

            $subscription->update([
                'status' => Subscription::STATUS_CANCELLED,
                'cancelled_at' => now(),
            ]);

            AuditLog::log(
                'subscription_cancelled',
                $user->id,
                Subscription::class,
                $subscription->id,
                ['status' => Subscription::STATUS_ACTIVE],
                ['status' => Subscription::STATUS_CANCELLED]
            );

            DB::commit();

            return response()->json([
                'message' => 'Subscription cancelled successfully. You will continue to have access until ' . $subscription->ends_at->format('F j, Y'),
                'ends_at' => $subscription->ends_at,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Subscription cancellation failed', [
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Subscription cancellation failed. Please try again.',
            ], 500);
        }
    }
}

