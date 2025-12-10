import React, { useEffect, useRef, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Layout } from '@/Components/layout';
import { Button } from '@/Components/ui/Button';
import { Alert, AlertDescription } from '@/Components/ui/Alert';
import { Loader2, AlertCircle, Phone, PhoneOff } from 'lucide-react';
import type { PageProps } from '@/types';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';

interface MeetingPageProps extends PageProps {
  consultation: {
    id: number;
    zoom_meeting_id: string;
    zoom_join_url: string;
    status: string;
    user: {
      id: number;
      full_name: string;
    };
    consultant: {
      id: number;
      user: {
        full_name: string;
      };
    };
  };
  signature: string;
  sdkKey: string;
  meetingNumber: string;
  password: string;
  userName: string;
  userEmail: string;
  role: number; // 0 = participant, 1 = host
}

export default function Meeting() {
  const { consultation, signature, sdkKey, meetingNumber, password, userName, userEmail, role } = 
    usePage<MeetingPageProps>().props;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const meetingContainerRef = useRef<HTMLDivElement>(null);
  const zoomClientRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Zoom client on component mount
    const client = ZoomMtgEmbedded.createClient();
    zoomClientRef.current = client;

    return () => {
      // Cleanup on unmount
      if (zoomClientRef.current) {
        try {
          zoomClientRef.current.leaveMeeting();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, []);

  const joinMeeting = async () => {
    if (!zoomClientRef.current) {
      setError('Zoom client not initialized. Please refresh the page.');
      return;
    }

    // Check if mediaDevices is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Your browser does not support video/audio. Please use a modern browser (Chrome, Firefox, Safari, or Edge) and ensure you are accessing the site via HTTPS or localhost.');
      return;
    }

    setIsLoading(true);
    setIsJoined(true); // Show the container first
    setError(null);

    // Wait for the container to be available in the DOM
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      if (!meetingContainerRef.current) {
        throw new Error('Meeting container not found');
      }

      console.log('Initializing Zoom SDK...', {
        meetingNumber,
        userName,
        userEmail,
        role,
      });

      // Initialize the meeting SDK in the container
      await zoomClientRef.current.init({
        zoomAppRoot: meetingContainerRef.current,
        language: 'en-US',
        customize: {
          video: {
            isResizable: true,
            viewSizes: {
              default: {
                width: 1000,
                height: 600,
              },
            },
          },
        },
      });

      console.log('Zoom SDK initialized, joining meeting...');

      // Join the meeting
      await zoomClientRef.current.join({
        signature: signature,
        meetingNumber: meetingNumber,
        password: password,
        userName: userName,
        userEmail: userEmail,
        tk: '',
        zak: '',
      });

      console.log('Successfully joined meeting!');
      setIsLoading(false);
    } catch (err: any) {
      console.error('Failed to join meeting:', err);
      setError(err.reason || err.message || 'Failed to join meeting. Please try again.');
      setIsLoading(false);
      setIsJoined(false); // Hide container on error
    }
  };

  const leaveMeeting = () => {
    if (zoomClientRef.current) {
      zoomClientRef.current.leaveMeeting();
      setIsJoined(false);
    }
  };

  return (
    <Layout>
      <Head title={`Consultation #${consultation.id} - Meeting`} />
      
      <div className="min-h-screen pt-24 pb-12">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Consultation #{consultation.id}
            </h1>
            <p className="text-muted-foreground">
              {role === 1 ? 'You are the host' : `With ${consultation.consultant.user.full_name}`}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Meeting Container */}
          {!isJoined ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Joining meeting...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Ready to Join
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Click below to join the video consultation with{' '}
                      {role === 1 ? consultation.user.full_name : consultation.consultant.user.full_name}
                    </p>
                  </div>
                  <Button size="lg" onClick={joinMeeting}>
                    <Phone className="mr-2 h-5 w-5" />
                    Join Meeting
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Zoom will render its UI here */}
              <div 
                ref={meetingContainerRef}
                id="meetingSDKElement"
                className="w-full min-h-[700px] bg-black rounded-xl overflow-hidden"
              />
              
              {/* Leave button */}
              <div className="flex justify-center">
                <Button variant="destructive" onClick={leaveMeeting}>
                  <PhoneOff className="mr-2 h-5 w-5" />
                  Leave Meeting
                </Button>
              </div>
            </div>
          )}

          {/* Meeting Info */}
          <div className="mt-8 p-4 bg-muted/50 rounded-xl">
            <h3 className="font-medium text-foreground mb-2">Meeting Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Meeting ID:</span>
                <span className="ml-2 font-mono">{meetingNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="ml-2 capitalize">{consultation.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
