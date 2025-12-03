import React, { useState, useRef, useEffect } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn, formatRelativeTime } from '../../lib/utils';
import { useNotifications } from '../../hooks/useNotifications';
import type { Notification } from '../../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

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

export const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications({ autoFetch: true, pollInterval: 30000 });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    
    setIsOpen(false);
  };

  const displayedNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-muted transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-background border rounded-lg shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs text-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : displayedNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-10 w-10 mx-auto text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {displayedNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "w-full text-left p-4 hover:bg-muted/50 transition-colors",
                      !notification.read_at && "bg-primary/5"
                    )}
                  >
                    <div className="flex gap-3">
                      <span className="text-xl" role="img" aria-hidden>
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm",
                          !notification.read_at && "font-medium"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(notification.created_at)}
                        </p>
                      </div>
                      {!notification.read_at && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 5 && (
            <div className="p-3 border-t">
              <Button
                variant="ghost"
                className="w-full text-sm"
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

