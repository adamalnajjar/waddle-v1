import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { consultantApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Alert, AlertDescription } from '../components/ui/Alert';
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
import { cn, formatRelativeTime } from '../lib/utils';

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

interface ConsultantProfile {
  is_available: boolean;
  status: 'pending' | 'approved' | 'suspended';
}

export const ConsultantDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeConsultations, setActiveConsultations] = useState<ActiveConsultation[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [profile, setProfile] = useState<ConsultantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await consultantApi.getDashboard();
      setStats(response.data.stats);
      setActiveConsultations(response.data.active_consultations);
      setRecentReviews(response.data.recent_reviews);
      setProfile(response.data.profile);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    setIsTogglingAvailability(true);
    try {
      await consultantApi.toggleAvailability();
      setProfile(prev => prev ? { ...prev, is_available: !prev.is_available } : null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle availability');
    } finally {
      setIsTogglingAvailability(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isApproved = profile?.status === 'approved';

  return (
    <div className="space-y-6">
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
              variant={profile?.is_available ? 'default' : 'outline'}
              size="sm"
              onClick={handleToggleAvailability}
              disabled={!isApproved || isTogglingAvailability}
            >
              {isTogglingAvailability ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : profile?.is_available ? (
                <Play className="h-4 w-4 mr-2" />
              ) : (
                <Pause className="h-4 w-4 mr-2" />
              )}
              {profile?.is_available ? 'Available' : 'Unavailable'}
            </Button>
          </div>
          <Button onClick={loadDashboard} variant="outline" size="icon">
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
            {profile?.status === 'pending'
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
              {activeConsultations.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {activeConsultations.length} active
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {activeConsultations.length === 0 ? (
              <div className="text-center py-8">
                <Video className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No active consultations
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeConsultations.map((consultation) => (
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
                      onClick={() => navigate(`/consultation/${consultation.id}`)}
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
                onClick={() => navigate('/consultant/reviews')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentReviews.length === 0 ? (
              <div className="text-center py-8">
                <Star className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No reviews yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReviews.map((review) => (
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
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/consultant/requests')}>
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

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/consultant/availability')}>
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

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/consultant/earnings')}>
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
  );
};

