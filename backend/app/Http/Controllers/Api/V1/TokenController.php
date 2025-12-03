<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TokenPackage;
use App\Models\TokenTransaction;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TokenController extends Controller
{
    /**
     * Get available token packages.
     */
    public function index(Request $request): JsonResponse
    {
        $packages = TokenPackage::active()
            ->ordered()
            ->get()
            ->map(function ($package) use ($request) {
                $response = [
                    'id' => $package->id,
                    'name' => $package->name,
                    'description' => $package->description,
                    'token_amount' => $package->token_amount,
                    'price' => $package->price,
                    'price_per_token' => $package->price_per_token,
                    'is_featured' => $package->is_featured,
                ];

                // Include subscriber price if user is authenticated and subscribed
                if ($request->user() && $request->user()->hasActiveSubscription()) {
                    $response['subscriber_price'] = $package->subscriber_price;
                    $response['subscriber_price_per_token'] = $package->subscriber_price_per_token;
                    $response['effective_price'] = $package->subscriber_price ?? $package->price;
                } else {
                    $response['effective_price'] = $package->price;
                }

                return $response;
            });

        return response()->json([
            'packages' => $packages,
        ]);
    }

    /**
     * Get user's token balance.
     */
    public function balance(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'balance' => $user->tokens_balance,
            'is_low' => $user->tokens_balance < 10,
        ]);
    }

    /**
     * Get user's token transaction history.
     */
    public function transactions(Request $request): JsonResponse
    {
        $user = $request->user();

        $transactions = TokenTransaction::forUser($user->id)
            ->with('tokenPackage', 'consultation')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'transactions' => $transactions->items(),
            'pagination' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
            ],
        ]);
    }

    /**
     * Initiate token purchase.
     */
    public function purchase(Request $request): JsonResponse
    {
        $request->validate([
            'package_id' => 'required|exists:token_packages,id',
        ]);

        $user = $request->user();
        $package = TokenPackage::findOrFail($request->package_id);

        if (!$package->is_active) {
            return response()->json([
                'message' => 'This package is no longer available',
            ], 400);
        }

        $price = $package->getPriceForUser($user);

        // In production, create Stripe PaymentIntent here
        // For now, return mock payment intent
        $paymentIntentId = 'pi_' . bin2hex(random_bytes(12));

        return response()->json([
            'payment_intent_id' => $paymentIntentId,
            'client_secret' => $paymentIntentId . '_secret_' . bin2hex(random_bytes(8)),
            'amount' => $price * 100, // Stripe uses cents
            'currency' => 'usd',
            'package' => [
                'id' => $package->id,
                'name' => $package->name,
                'token_amount' => $package->token_amount,
                'price' => $price,
            ],
        ]);
    }

    /**
     * Confirm token purchase after payment.
     */
    public function confirmPurchase(Request $request): JsonResponse
    {
        $request->validate([
            'payment_intent_id' => 'required|string',
            'package_id' => 'required|exists:token_packages,id',
        ]);

        $user = $request->user();
        $package = TokenPackage::findOrFail($request->package_id);

        // In production, verify payment with Stripe here
        // For now, simulate successful payment

        try {
            DB::beginTransaction();

            $oldBalance = $user->tokens_balance;
            $newBalance = $oldBalance + $package->token_amount;

            // Update user balance
            $user->update(['tokens_balance' => $newBalance]);

            // Create transaction record
            $transaction = TokenTransaction::create([
                'user_id' => $user->id,
                'type' => TokenTransaction::TYPE_PURCHASE,
                'amount' => $package->token_amount,
                'balance_after' => $newBalance,
                'description' => "Purchased {$package->name}",
                'stripe_payment_intent_id' => $request->payment_intent_id,
                'token_package_id' => $package->id,
            ]);

            AuditLog::log(
                'token_purchase',
                $user->id,
                TokenTransaction::class,
                $transaction->id,
                ['balance' => $oldBalance],
                ['balance' => $newBalance],
                [
                    'package_id' => $package->id,
                    'amount' => $package->token_amount,
                    'price' => $package->getPriceForUser($user),
                ]
            );

            DB::commit();

            return response()->json([
                'message' => 'Purchase successful',
                'tokens_added' => $package->token_amount,
                'new_balance' => $newBalance,
                'transaction_id' => $transaction->id,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Token purchase failed', [
                'user_id' => $user->id,
                'package_id' => $package->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Purchase failed. Please try again.',
            ], 500);
        }
    }

    /**
     * Handle Stripe webhook.
     */
    public function handleStripeWebhook(Request $request): JsonResponse
    {
        // In production, verify webhook signature
        $payload = $request->all();
        $eventType = $payload['type'] ?? null;

        Log::info('Stripe webhook received', ['type' => $eventType]);

        switch ($eventType) {
            case 'payment_intent.succeeded':
                // Handle successful payment
                break;
            case 'payment_intent.payment_failed':
                // Handle failed payment
                break;
            case 'customer.subscription.updated':
                // Handle subscription update
                break;
            case 'customer.subscription.deleted':
                // Handle subscription cancellation
                break;
        }

        return response()->json(['received' => true]);
    }
}

