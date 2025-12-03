import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Alert, AlertDescription } from '../components/ui/Alert';
import {
  Bell,
  Check,
  CheckCheck,
  Settings,
  Loader2,
  AlertCircle,
  Mail,
  Smartphone,
  Monitor
} from 'lucide-react';
import { cn, formatRelativeTime } from '../lib/utils';
import { useNotifications } from '../hooks/useNotifications';
import type { Notification } from '../hooks/useNotifications';
import api from '../services/api';

interface NotificationPreference {
  notification_type: string;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
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

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'settings'>('all');
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications({ autoFetch: true });

  useEffect(() => {
    if (activeTab === 'settings') {
      loadPreferences();
    }
  }, [activeTab]);

  const loadPreferences = async () => {
    setIsLoadingPreferences(true);
    setPreferencesError(null);
    try {
      const response = await api.get('/notifications/preferences');
      setPreferences(response.data.preferences);
    } catch (err: any) {
      setPreferencesError(err.response?.data?.message || 'Failed to load preferences');
    } finally {
      setIsLoadingPreferences(false);
    }
  };

  const handlePreferenceChange = (type: string, field: keyof NotificationPreference, value: boolean) => {
    setPreferences(prev =>
      prev.map(p =>
        p.notification_type === type ? { ...p, [field]: value } : p
      )
    );
  };

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    setPreferencesError(null);
    try {
      await api.put('/notifications/preferences', { preferences });
    } catch (err: any) {
      setPreferencesError(err.response?.data?.message || 'Failed to save preferences');
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    const data = notification.data as Record<string, any>;
    switch (notification.type) {
      case 'consultation_matched':
      case 'consultation_started':
      case 'consultation_ended':
        if (data.consultation_id) {
          navigate(`/consultation/${data.consultation_id}`);
        }
        break;
      case 'consultation_request':
        navigate('/consultant/requests');
        break;
      case 'token_purchase':
      case 'token_low':
        navigate('/tokens');
        break;
      case 'subscription_renewed':
      case 'subscription_expiring':
        navigate('/subscription');
        break;
      case 'profile_approved':
        navigate('/consultant');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && activeTab === 'all' && (
          <Button variant="outline" onClick={() => markAllAsRead()}>
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
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
        <div className="space-y-6">
          {preferencesError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{preferencesError}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPreferences ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
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
                  {preferences.map((pref) => (
                    <div key={pref.notification_type} className="grid grid-cols-4 gap-4 items-center">
                      <div className="text-sm">
                        {NOTIFICATION_TYPE_LABELS[pref.notification_type] || pref.notification_type}
                      </div>
                      <div className="text-center">
                        <input
                          type="checkbox"
                          checked={pref.email_enabled}
                          onChange={(e) => handlePreferenceChange(pref.notification_type, 'email_enabled', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="checkbox"
                          checked={pref.push_enabled}
                          onChange={(e) => handlePreferenceChange(pref.notification_type, 'push_enabled', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="checkbox"
                          checked={pref.in_app_enabled}
                          onChange={(e) => handlePreferenceChange(pref.notification_type, 'in_app_enabled', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Save Button */}
                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleSavePreferences}
                      disabled={isSavingPreferences}
                    >
                      {isSavingPreferences ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Save Preferences
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

