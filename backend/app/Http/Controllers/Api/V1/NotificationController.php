<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use App\Models\NotificationPreference;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    private NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get user notifications.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $notifications = $this->notificationService->getUserNotifications($user);

        $formattedNotifications = collect($notifications->items())->map(function ($notification) {
            $data = json_decode($notification->data, true);
            return [
                'id' => $notification->id,
                'type' => $notification->type,
                'title' => $data['title'] ?? '',
                'message' => $data['message'] ?? '',
                'data' => $data['data'] ?? [],
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
            ];
        });

        return response()->json([
            'notifications' => $formattedNotifications,
            'unread_count' => $this->notificationService->getUnreadCount($user),
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    /**
     * Get unread notification count.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = $this->notificationService->getUnreadCount($request->user());

        return response()->json([
            'unread_count' => $count,
        ]);
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $success = $this->notificationService->markAsRead($id, $request->user());

        if (!$success) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $count = $this->notificationService->markAllAsRead($request->user());

        return response()->json([
            'message' => 'All notifications marked as read',
            'count' => $count,
        ]);
    }

    /**
     * Get notification preferences.
     */
    public function getPreferences(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $preferences = NotificationPreference::where('user_id', $user->id)
            ->get()
            ->keyBy('notification_type');

        // Define all notification types with defaults
        $allTypes = [
            NotificationService::TYPE_CONSULTATION_MATCHED,
            NotificationService::TYPE_CONSULTATION_STARTED,
            NotificationService::TYPE_CONSULTATION_ENDED,
            NotificationService::TYPE_CONSULTATION_CANCELLED,
            NotificationService::TYPE_CONSULTATION_REQUEST,
            NotificationService::TYPE_TOKEN_PURCHASE,
            NotificationService::TYPE_TOKEN_LOW,
            NotificationService::TYPE_SUBSCRIPTION_RENEWED,
            NotificationService::TYPE_SUBSCRIPTION_EXPIRING,
            NotificationService::TYPE_PROFILE_APPROVED,
            NotificationService::TYPE_NEW_MESSAGE,
            NotificationService::TYPE_SYSTEM,
        ];

        $formattedPreferences = collect($allTypes)->map(function ($type) use ($preferences) {
            $pref = $preferences->get($type);
            return [
                'notification_type' => $type,
                'email_enabled' => $pref?->email_enabled ?? true,
                'push_enabled' => $pref?->push_enabled ?? true,
                'in_app_enabled' => $pref?->in_app_enabled ?? true,
            ];
        });

        return response()->json([
            'preferences' => $formattedPreferences,
        ]);
    }

    /**
     * Update notification preferences.
     */
    public function updatePreferences(Request $request): JsonResponse
    {
        $request->validate([
            'preferences' => 'required|array',
            'preferences.*.notification_type' => 'required|string',
            'preferences.*.email_enabled' => 'sometimes|boolean',
            'preferences.*.push_enabled' => 'sometimes|boolean',
            'preferences.*.in_app_enabled' => 'sometimes|boolean',
        ]);

        $user = $request->user();

        foreach ($request->preferences as $pref) {
            NotificationPreference::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'notification_type' => $pref['notification_type'],
                ],
                [
                    'email_enabled' => $pref['email_enabled'] ?? true,
                    'push_enabled' => $pref['push_enabled'] ?? true,
                    'in_app_enabled' => $pref['in_app_enabled'] ?? true,
                ]
            );
        }

        return response()->json([
            'message' => 'Preferences updated successfully',
        ]);
    }
}

