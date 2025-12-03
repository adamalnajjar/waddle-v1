<?php

namespace App\Services;

use App\Models\User;
use App\Models\Consultation;
use App\Models\ConsultationMessage;
use App\Models\ConsultationFile;
use App\Models\TokenTransaction;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class GdprService
{
    /**
     * Export all user data for GDPR compliance.
     */
    public function exportUserData(User $user): array
    {
        return [
            'user' => $this->getUserData($user),
            'consultations' => $this->getConsultationsData($user),
            'transactions' => $this->getTransactionsData($user),
            'messages' => $this->getMessagesData($user),
            'files' => $this->getFilesData($user),
            'audit_logs' => $this->getAuditLogsData($user),
            'exported_at' => now()->toISOString(),
        ];
    }

    /**
     * Get user's personal data.
     */
    private function getUserData(User $user): array
    {
        return [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'role' => $user->role,
            'tokens_balance' => $user->tokens_balance,
            'email_verified_at' => $user->email_verified_at?->toISOString(),
            'two_factor_enabled' => $user->two_factor_enabled,
            'created_at' => $user->created_at->toISOString(),
            'updated_at' => $user->updated_at->toISOString(),
            'consultant_profile' => $user->consultantProfile ? [
                'specializations' => $user->consultantProfile->specializations,
                'bio' => $user->consultantProfile->bio,
                'languages' => $user->consultantProfile->languages,
                'hourly_rate' => $user->consultantProfile->hourly_rate,
                'status' => $user->consultantProfile->status,
            ] : null,
            'subscription' => $user->subscription ? [
                'plan' => $user->subscription->plan->name ?? null,
                'status' => $user->subscription->status,
                'starts_at' => $user->subscription->starts_at?->toISOString(),
                'ends_at' => $user->subscription->ends_at?->toISOString(),
            ] : null,
            'notification_preferences' => $user->notificationPreferences->toArray(),
        ];
    }

    /**
     * Get user's consultation data.
     */
    private function getConsultationsData(User $user): array
    {
        return $user->consultations()
            ->with(['consultant.user', 'consultationRequest'])
            ->get()
            ->map(function ($consultation) {
                return [
                    'id' => $consultation->id,
                    'status' => $consultation->status,
                    'started_at' => $consultation->started_at?->toISOString(),
                    'ended_at' => $consultation->ended_at?->toISOString(),
                    'duration_minutes' => $consultation->duration_minutes,
                    'tokens_charged' => $consultation->tokens_charged,
                    'user_rating' => $consultation->user_rating,
                    'user_feedback' => $consultation->user_feedback,
                    'consultant_name' => $consultation->consultant?->user?->full_name,
                    'problem_description' => $consultation->consultationRequest?->problem_description,
                    'tech_stack' => $consultation->consultationRequest?->tech_stack,
                    'created_at' => $consultation->created_at->toISOString(),
                ];
            })
            ->toArray();
    }

    /**
     * Get user's transaction data.
     */
    private function getTransactionsData(User $user): array
    {
        return $user->tokenTransactions()
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'type' => $transaction->type,
                    'amount' => $transaction->amount,
                    'balance_after' => $transaction->balance_after,
                    'description' => $transaction->description,
                    'created_at' => $transaction->created_at->toISOString(),
                ];
            })
            ->toArray();
    }

    /**
     * Get user's messages data.
     */
    private function getMessagesData(User $user): array
    {
        return ConsultationMessage::where('user_id', $user->id)
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'consultation_id' => $message->consultation_id,
                    'message' => $message->message,
                    'type' => $message->type,
                    'created_at' => $message->created_at->toISOString(),
                ];
            })
            ->toArray();
    }

    /**
     * Get user's uploaded files data.
     */
    private function getFilesData(User $user): array
    {
        return ConsultationFile::where('uploaded_by', $user->id)
            ->get()
            ->map(function ($file) {
                return [
                    'id' => $file->id,
                    'consultation_id' => $file->consultation_id,
                    'original_name' => $file->original_name,
                    'mime_type' => $file->mime_type,
                    'size' => $file->size,
                    'created_at' => $file->created_at->toISOString(),
                ];
            })
            ->toArray();
    }

    /**
     * Get user's audit logs.
     */
    private function getAuditLogsData(User $user): array
    {
        return AuditLog::where('user_id', $user->id)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'ip_address' => $log->ip_address,
                    'created_at' => $log->created_at->toISOString(),
                ];
            })
            ->toArray();
    }

    /**
     * Delete all user data (right to be forgotten).
     */
    public function deleteUserData(User $user): bool
    {
        try {
            DB::beginTransaction();

            // Delete consultation files from storage
            $files = ConsultationFile::where('uploaded_by', $user->id)->get();
            foreach ($files as $file) {
                Storage::disk('private')->delete($file->path);
            }

            // Delete related records
            ConsultationFile::where('uploaded_by', $user->id)->delete();
            ConsultationMessage::where('user_id', $user->id)->delete();
            
            // Anonymize consultations instead of deleting
            Consultation::where('user_id', $user->id)->update([
                'notes' => '[DELETED USER]',
                'user_feedback' => null,
            ]);

            // Delete token transactions
            TokenTransaction::where('user_id', $user->id)->delete();

            // Delete notification preferences
            $user->notificationPreferences()->delete();

            // Delete subscription
            if ($user->subscription) {
                $user->subscription->delete();
            }

            // Delete consultant profile if exists
            if ($user->consultantProfile) {
                $user->consultantProfile->availability()->delete();
                $user->consultantProfile->delete();
            }

            // Delete Stripe customer record
            if ($user->stripeCustomer) {
                $user->stripeCustomer->delete();
            }

            // Log the deletion
            AuditLog::log('user_data_deleted', $user->id, User::class, $user->id);

            // Finally, delete the user
            $user->delete();

            DB::commit();

            Log::info('User data deleted for GDPR compliance', ['user_id' => $user->id]);

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete user data', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Anonymize user data (alternative to deletion).
     */
    public function anonymizeUserData(User $user): bool
    {
        try {
            DB::beginTransaction();

            $anonymizedId = 'anon_' . $user->id;

            $user->update([
                'first_name' => 'Deleted',
                'last_name' => 'User',
                'email' => $anonymizedId . '@deleted.local',
                'password' => bcrypt(str()->random(32)),
                'two_factor_secret' => null,
                'two_factor_enabled' => false,
            ]);

            // Anonymize consultation feedback
            Consultation::where('user_id', $user->id)->update([
                'user_feedback' => null,
            ]);

            // Delete messages content but keep structure
            ConsultationMessage::where('user_id', $user->id)->update([
                'message' => '[ANONYMIZED]',
            ]);

            AuditLog::log('user_data_anonymized', $user->id, User::class, $user->id);

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to anonymize user data', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Get data retention policy.
     */
    public function getRetentionPolicy(): array
    {
        return [
            'user_data' => '3 years after account deletion request',
            'consultation_records' => '7 years for legal compliance',
            'payment_records' => '7 years for tax compliance',
            'audit_logs' => '2 years',
            'session_recordings' => '90 days',
        ];
    }
}

