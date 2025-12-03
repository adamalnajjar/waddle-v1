import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { consultantApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Alert, AlertDescription } from '../components/ui/Alert';
import {
  TrendingUp,
  Clock,
  DollarSign,
  Star,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Calendar,
  User
} from 'lucide-react';
import { cn, formatRelativeTime, formatDate } from '../lib/utils';

interface EarningsSummary {
  total_consultations: number;
  total_minutes: number;
  total_tokens_earned: number;
  monthly_tokens: number;
  average_rating: number | null;
}

interface RecentConsultation {
  id: number;
  duration_minutes: number;
  tokens_charged: number;
  user_rating: number | null;
  user_feedback: string | null;
  ended_at: string;
  user: {
    id: number;
    full_name: string;
  };
}

export const ConsultantEarningsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [recentConsultations, setRecentConsultations] = useState<RecentConsultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const response = await consultantApi.getEarnings();
      setSummary(response.data.summary);
      setRecentConsultations(response.data.recent_consultations);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load earnings');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/consultant')}
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">Earnings & Statistics</h1>
          <p className="text-muted-foreground">
            Track your consultation earnings and performance
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Consultations</p>
                <p className="text-2xl font-bold">{summary?.total_consultations || 0}</p>
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
                <p className="text-sm text-muted-foreground">Total Minutes</p>
                <p className="text-2xl font-bold">{summary?.total_minutes || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tokens Earned</p>
                <p className="text-2xl font-bold">{summary?.total_tokens_earned || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{summary?.monthly_tokens || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">
                  {summary?.average_rating ? summary.average_rating.toFixed(1) : '-'}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Consultations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Consultations</CardTitle>
        </CardHeader>
        <CardContent>
          {recentConsultations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No consultations yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your completed consultations will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{consultation.user.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(consultation.ended_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    {/* Duration */}
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{consultation.duration_minutes} min</p>
                    </div>

                    {/* Tokens */}
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Earned</p>
                      <p className="font-medium text-emerald-600">
                        +{consultation.tokens_charged} tokens
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Rating</p>
                      {consultation.user_rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{consultation.user_rating}</span>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">-</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Earnings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Average Session Length</span>
              <span className="font-medium">
                {summary && summary.total_consultations > 0
                  ? Math.round(summary.total_minutes / summary.total_consultations)
                  : 0} min
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tokens per Session</span>
              <span className="font-medium">
                {summary && summary.total_consultations > 0
                  ? Math.round(summary.total_tokens_earned / summary.total_consultations)
                  : 0} tokens
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Hours Consulted</span>
              <span className="font-medium">
                {summary ? Math.round(summary.total_minutes / 60) : 0} hours
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {summary?.average_rating ? (
              <div className="text-center py-4">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-8 w-8",
                        star <= Math.round(summary.average_rating!)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <p className="text-3xl font-bold">{summary.average_rating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {summary.total_consultations} consultations
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No ratings yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

