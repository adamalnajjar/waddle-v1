import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Layout } from '@/Components/layout';
import { Button } from '@/Components/ui/Button.tsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/Card.tsx';
import { Alert, AlertDescription } from '@/Components/ui/Alert.tsx';
import {
  Users,
  Clock,
  DollarSign,
  Star,
  Calendar,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  TrendingUp,
  Video,
  Loader2,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import type { PageProps } from '@/types';

interface DashboardStats {
  pending_requests: number;
  active_consultations: number;
  today_scheduled: number;
  weekly_completed: number;
  monthly_earnings: number;
}

interface ActiveConsultation {
  id: number;
  status: string;
  user: {
    id: number;
    full_name: string;
  };
  consultationRequest: {
    problem_description: string;
    tech_stack: string[];
  };
  started_at: string;
}

interface Review {
  id: number;
  user: {
    id: number;
    full_name: string;
  };
  user_rating: number;
  user_feedback: string | null;
  ended_at: string;
}

interface ConsultantDashboardProps extends PageProps {
  stats?: DashboardStats;
  active_consultations?: ActiveConsultation[];
  recent_reviews?: Review[];
  profile?: {
    is_available: boolean;
    status: 'pending' | 'approved' | 'suspended';
  };
}

export default function ConsultantDashboard() {
  const {
    stats,
    active_consultations = [],
    recent_reviews = [],
    profile
  } = usePage<ConsultantDashboardProps>().props;

  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localProfile, setLocalProfile] = useState(profile);

  const handleToggleAvailability = async () => {
    setIsTogglingAvailability(true);
    router.post('/consultant/toggle-availability', {}, {
      onSuccess: () => {
        setLocalProfile(prev => prev ? { ...prev, is_available: !prev.is_available } : prev);
      },
      onError: () => {
        setError('Failed to toggle availability');
      },
      onFinish: () => {
        setIsTogglingAvailability(false);
      },
    });
  };

  const handleRefresh = () => {
    router.reload();
  };

  const isApproved = localProfile?.status === 'approved';

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Consultant Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your consultations and availability
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Availability Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Availability</span>
              <Button
                variant={localProfile?.is_available ? 'default' : 'outline'}
                size="sm"
                onClick={handleToggleAvailability}
                disabled={!isApproved || isTogglingAvailability}
              >
                {isTogglingAvailability ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : localProfile?.is_available ? (
                  <Play className="h-4 w-4 mr-2" />
                ) : (
                  <Pause className="h-4 w-4 mr-2" />
                )}
                {localProfile?.is_available ? 'Available' : 'Unavailable'}
              </Button>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Approval Status */}
        {!isApproved && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {localProfile?.status === 'pending'
                ? 'Your profile is pending approval. You will be able to receive consultations once approved.'
                : 'Your account has been suspended. Please contact support for more information.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                  <p className="text-2xl font-bold">{stats?.pending_requests || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Sessions</p>
                  <p className="text-2xl font-bold">{stats?.active_consultations || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Video className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today Scheduled</p>
                  <p className="text-2xl font-bold">{stats?.today_scheduled || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">{stats?.weekly_completed || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                  <p className="text-2xl font-bold">{stats?.monthly_earnings || 0} <span className="text-sm font-normal">tokens</span></p>
                </div>
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Consultations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Active Consultations
                </CardTitle>
                {active_consultations.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {active_consultations.length} active
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {active_consultations.length === 0 ? (
                <div className="text-center py-8">
                  <Video className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No active consultations
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {active_consultations.map((consultation) => (
                    <div
                      key={consultation.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{consultation.user.full_name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {consultation.consultationRequest.problem_description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Started {formatRelativeTime(consultation.started_at)}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => router.visit(`/consultation/${consultation.id}`)}
                      >
                        Join
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Recent Reviews
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.visit('/consultant/reviews')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recent_reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No reviews yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recent_reviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{review.user.full_name}</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-4 w-4",
                                star <= review.user_rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      {review.user_feedback && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          "{review.user_feedback}"
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(review.ended_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.visit('/consultant/work')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">View Requests</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.pending_requests || 0} pending
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.visit('/consultant/availability')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Manage Availability</p>
                  <p className="text-sm text-muted-foreground">
                    Set your schedule
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.visit('/consultant/earnings')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">View Earnings</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.monthly_earnings || 0} tokens this month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
