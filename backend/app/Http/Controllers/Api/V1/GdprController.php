<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\GdprService;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class GdprController extends Controller
{
    private GdprService $gdprService;

    public function __construct(GdprService $gdprService)
    {
        $this->gdprService = $gdprService;
    }

    /**
     * Export user's personal data.
     */
    public function exportData(Request $request): JsonResponse
    {
        $user = $request->user();
        
        AuditLog::log('gdpr_data_export', $user->id, get_class($user), $user->id);

        $data = $this->gdprService->exportUserData($user);

        return response()->json([
            'message' => 'Your data has been exported',
            'data' => $data,
        ]);
    }

    /**
     * Download user's personal data as JSON file.
     */
    public function downloadData(Request $request)
    {
        $user = $request->user();
        
        AuditLog::log('gdpr_data_download', $user->id, get_class($user), $user->id);

        $data = $this->gdprService->exportUserData($user);
        
        $filename = 'waddle_data_export_' . $user->id . '_' . now()->format('Y-m-d') . '.json';

        return response()->streamDownload(function () use ($data) {
            echo json_encode($data, JSON_PRETTY_PRINT);
        }, $filename, [
            'Content-Type' => 'application/json',
        ]);
    }

    /**
     * Request account deletion.
     */
    public function requestDeletion(Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|string',
            'confirm' => 'required|boolean|accepted',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid password',
            ], 403);
        }

        // In production, you might want to:
        // 1. Send a confirmation email
        // 2. Schedule deletion after a grace period (e.g., 30 days)
        // 3. Allow cancellation during grace period

        AuditLog::log('gdpr_deletion_requested', $user->id, get_class($user), $user->id);

        $success = $this->gdprService->deleteUserData($user);

        if (!$success) {
            return response()->json([
                'message' => 'Failed to delete account. Please contact support.',
            ], 500);
        }

        return response()->json([
            'message' => 'Your account and all associated data have been deleted.',
        ]);
    }

    /**
     * Request data anonymization (alternative to deletion).
     */
    public function requestAnonymization(Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|string',
            'confirm' => 'required|boolean|accepted',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid password',
            ], 403);
        }

        AuditLog::log('gdpr_anonymization_requested', $user->id, get_class($user), $user->id);

        $success = $this->gdprService->anonymizeUserData($user);

        if (!$success) {
            return response()->json([
                'message' => 'Failed to anonymize account. Please contact support.',
            ], 500);
        }

        return response()->json([
            'message' => 'Your account has been anonymized.',
        ]);
    }

    /**
     * Get data retention policy.
     */
    public function retentionPolicy(): JsonResponse
    {
        return response()->json([
            'policy' => $this->gdprService->getRetentionPolicy(),
        ]);
    }

    /**
     * Get privacy settings.
     */
    public function privacySettings(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'settings' => [
                'email_verified' => $user->email_verified_at !== null,
                'two_factor_enabled' => $user->two_factor_enabled,
                'notification_preferences' => $user->notificationPreferences->count() > 0,
            ],
            'data_collected' => [
                'personal_info' => 'Name, email address',
                'usage_data' => 'Consultation history, messages',
                'payment_data' => 'Transaction history (no card details stored)',
                'technical_data' => 'IP address, browser info for security',
            ],
            'your_rights' => [
                'access' => 'Request a copy of your data',
                'rectification' => 'Update your personal information',
                'erasure' => 'Request deletion of your data',
                'portability' => 'Export your data in JSON format',
                'restriction' => 'Limit how we process your data',
                'objection' => 'Object to certain processing activities',
            ],
        ]);
    }
}

