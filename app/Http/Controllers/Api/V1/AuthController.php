<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Validation\Rules\Password as PasswordRule;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:users|alpha_dash',
            'date_of_birth' => 'required|date|before:-13 years', // Must be at least 13 years old
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', PasswordRule::min(8)->mixedCase()->numbers()->symbols()],
            'role' => 'sometimes|in:user,consultant',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'date_of_birth' => $request->date_of_birth,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? User::ROLE_USER,
            'tokens_balance' => 0,
        ]);

        event(new Registered($user));

        AuditLog::log('user_registered', $user->id, User::class, $user->id);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful. Please complete your profile.',
            'user' => $this->formatUserResponse($user),
            'token' => $token,
        ], 201);
    }

    /**
     * Login user.
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            AuditLog::log('login_failed', null, null, null, null, null, [
                'email' => $request->email,
            ]);

            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        // Check if 2FA is enabled
        if ($user->two_factor_enabled) {
            return response()->json([
                'message' => 'Two-factor authentication required',
                'requires_2fa' => true,
                'user_id' => $user->id,
            ], 200);
        }

        AuditLog::log('login_success', $user->id, User::class, $user->id);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $this->formatUserResponse($user),
            'token' => $token,
        ]);
    }

    /**
     * Logout user.
     */
    public function logout(Request $request): JsonResponse
    {
        AuditLog::log('logout', $request->user()->id, User::class, $request->user()->id);

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get authenticated user.
     */
    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->formatUserResponse($request->user()),
        ]);
    }

    /**
     * Refresh token.
     */
    public function refreshToken(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        $token = $request->user()->createToken('auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
        ]);
    }

    /**
     * Send password reset link.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Password reset link sent to your email',
            ]);
        }

        return response()->json([
            'message' => 'Unable to send password reset link',
        ], 400);
    }

    /**
     * Reset password.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', PasswordRule::min(8)->mixedCase()->numbers()->symbols()],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                AuditLog::log('password_reset', $user->id, User::class, $user->id);
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Password has been reset successfully',
            ]);
        }

        return response()->json([
            'message' => 'Unable to reset password',
        ], 400);
    }

    /**
     * Verify email.
     */
    public function verifyEmail(Request $request, int $id, string $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json([
                'message' => 'Invalid verification link',
            ], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified',
            ]);
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        AuditLog::log('email_verified', $user->id, User::class, $user->id);

        return response()->json([
            'message' => 'Email verified successfully',
        ]);
    }

    /**
     * Resend verification email.
     */
    public function resendVerification(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified',
            ]);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Verification email sent',
        ]);
    }

    /**
     * Enable 2FA.
     */
    public function enable2FA(Request $request): JsonResponse
    {
        $user = $request->user();

        // Generate a secret (in production, use a proper 2FA library like Google2FA)
        $secret = bin2hex(random_bytes(16));

        $user->update([
            'two_factor_secret' => encrypt($secret),
            'two_factor_enabled' => false, // Will be enabled after verification
        ]);

        return response()->json([
            'message' => '2FA setup initiated',
            'secret' => $secret,
            // In production, also return QR code URL
        ]);
    }

    /**
     * Verify and enable 2FA.
     */
    public function verify2FA(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|size:6',
            'user_id' => 'sometimes|integer', // For login flow
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // For login flow
        if ($request->has('user_id')) {
            $user = User::findOrFail($request->user_id);
            
            // In production, verify the code against the secret
            // For now, we'll just check if it's 6 digits
            if (!preg_match('/^\d{6}$/', $request->code)) {
                return response()->json([
                    'message' => 'Invalid 2FA code',
                ], 401);
            }

            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => '2FA verification successful',
                'user' => $this->formatUserResponse($user),
                'token' => $token,
            ]);
        }

        // For enabling 2FA
        $user = $request->user();
        
        // In production, verify the code against the secret
        $user->update(['two_factor_enabled' => true]);

        AuditLog::log('2fa_enabled', $user->id, User::class, $user->id);

        return response()->json([
            'message' => '2FA enabled successfully',
        ]);
    }

    /**
     * Disable 2FA.
     */
    public function disable2FA(Request $request): JsonResponse
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
                'message' => 'Invalid password',
            ], 401);
        }

        $user->update([
            'two_factor_secret' => null,
            'two_factor_enabled' => false,
        ]);

        AuditLog::log('2fa_disabled', $user->id, User::class, $user->id);

        return response()->json([
            'message' => '2FA disabled successfully',
        ]);
    }

    /**
     * Format user response.
     */
    private function formatUserResponse(User $user): array
    {
        $user->load('subscription.plan');

        return [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'username' => $user->username,
            'full_name' => $user->full_name,
            'email' => $user->email,
            'date_of_birth' => $user->date_of_birth,
            'bio' => $user->bio,
            'profile_photo_url' => $user->profile_photo_url,
            'development_competency' => $user->development_competency,
            'profile_completed_at' => $user->profile_completed_at,
            'role' => $user->role,
            'tokens_balance' => $user->tokens_balance,
            'email_verified_at' => $user->email_verified_at,
            'two_factor_enabled' => $user->two_factor_enabled,
            'has_subscription' => $user->hasActiveSubscription(),
            'subscription' => $user->subscription ? [
                'plan' => $user->subscription->plan->name ?? null,
                'status' => $user->subscription->status,
                'ends_at' => $user->subscription->ends_at,
            ] : null,
            'created_at' => $user->created_at,
        ];
    }
}

