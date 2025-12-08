import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Layout } from '@/Components/layout';
import { Button } from '@/Components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/Card';
import { Alert, AlertDescription } from '@/Components/ui/Alert';
import {
  Bell,
  Check,
  CheckCheck,
  Settings,
  AlertCircle,
  Mail,
  Smartphone,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
  data: Record<string, unknown>;
}

interface NotificationsPageProps extends PageProps {
  notifications?: Notification[];
  unread_count?: number;
}

const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  consultation_matched: 'Consultation Matched',
  consultation_started: 'Consultation Started',
  consultation_ended: 'Consultation Ended',
  consultation_cancelled: 'Consultation Cancelled',
  consultation_request: 'Consultation Request',
  token_purchase: 'Token Purchase',
  token_low: 'Low Token Balance',
  subscription_renewed: 'Subscription Renewed',
  subscription_expiring: 'Subscription Expiring',
  profile_approved: 'Profile Approved',
  new_message: 'New Message',
  system: 'System Notifications',
};

const getNotificationIcon = (type: string): string => {
  switch (type) {
    case 'consultation_matched':
      return '🎯';
    case 'consultation_started':
      return '🎬';
    case 'consultation_ended':
      return '✅';
    case 'consultation_request':
      return '📩';
    case 'token_purchase':
      return '💰';
    case 'token_low':
      return '⚠️';
    case 'subscription_renewed':
      return '🔄';
    case 'subscription_expiring':
      return '⏰';
    case 'profile_approved':
      return '🎉';
    case 'new_message':
      return '💬';
    default:
      return '📢';
  }
};

export default function Notifications() {
  const { notifications = [], unread_count = 0 } = usePage<NotificationsPageProps>().props;
  const [activeTab, setActiveTab] = useState<'all' | 'settings'>('all');
  const [error, setError] = useState<string | null>(null);

  const markAsRead = (id: string) => {
    router.post(`/notifications/${id}/read`, {}, {
      preserveScroll: true,
      onError: () => setError('Failed to mark notification as read'),
    });
  };

  const markAllAsRead = () => {
    router.post('/notifications/read-all', {}, {
      preserveScroll: true,
      onError: () => setError('Failed to mark all notifications as read'),
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    const data = notification.data;
    switch (notification.type) {
      case 'consultation_matched':
      case 'consultation_started':
      case 'consultation_ended':
        if (data.consultation_id) {
          router.visit(`/consultation/${data.consultation_id}`);
        }
        break;
      case 'consultation_request':
        router.visit('/consultant/requests');
        break;
      case 'token_purchase':
      case 'token_low':
        router.visit('/tokens');
        break;
      case 'subscription_renewed':
      case 'subscription_expiring':
        router.visit('/pricing');
        break;
      case 'profile_approved':
        router.visit('/consultant');
        break;
      default:
        break;
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              {unread_count > 0 ? `${unread_count} unread` : 'All caught up!'}
            </p>
          </div>
          {unread_count > 0 && activeTab === 'all' && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              "pb-2 px-1 text-sm font-medium transition-colors",
              activeTab === 'all'
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Bell className="h-4 w-4 inline mr-2" />
            All Notifications
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "pb-2 px-1 text-sm font-medium transition-colors",
              activeTab === 'settings'
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Settings className="h-4 w-4 inline mr-2" />
            Preferences
          </button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* All Notifications Tab */}
        {activeTab === 'all' && (
          <Card>
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No notifications</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You're all caught up! New notifications will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "w-full text-left p-4 hover:bg-muted/50 transition-colors",
                        !notification.read_at && "bg-primary/5"
                      )}
                    >
                      <div className="flex gap-4">
                        <span className="text-2xl" role="img" aria-hidden>
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              "text-sm",
                              !notification.read_at && "font-medium"
                            )}>
                              {notification.title}
                            </p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatRelativeTime(notification.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read_at && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Preferences Tab */}
        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Header */}
                <div className="grid grid-cols-4 gap-4 pb-4 border-b text-sm font-medium">
                  <div>Notification Type</div>
                  <div className="text-center">
                    <Mail className="h-4 w-4 mx-auto mb-1" />
                    Email
                  </div>
                  <div className="text-center">
                    <Smartphone className="h-4 w-4 mx-auto mb-1" />
                    Push
                  </div>
                  <div className="text-center">
                    <Monitor className="h-4 w-4 mx-auto mb-1" />
                    In-App
                  </div>
                </div>

                {/* Preferences */}
                {Object.entries(NOTIFICATION_TYPE_LABELS).map(([type, label]) => (
                  <div key={type} className="grid grid-cols-4 gap-4 items-center">
                    <div className="text-sm">{label}</div>
                    <div className="text-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300"
                      />
                    </div>
                    <div className="text-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300"
                      />
                    </div>
                    <div className="text-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300"
                      />
                    </div>
                  </div>
                ))}

                {/* Save Button */}
                <div className="pt-4 border-t">
                  <Button>
                    <Check className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
