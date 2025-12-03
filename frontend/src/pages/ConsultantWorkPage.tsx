import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { consultantApi } from '../services/api';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Zap, 
  ChevronRight, 
  FileText, 
  User, 
  Calendar,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface Technology {
  id: number;
  name: string;
}

interface ProblemUser {
  id: number;
  name: string;
  dev_competency: string;
}

interface Problem {
  id: number;
  problem_statement: string;
  error_description: string;
  submission_fee: number;
  technologies: Technology[];
  user: ProblemUser;
  attachments_count: number;
}

interface Invitation {
  id: number;
  status: string;
  is_surge_pricing: boolean;
  surge_multiplier: number;
  invited_at: string;
  expires_at: string;
  responded_at: string | null;
  is_expired: boolean;
  time_remaining: string | null;
  problem: Problem;
}

interface InvitationCounts {
  pending: number;
  accepted: number;
}

type TabType = 'pending' | 'accepted' | 'history';

export default function ConsultantWorkPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [counts, setCounts] = useState<InvitationCounts>({ pending: 0, accepted: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await consultantApi.getInvitations();
      setInvitations(response.data.invitations);
      setCounts(response.data.counts);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load invitations';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId: number) => {
    setProcessingId(invitationId);
    try {
      await consultantApi.acceptInvitation(invitationId);
      await fetchInvitations();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept invitation';
      setError(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (invitationId: number) => {
    if (!confirm('Are you sure you want to decline this invitation?')) {
      return;
    }
    
    setProcessingId(invitationId);
    try {
      await consultantApi.declineInvitation(invitationId);
      await fetchInvitations();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decline invitation';
      setError(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredInvitations = invitations.filter(inv => {
    switch (activeTab) {
      case 'pending':
        return inv.status === 'pending' && !inv.is_expired;
      case 'accepted':
        return inv.status === 'accepted';
      case 'history':
        return ['declined', 'expired'].includes(inv.status);
      default:
        return true;
    }
  });

  const getStatusBadge = (invitation: Invitation) => {
    if (invitation.is_expired && invitation.status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <Clock className="w-3 h-3" />
          Expired
        </span>
      );
    }
    
    switch (invitation.status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3" />
            Accepted
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3" />
            Declined
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Work</h1>
              <p className="mt-1 text-muted-foreground">
                Manage your work invitations and active jobs
              </p>
            </div>
            <Button
              variant="outline"
              onClick={fetchInvitations}
              disabled={loading}
              className="self-start sm:self-auto"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Invitations</p>
                    <p className="text-3xl font-bold text-foreground">{counts.pending}</p>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Jobs</p>
                    <p className="text-3xl font-bold text-foreground">{counts.accepted}</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate('/consultant/schedule')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">View Schedule</p>
                    <p className="text-lg font-medium text-foreground">Calendar View</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <nav className="-mb-px flex gap-6">
              {[
                { id: 'pending', label: 'Pending', count: counts.pending },
                { id: 'accepted', label: 'Active Jobs', count: counts.accepted },
                { id: 'history', label: 'History' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}
                  `}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Invitations List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredInvitations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">
                  No {activeTab === 'pending' ? 'pending' : activeTab === 'accepted' ? 'active' : ''} invitations
                </h3>
                <p className="text-muted-foreground">
                  {activeTab === 'pending' 
                    ? 'New work invitations will appear here'
                    : activeTab === 'accepted'
                    ? 'Accept an invitation to start working'
                    : 'Your past invitations will appear here'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredInvitations.map((invitation) => (
                <Card key={invitation.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(invitation)}
                            {invitation.is_surge_pricing && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                <Zap className="w-3 h-3" />
                                Surge {invitation.surge_multiplier}x
                              </span>
                            )}
                            {invitation.status === 'pending' && !invitation.is_expired && invitation.time_remaining && (
                              <span className="text-xs text-muted-foreground">
                                Expires {invitation.time_remaining}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                            {invitation.problem.problem_statement}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {invitation.problem.submission_fee}
                          </p>
                          <p className="text-xs text-muted-foreground">tokens</p>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{invitation.problem.user.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {invitation.problem.user.dev_competency || 'Developer'}
                          </p>
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {invitation.problem.technologies.map((tech) => (
                          <span
                            key={tech.id}
                            className="px-2 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground"
                          >
                            {tech.name}
                          </span>
                        ))}
                        {invitation.problem.attachments_count > 0 && (
                          <span className="px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {invitation.problem.attachments_count} attachment{invitation.problem.attachments_count !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      {/* Error Description Preview */}
                      {invitation.problem.error_description && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {invitation.problem.error_description}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/consultant/work/${invitation.id}`)}
                        >
                          View Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                        
                        {invitation.status === 'pending' && !invitation.is_expired && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDecline(invitation.id)}
                              disabled={processingId === invitation.id}
                            >
                              Decline
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAccept(invitation.id)}
                              disabled={processingId === invitation.id}
                            >
                              {processingId === invitation.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <>Accept Job</>
                              )}
                            </Button>
                          </div>
                        )}

                        {invitation.status === 'accepted' && (
                          <Button
                            size="sm"
                            onClick={() => navigate(`/consultant/work/${invitation.id}`)}
                          >
                            Manage Job
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

