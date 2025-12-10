import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Layout } from '@/Components/layout';
import { Button } from '@/Components/ui/Button.tsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/Card.tsx';
import { Alert, AlertDescription } from '@/Components/ui/Alert.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/Dialog.tsx';
import { Label } from '@/Components/ui/Label.tsx';
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Code,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import type { PageProps } from '@/types';

interface ConsultantInvitation {
  id: number;
  status: string;
  invited_at: string;
  expires_at: string;
  is_surge: boolean;
  consultation_request: {
    id: number;
    problem_description: string;
    tech_stack: string[];
    error_logs?: string;
    user: {
      id: number;
      full_name: string;
      email: string;
      development_competency?: string;
    };
  };
}

interface InvitationsPageProps extends PageProps {
  invitations: ConsultantInvitation[];
}

export default function Invitations() {
  const { invitations } = usePage<InvitationsPageProps>().props;
  const [selectedInvitation, setSelectedInvitation] = useState<ConsultantInvitation | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for accept modal
  const [proposedTime, setProposedTime] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');

  // Form state for decline modal
  const [declineReason, setDeclineReason] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const handleAccept = () => {
    if (!selectedInvitation) return;

    setError(null);
    setIsSubmitting(true);

    router.post(`/consultant/invitations/${selectedInvitation.id}/accept`, {
      proposed_time: proposedTime,
      proposal_message: proposalMessage,
    }, {
      onSuccess: () => {
        setShowAcceptModal(false);
        setProposedTime('');
        setProposalMessage('');
      },
      onError: (errors) => {
        setError(Object.values(errors)[0] as string);
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handleDecline = () => {
    if (!selectedInvitation) return;

    setError(null);
    setIsSubmitting(true);

    router.post(`/consultant/invitations/${selectedInvitation.id}/decline`, {
      reason: declineReason,
    }, {
      onSuccess: () => {
        setShowDeclineModal(false);
        setDeclineReason('');
      },
      onError: (errors) => {
        setError(Object.values(errors)[0] as string);
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <Layout>
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Consultation Invitations</h1>
          <p className="text-muted-foreground">
            Review and respond to consultation requests
          </p>
        </div>

        {/* Invitations List */}
        {invitations.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mt-4">No pending invitations</h3>
                <p className="text-muted-foreground mt-2">
                  You don't have any consultation requests at the moment.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <Card key={invitation.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Left Side - Details */}
                    <div className="flex-1 space-y-4">
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{invitation.consultation_request.user.full_name}</p>
                          <p className="text-sm text-muted-foreground">{invitation.consultation_request.user.email}</p>
                        </div>
                        {invitation.consultation_request.user.development_competency && (
                          <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium">
                            {invitation.consultation_request.user.development_competency}
                          </span>
                        )}
                        {invitation.is_surge && (
                          <span className="px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                            Surge (1.2x pay)
                          </span>
                        )}
                      </div>

                      {/* Problem Description */}
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Problem Description</h4>
                        <p className="text-sm">{invitation.consultation_request.problem_description}</p>
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {invitation.consultation_request.tech_stack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium flex items-center gap-1"
                            >
                              <Code className="h-3 w-3" />
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Time Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Invited {formatDate(invitation.invited_at)}
                        </span>
                        <span className={cn(
                          "flex items-center gap-1",
                          getTimeRemaining(invitation.expires_at) === 'Expired' && "text-destructive"
                        )}>
                          <AlertCircle className="h-4 w-4" />
                          {getTimeRemaining(invitation.expires_at)}
                        </span>
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex flex-col gap-3 lg:min-w-[200px]">
                      <Button
                        onClick={() => {
                          setSelectedInvitation(invitation);
                          setShowAcceptModal(true);
                        }}
                        className="w-full"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept & Propose Time
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedInvitation(invitation);
                          setShowDeclineModal(true);
                        }}
                        className="w-full"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Accept Modal */}
        <Dialog open={showAcceptModal} onOpenChange={setShowAcceptModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accept Invitation & Propose Time</DialogTitle>
            </DialogHeader>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="proposed_time">Proposed Meeting Time *</Label>
                <input
                  id="proposed_time"
                  type="datetime-local"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="proposal_message">Message (Optional)</Label>
                <textarea
                  id="proposal_message"
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  placeholder="Add a message for the user..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  maxLength={500}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAcceptModal(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleAccept} disabled={!proposedTime || isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Accept & Send Proposal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Decline Modal */}
        <Dialog open={showDeclineModal} onOpenChange={setShowDeclineModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Decline Invitation</DialogTitle>
            </DialogHeader>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="decline_reason">Reason (Optional)</Label>
              <textarea
                id="decline_reason"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Let the admin know why you're declining..."
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                maxLength={500}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeclineModal(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDecline} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Decline Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
