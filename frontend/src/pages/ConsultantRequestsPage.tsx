import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { consultantApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Alert, AlertDescription } from '../components/ui/Alert';
import {
  User,
  Clock,
  Code,
  AlertCircle,
  Check,
  X,
  Loader2,
  ArrowLeft,
  RefreshCw,
  Inbox
} from 'lucide-react';
import { cn, formatRelativeTime } from '../lib/utils';

interface ConsultationRequest {
  id: number;
  problem_description: string;
  tech_stack: string[];
  error_logs: string | null;
  urgency: string;
  status: string;
  user: {
    id: number;
    full_name: string;
    email: string;
  };
  created_at: string;
}

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const ConsultantRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await consultantApi.getRequests(page);
      setRequests(response.data.requests);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (requestId: number) => {
    setProcessingId(requestId);
    setError(null);
    try {
      await consultantApi.acceptRequest(requestId);
      // Remove from list
      setRequests(requests.filter(r => r.id !== requestId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to accept request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (requestId: number) => {
    setProcessingId(requestId);
    setError(null);
    try {
      await consultantApi.declineRequest(requestId);
      // Remove from list
      setRequests(requests.filter(r => r.id !== requestId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to decline request');
    } finally {
      setProcessingId(null);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/consultant')}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold">Consultation Requests</h1>
            <p className="text-muted-foreground">
              {pagination?.total || 0} pending requests
            </p>
          </div>
        </div>
        <Button onClick={() => loadRequests()} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Inbox className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No pending requests</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                New consultation requests will appear here when users are matched with you.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{request.user.full_name}</p>
                      <p className="text-sm text-muted-foreground">{request.user.email}</p>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Problem Description</h4>
                      <p className="text-sm">{request.problem_description}</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {/* Tech Stack */}
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <Code className="h-3 w-3" />
                          Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {request.tech_stack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 text-xs rounded-full bg-muted"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Urgency */}
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Urgency</h4>
                        <span className={cn(
                          "px-2 py-0.5 text-xs rounded-full capitalize",
                          getUrgencyColor(request.urgency)
                        )}>
                          {request.urgency}
                        </span>
                      </div>

                      {/* Time */}
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Requested
                        </h4>
                        <span className="text-sm">
                          {formatRelativeTime(request.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Error Logs */}
                    {request.error_logs && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Error Logs</h4>
                        <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto max-h-24">
                          {request.error_logs}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Button
                      onClick={() => handleAccept(request.id)}
                      disabled={processingId === request.id}
                      className="flex-1 lg:flex-none"
                    >
                      {processingId === request.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDecline(request.id)}
                      disabled={processingId === request.id}
                      className="flex-1 lg:flex-none"
                    >
                      {processingId === request.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      Decline
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadRequests(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadRequests(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

