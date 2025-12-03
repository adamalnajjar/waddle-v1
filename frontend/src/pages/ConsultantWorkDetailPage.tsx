import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { consultantApi } from '../services/api';
import { 
  ArrowLeft,
  Clock, 
  CheckCircle, 
  XCircle, 
  Zap, 
  FileText, 
  User, 
  Download,
  AlertTriangle,
  RefreshCw,
  Mail,
  Code
} from 'lucide-react';

interface Technology {
  id: number;
  name: string;
  slug: string;
}

interface Attachment {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  human_size: string;
  url: string;
}

interface ProblemUser {
  id: number;
  name: string;
  email: string;
  dev_competency: string;
  bio: string;
}

interface Problem {
  id: number;
  problem_statement: string;
  error_description: string;
  submission_fee: number;
  technologies: Technology[];
  attachments: Attachment[];
  user: ProblemUser;
}

interface InvitationDetail {
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

export default function ConsultantWorkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState<InvitationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInvitation();
    }
  }, [id]);

  const fetchInvitation = async () => {
    try {
      setLoading(true);
      const response = await consultantApi.getInvitation(Number(id));
      setInvitation(response.data.invitation);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load invitation';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!invitation) return;
    
    setProcessing(true);
    try {
      await consultantApi.acceptInvitation(invitation.id);
      await fetchInvitation();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept invitation';
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!invitation) return;
    
    if (!confirm('Are you sure you want to decline this invitation?')) {
      return;
    }
    
    setProcessing(true);
    try {
      await consultantApi.declineInvitation(invitation.id);
      navigate('/consultant/work');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decline invitation';
      setError(errorMessage);
      setProcessing(false);
    }
  };

  const getStatusBadge = () => {
    if (!invitation) return null;
    
    if (invitation.is_expired && invitation.status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <Clock className="w-4 h-4" />
          Expired
        </span>
      );
    }
    
    switch (invitation.status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="w-4 h-4" />
            Pending Response
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            Accepted
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-4 h-4" />
            Declined
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !invitation) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-12">
          <div className="max-w-4xl mx-auto px-4">
            <Button variant="ghost" onClick={() => navigate('/consultant/work')} className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Work
            </Button>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error || 'Invitation not found'}</AlertDescription>
            </Alert>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate('/consultant/work')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Work
          </Button>

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {getStatusBadge()}
                {invitation.is_surge_pricing && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    <Zap className="w-4 h-4" />
                    Surge Pricing {invitation.surge_multiplier}x
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Work Invitation #{invitation.id}
              </h1>
              {invitation.status === 'pending' && !invitation.is_expired && invitation.time_remaining && (
                <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Expires {invitation.time_remaining}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                {invitation.problem.submission_fee}
              </p>
              <p className="text-sm text-muted-foreground">tokens</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Problem Statement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Problem Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">
                    {invitation.problem.problem_statement}
                  </p>
                </CardContent>
              </Card>

              {/* Error Description */}
              {invitation.problem.error_description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Error / Additional Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm text-foreground whitespace-pre-wrap font-mono">
                      {invitation.problem.error_description}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {/* Technologies */}
              <Card>
                <CardHeader>
                  <CardTitle>Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {invitation.problem.technologies.map((tech) => (
                      <span
                        key={tech.id}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/10 text-primary"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Attachments */}
              {invitation.problem.attachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Attachments ({invitation.problem.attachments.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {invitation.problem.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">{attachment.file_name}</p>
                              <p className="text-sm text-muted-foreground">{attachment.human_size}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Client
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-lg text-foreground">
                      {invitation.problem.user.name}
                    </p>
                    {invitation.problem.user.dev_competency && (
                      <p className="text-sm text-muted-foreground capitalize">
                        {invitation.problem.user.dev_competency} Developer
                      </p>
                    )}
                  </div>
                  
                  {invitation.problem.user.bio && (
                    <p className="text-sm text-muted-foreground">
                      {invitation.problem.user.bio}
                    </p>
                  )}

                  {invitation.status === 'accepted' && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`mailto:${invitation.problem.user.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Client
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Invitation Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Invitation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invited</span>
                    <span className="text-foreground">
                      {new Date(invitation.invited_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires</span>
                    <span className="text-foreground">
                      {invitation.expires_at 
                        ? new Date(invitation.expires_at).toLocaleDateString()
                        : 'Never'}
                    </span>
                  </div>
                  {invitation.responded_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Responded</span>
                      <span className="text-foreground">
                        {new Date(invitation.responded_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {invitation.is_surge_pricing && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Surge Rate</span>
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                        {invitation.surge_multiplier}x
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              {invitation.status === 'pending' && !invitation.is_expired && (
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <Button 
                      className="w-full" 
                      onClick={handleAccept}
                      disabled={processing}
                    >
                      {processing ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Accept Job
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleDecline}
                      disabled={processing}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </CardContent>
                </Card>
              )}

              {invitation.status === 'accepted' && (
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p className="font-medium text-foreground">Job Accepted</p>
                      <p className="text-sm text-muted-foreground">
                        Contact the client to arrange a consultation
                      </p>
                    </div>
                    <Button className="w-full" asChild>
                      <a href={`mailto:${invitation.problem.user.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Email Client
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

