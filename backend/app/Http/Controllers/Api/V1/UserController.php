<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password as PasswordRule;

class UserController extends Controller
{
    /**
     * Get user profile.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load(['subscription.plan', 'consultantProfile']);

        return response()->json([
            'user' => $this->formatProfileResponse($user),
        ]);
    }

    /**
     * Update user profile.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $oldValues = $user->only(['first_name', 'last_name', 'email']);
        
        $user->update($request->only(['first_name', 'last_name', 'email']));

        AuditLog::log(
            'profile_updated',
            $user->id,
            User::class,
            $user->id,
            $oldValues,
            $user->only(['first_name', 'last_name', 'email'])
        );

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $this->formatProfileResponse($user->fresh()),
        ]);
    }

    /**
     * Update user password.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => ['required', 'confirmed', PasswordRule::min(8)->mixedCase()->numbers()->symbols()],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
            ], 401);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        AuditLog::log('password_changed', $user->id, User::class, $user->id);

        // Revoke all tokens except current
        $user->tokens()->where('id', '!=', $request->user()->currentAccessToken()->id)->delete();

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }

    /**
     * Delete user account (GDPR compliance).
     */
    public function destroy(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Password is incorrect',
            ], 401);
        }

        AuditLog::log('account_deleted', $user->id, User::class, $user->id);

        // Revoke all tokens
        $user->tokens()->delete();

        // Soft delete the user
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully',
        ]);
    }

    /**
     * Get user notifications.
     */
    public function notifications(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $notifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'notifications' => $notifications->items(),
            'unread_count' => $user->unreadNotifications()->count(),
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    /**
     * Mark notification as read.
     */
    public function markNotificationRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read',
        ]);
    }

    /**
     * Update notification preferences.
     */
    public function updateNotificationPreferences(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'preferences' => 'required|array',
            'preferences.*.notification_type' => 'required|string',
            'preferences.*.email_enabled' => 'boolean',
            'preferences.*.push_enabled' => 'boolean',
            'preferences.*.in_app_enabled' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        foreach ($request->preferences as $pref) {
            $user->notificationPreferences()->updateOrCreate(
                ['notification_type' => $pref['notification_type']],
                [
                    'email_enabled' => $pref['email_enabled'] ?? true,
                    'push_enabled' => $pref['push_enabled'] ?? true,
                    'in_app_enabled' => $pref['in_app_enabled'] ?? true,
                ]
            );
        }

        return response()->json([
            'message' => 'Notification preferences updated',
        ]);
    }

    /**
     * Format profile response.
     */
    private function formatProfileResponse(User $user): array
    {
        $response = [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'full_name' => $user->full_name,
            'email' => $user->email,
            'role' => $user->role,
            'tokens_balance' => $user->tokens_balance,
            'email_verified_at' => $user->email_verified_at,
            'two_factor_enabled' => $user->two_factor_enabled,
            'has_subscription' => $user->hasActiveSubscription(),
            'subscription' => $user->subscription ? [
                'plan' => $user->subscription->plan->name ?? null,
                'status' => $user->subscription->status,
                'ends_at' => $user->subscription->ends_at,
                'days_until_expiration' => $user->subscription->days_until_expiration,
            ] : null,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];

        if ($user->isConsultant() && $user->consultantProfile) {
            $response['consultant_profile'] = [
                'specializations' => $user->consultantProfile->specializations,
                'bio' => $user->consultantProfile->bio,
                'languages' => $user->consultantProfile->languages,
                'status' => $user->consultantProfile->status,
                'is_available' => $user->consultantProfile->is_available,
            ];
        }

        return $response;
    }
}

