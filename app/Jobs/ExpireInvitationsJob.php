<?php

namespace App\Jobs;

use App\Models\ConsultantInvitation;
use App\Models\ProblemSubmission;
use App\Models\TokenTransaction;
use App\Models\AuditLog;
use App\Services\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExpireInvitationsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * Execute the job.
     */
    public function handle(NotificationService $notificationService): void
    {
        Log::info('ExpireInvitationsJob: Starting invitation expiry check');

        // Find all pending invitations that have expired
        $expiredInvitations = ConsultantInvitation::where('status', 'pending')
            ->where('expires_at', '<', now())
            ->get();

        Log::info("ExpireInvitationsJob: Found {$expiredInvitations->count()} expired invitations");

        foreach ($expiredInvitations as $invitation) {
            $this->processExpiredInvitation($invitation, $notificationService);
        }

        // Check for problem submissions that have all invitations expired
        $this->checkForRefunds($notificationService);

        Log::info('ExpireInvitationsJob: Completed');
    }

    /**
     * Process a single expired invitation.
     */
    private function processExpiredInvitation(ConsultantInvitation $invitation, NotificationService $notificationService): void
    {
        try {
            $invitation->update(['status' => 'expired']);

            AuditLog::log(
                'invitation_expired',
                null,
                ConsultantInvitation::class,
                $invitation->id,
                ['old_status' => 'pending'],
                ['new_status' => 'expired']
            );

            Log::info("ExpireInvitationsJob: Marked invitation {$invitation->id} as expired");
        } catch (\Exception $e) {
            Log::error("ExpireInvitationsJob: Failed to expire invitation {$invitation->id}", [
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Check for problem submissions that need refunds.
     */
    private function checkForRefunds(NotificationService $notificationService): void
    {
        // Find problem submissions that:
        // 1. Are in 'matching' status
        // 2. Have all invitations expired or declined (none pending or accepted)
        // 3. Haven't been refunded yet
        $problemsNeedingRefund = ProblemSubmission::where('status', 'matching')
            ->whereNull('refunded_at')
            ->whereDoesntHave('invitations', function ($query) {
                $query->whereIn('status', ['pending', 'accepted']);
            })
            ->whereHas('invitations') // Must have had at least one invitation
            ->with('user')
            ->get();

        Log::info("ExpireInvitationsJob: Found {$problemsNeedingRefund->count()} problems needing refund");

        foreach ($problemsNeedingRefund as $problem) {
            $this->processRefund($problem, $notificationService);
        }
    }

    /**
     * Process a refund for a problem submission.
     */
    private function processRefund(ProblemSubmission $problem, NotificationService $notificationService): void
    {
        DB::beginTransaction();
        try {
            $user = $problem->user;
            $refundAmount = $problem->submission_fee;

            // Add tokens back to user
            $user->increment('tokens_balance', $refundAmount);

            // Create refund transaction
            TokenTransaction::create([
                'user_id' => $user->id,
                'type' => 'refund',
                'amount' => $refundAmount,
                'balance_after' => $user->tokens_balance,
                'description' => "Refund for problem submission #{$problem->id} - no consultants available",
                'metadata' => [
                    'problem_submission_id' => $problem->id,
                    'reason' => 'no_consultants_accepted',
                ],
            ]);

            // Update problem status
            $problem->update([
                'status' => 'refunded',
                'refunded_at' => now(),
            ]);

            AuditLog::log(
                'problem_refunded',
                null,
                ProblemSubmission::class,
                $problem->id,
                null,
                [
                    'refund_amount' => $refundAmount,
                    'user_id' => $user->id,
                ]
            );

            DB::commit();

            // Send notification to user
            try {
                $notificationService->sendNotification(
                    $user,
                    'problem_refunded',
                    [
                        'problem_id' => $problem->id,
                        'refund_amount' => $refundAmount,
                        'message' => "We're sorry, but no consultants were available to help with your problem. Your {$refundAmount} tokens have been refunded to your account.",
                    ]
                );
            } catch (\Exception $e) {
                Log::warning("ExpireInvitationsJob: Failed to send refund notification", [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
            }

            Log::info("ExpireInvitationsJob: Refunded {$refundAmount} tokens for problem {$problem->id}");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("ExpireInvitationsJob: Failed to process refund for problem {$problem->id}", [
                'error' => $e->getMessage(),
            ]);
        }
    }
}

