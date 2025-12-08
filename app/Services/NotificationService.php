<?php

namespace App\Services;

use App\Models\User;
use App\Models\NotificationPreference;
use App\Events\NotificationSent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class NotificationService
{
    /**
     * Notification types.
     */
    public const TYPE_CONSULTATION_MATCHED = 'consultation_matched';
    public const TYPE_CONSULTATION_STARTED = 'consultation_started';
    public const TYPE_CONSULTATION_ENDED = 'consultation_ended';
    public const TYPE_CONSULTATION_CANCELLED = 'consultation_cancelled';
    public const TYPE_CONSULTATION_REQUEST = 'consultation_request';
    public const TYPE_TOKEN_PURCHASE = 'token_purchase';
    public const TYPE_TOKEN_LOW = 'token_low';
    public const TYPE_SUBSCRIPTION_RENEWED = 'subscription_renewed';
    public const TYPE_SUBSCRIPTION_EXPIRING = 'subscription_expiring';
    public const TYPE_PROFILE_APPROVED = 'profile_approved';
    public const TYPE_NEW_MESSAGE = 'new_message';
    public const TYPE_SYSTEM = 'system';

    /**
     * Send a notification to a user.
     */
    public function send(
        User $user,
        string $type,
        string $title,
        string $message,
        array $data = [],
        bool $sendEmail = true,
        bool $sendPush = true
    ): void {
        try {
            // Check user preferences
            $preferences = $this->getUserPreferences($user, $type);

            // Create in-app notification
            if ($preferences['in_app']) {
                $this->createInAppNotification($user, $type, $title, $message, $data);
            }

            // Send email notification
            if ($sendEmail && $preferences['email']) {
                $this->sendEmailNotification($user, $type, $title, $message, $data);
            }

            // Send push notification (placeholder for future implementation)
            if ($sendPush && $preferences['push']) {
                $this->sendPushNotification($user, $type, $title, $message, $data);
            }

        } catch (\Exception $e) {
            Log::error('Failed to send notification', [
                'user_id' => $user->id,
                'type' => $type,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Get user notification preferences for a specific type.
     */
    private function getUserPreferences(User $user, string $type): array
    {
        $preference = NotificationPreference::where('user_id', $user->id)
            ->where('notification_type', $type)
            ->first();

        if (!$preference) {
            // Return defaults
            return [
                'email' => true,
                'push' => true,
                'in_app' => true,
            ];
        }

        return [
            'email' => $preference->email_enabled,
            'push' => $preference->push_enabled,
            'in_app' => $preference->in_app_enabled,
        ];
    }

    /**
     * Create an in-app notification.
     */
    private function createInAppNotification(
        User $user,
        string $type,
        string $title,
        string $message,
        array $data
    ): void {
        $notification = DB::table('notifications')->insertGetId([
            'id' => Str::uuid(),
            'type' => $type,
            'notifiable_type' => User::class,
            'notifiable_id' => $user->id,
            'data' => json_encode([
                'title' => $title,
                'message' => $message,
                'data' => $data,
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Broadcast the notification via WebSocket
        event(new NotificationSent($user->id, [
            'id' => $notification,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
            'read_at' => null,
            'created_at' => now()->toISOString(),
        ]));
    }

    /**
     * Send an email notification.
     */
    private function sendEmailNotification(
        User $user,
        string $type,
        string $title,
        string $message,
        array $data
    ): void {
        // In production, you would use a Mailable class
        // For now, we'll log the email
        Log::info('Email notification sent', [
            'user_id' => $user->id,
            'email' => $user->email,
            'type' => $type,
            'title' => $title,
        ]);

        // Example using Mail facade (uncomment in production):
        // Mail::to($user->email)->send(new NotificationMail($type, $title, $message, $data));
    }

    /**
     * Send a push notification.
     */
    private function sendPushNotification(
        User $user,
        string $type,
        string $title,
        string $message,
        array $data
    ): void {
        // Placeholder for push notification implementation
        // In production, integrate with Firebase Cloud Messaging, OneSignal, etc.
        Log::info('Push notification sent', [
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
        ]);
    }

    /**
     * Send consultation matched notification.
     */
    public function sendConsultationMatchedNotification(User $user, int $consultantId, string $consultantName): void
    {
        $this->send(
            $user,
            self::TYPE_CONSULTATION_MATCHED,
            'Consultant Matched!',
            "You've been matched with {$consultantName}. You can now start your consultation.",
            [
                'consultant_id' => $consultantId,
                'consultant_name' => $consultantName,
            ]
        );
    }

    /**
     * Send consultation request notification to consultant.
     */
    public function sendConsultationRequestNotification(User $consultant, int $requestId, string $userName): void
    {
        $this->send(
            $consultant,
            self::TYPE_CONSULTATION_REQUEST,
            'New Consultation Request',
            "{$userName} is requesting a consultation with you.",
            [
                'request_id' => $requestId,
                'user_name' => $userName,
            ]
        );
    }

    /**
     * Send consultation started notification.
     */
    public function sendConsultationStartedNotification(User $user, int $consultationId): void
    {
        $this->send(
            $user,
            self::TYPE_CONSULTATION_STARTED,
            'Consultation Started',
            'Your consultation session has started.',
            [
                'consultation_id' => $consultationId,
            ]
        );
    }

    /**
     * Send consultation ended notification.
     */
    public function sendConsultationEndedNotification(
        User $user,
        int $consultationId,
        int $durationMinutes,
        int $tokensCharged
    ): void {
        $this->send(
            $user,
            self::TYPE_CONSULTATION_ENDED,
            'Consultation Ended',
            "Your consultation has ended. Duration: {$durationMinutes} minutes. Tokens charged: {$tokensCharged}.",
            [
                'consultation_id' => $consultationId,
                'duration_minutes' => $durationMinutes,
                'tokens_charged' => $tokensCharged,
            ]
        );
    }

    /**
     * Send low token balance notification.
     */
    public function sendLowTokenNotification(User $user, int $balance): void
    {
        $this->send(
            $user,
            self::TYPE_TOKEN_LOW,
            'Low Token Balance',
            "Your token balance is running low ({$balance} tokens remaining). Consider purchasing more tokens.",
            [
                'balance' => $balance,
            ]
        );
    }

    /**
     * Send subscription expiring notification.
     */
    public function sendSubscriptionExpiringNotification(User $user, int $daysRemaining): void
    {
        $this->send(
            $user,
            self::TYPE_SUBSCRIPTION_EXPIRING,
            'Subscription Expiring Soon',
            "Your subscription will expire in {$daysRemaining} days. Renew now to keep your benefits.",
            [
                'days_remaining' => $daysRemaining,
            ]
        );
    }

    /**
     * Send profile approved notification.
     */
    public function sendProfileApprovedNotification(User $user): void
    {
        $this->send(
            $user,
            self::TYPE_PROFILE_APPROVED,
            'Profile Approved!',
            'Your consultant profile has been approved. You can now start accepting consultations.',
            []
        );
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(string $notificationId, User $user): bool
    {
        return DB::table('notifications')
            ->where('id', $notificationId)
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', User::class)
            ->update(['read_at' => now()]) > 0;
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(User $user): int
    {
        return DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', User::class)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    /**
     * Get user notifications.
     */
    public function getUserNotifications(User $user, int $perPage = 20)
    {
        return DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', User::class)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get unread notification count.
     */
    public function getUnreadCount(User $user): int
    {
        return DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', User::class)
            ->whereNull('read_at')
            ->count();
    }
}

