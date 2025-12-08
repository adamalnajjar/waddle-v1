<?php

namespace App\Services;

use App\Models\User;
use App\Models\TokenTransaction;
use App\Models\TokenPackage;
use App\Models\Consultation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TokenService
{
    /**
     * Add tokens to user balance.
     */
    public function addTokens(
        User $user,
        int $amount,
        string $type,
        string $description,
        ?string $stripePaymentIntentId = null,
        ?int $tokenPackageId = null
    ): TokenTransaction {
        return DB::transaction(function () use ($user, $amount, $type, $description, $stripePaymentIntentId, $tokenPackageId) {
            $oldBalance = $user->tokens_balance;
            $newBalance = $oldBalance + $amount;

            $user->update(['tokens_balance' => $newBalance]);

            $transaction = TokenTransaction::create([
                'user_id' => $user->id,
                'type' => $type,
                'amount' => $amount,
                'balance_after' => $newBalance,
                'description' => $description,
                'stripe_payment_intent_id' => $stripePaymentIntentId,
                'token_package_id' => $tokenPackageId,
            ]);

            Log::info('Tokens added', [
                'user_id' => $user->id,
                'amount' => $amount,
                'type' => $type,
                'new_balance' => $newBalance,
            ]);

            return $transaction;
        });
    }

    /**
     * Deduct tokens from user balance.
     */
    public function deductTokens(
        User $user,
        int $amount,
        string $description,
        ?int $consultationId = null
    ): TokenTransaction {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Deduction amount must be positive');
        }

        if ($user->tokens_balance < $amount) {
            throw new \Exception('Insufficient token balance');
        }

        return DB::transaction(function () use ($user, $amount, $description, $consultationId) {
            $oldBalance = $user->tokens_balance;
            $newBalance = $oldBalance - $amount;

            $user->update(['tokens_balance' => $newBalance]);

            $transaction = TokenTransaction::create([
                'user_id' => $user->id,
                'type' => TokenTransaction::TYPE_DEDUCTION,
                'amount' => -$amount, // Negative for deduction
                'balance_after' => $newBalance,
                'description' => $description,
                'consultation_id' => $consultationId,
            ]);

            Log::info('Tokens deducted', [
                'user_id' => $user->id,
                'amount' => $amount,
                'consultation_id' => $consultationId,
                'new_balance' => $newBalance,
            ]);

            return $transaction;
        });
    }

    /**
     * Process token purchase from a package.
     */
    public function processPurchase(
        User $user,
        TokenPackage $package,
        string $stripePaymentIntentId
    ): TokenTransaction {
        return $this->addTokens(
            $user,
            $package->token_amount,
            TokenTransaction::TYPE_PURCHASE,
            "Purchased {$package->name}",
            $stripePaymentIntentId,
            $package->id
        );
    }

    /**
     * Charge tokens for a consultation.
     */
    public function chargeForConsultation(Consultation $consultation): TokenTransaction
    {
        $tokensToCharge = $consultation->calculateTokensToCharge();

        if ($tokensToCharge <= 0) {
            throw new \Exception('No tokens to charge');
        }

        return $this->deductTokens(
            $consultation->user,
            $tokensToCharge,
            "Consultation #{$consultation->id} - {$consultation->duration_minutes} minutes",
            $consultation->id
        );
    }

    /**
     * Refund tokens for a cancelled consultation.
     */
    public function refundConsultation(Consultation $consultation): TokenTransaction
    {
        if ($consultation->tokens_charged <= 0) {
            throw new \Exception('No tokens to refund');
        }

        return $this->addTokens(
            $consultation->user,
            $consultation->tokens_charged,
            TokenTransaction::TYPE_REFUND,
            "Refund for consultation #{$consultation->id}"
        );
    }

    /**
     * Add bonus tokens.
     */
    public function addBonus(User $user, int $amount, string $reason): TokenTransaction
    {
        return $this->addTokens(
            $user,
            $amount,
            TokenTransaction::TYPE_BONUS,
            $reason
        );
    }

    /**
     * Check if user has sufficient tokens.
     */
    public function hasSufficientTokens(User $user, int $amount): bool
    {
        return $user->tokens_balance >= $amount;
    }

    /**
     * Check if user has low balance (below threshold).
     */
    public function hasLowBalance(User $user, int $threshold = 10): bool
    {
        return $user->tokens_balance < $threshold;
    }

    /**
     * Get user's transaction history.
     */
    public function getTransactionHistory(User $user, int $limit = 20): \Illuminate\Database\Eloquent\Collection
    {
        return TokenTransaction::where('user_id', $user->id)
            ->with(['tokenPackage', 'consultation'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}

