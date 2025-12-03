import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { consultationApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { 
  CodeSnippetModal, 
  FileUploadModal, 
  FileList,
  RecordingIndicator,
  ScreenShareOverlay
} from '../components/consultation';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff,
  Monitor,
  MessageSquare,
  FileUp,
  Send,
  Code,
  Clock,
  User,
  Loader2,
  ArrowLeft,
  Star,
  Shuffle,
  Circle,
  StopCircle,
  FolderOpen,
  X,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn, formatRelativeTime } from '../lib/utils';
import type { Consultation, ConsultationMessage } from '../types';

interface ConsultationFile {
  id: number;
  original_name: string;
  mime_type: string;
  size: number;
  human_size: string;
  url: string;
  uploader: {
    id: number;
    full_name: string;
  };
  created_at: string;
}

export const ConsultationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [messages, setMessages] = useState<ConsultationMessage[]>([]);
  const [files, setFiles] = useState<ConsultationFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Video controls
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);
  
  // Chat & Files Panel
  const [activePanel, setActivePanel] = useState<'chat' | 'files' | null>('chat');
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Modals
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  
  // Rating
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  
  // Session timer
  const [sessionDuration, setSessionDuration] = useState('00:00');

  // Load consultation data
  useEffect(() => {
    if (id) {
      loadConsultation();
      loadMessages();
      loadFiles();
    }
  }, [id]);

  // Auto-scroll messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Session timer
  useEffect(() => {
    if (!consultation?.started_at || consultation.status !== 'in_progress') return;

    const updateTimer = () => {
      const start = new Date(consultation.started_at!);
      const diff = Math.floor((Date.now() - start.getTime()) / 1000);
      const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
      const seconds = (diff % 60).toString().padStart(2, '0');
      setSessionDuration(`${minutes}:${seconds}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [consultation?.started_at, consultation?.status]);

  // Poll for new messages during active session
  useEffect(() => {
    if (consultation?.status !== 'in_progress') return;

    const interval = setInterval(() => {
      loadMessages();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [consultation?.status]);

  const loadConsultation = async () => {
    try {
      const response = await consultationApi.get(Number(id));
      setConsultation(response.data.consultation);
      
      if (response.data.consultation.status === 'completed' && !response.data.consultation.user_rating) {
        setShowRating(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load consultation');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await consultationApi.getMessages(Number(id));
      setMessages(response.data.messages);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const loadFiles = async () => {
    try {
      const response = await consultationApi.getFiles(Number(id));
      setFiles(response.data.files);
    } catch (err) {
      console.error('Failed to load files:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      const response = await consultationApi.sendMessage(Number(id), newMessage.trim());
      setMessages([...messages, response.data.message]);
      setNewMessage('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleSendCodeSnippet = async (code: string, language: string) => {
    try {
      const response = await consultationApi.sendMessage(
        Number(id), 
        code, 
        'code_snippet',
        { language }
      );
      setMessages([...messages, response.data.message]);
      setShowCodeModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send code snippet');
    }
  };

  const handleUploadFile = async (file: File) => {
    setIsUploadingFile(true);
    try {
      const response = await consultationApi.uploadFile(Number(id), file);
      setFiles([...files, response.data.file]);
      setShowFileModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleDownloadFile = (file: ConsultationFile) => {
    window.open(file.url, '_blank');
  };

  const handleEndCall = async () => {
    if (!consultation) return;
    
    try {
      await consultationApi.end(consultation.id);
      loadConsultation();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to end consultation');
    }
  };

  const handleStartSession = async () => {
    if (!consultation) return;
    
    try {
      await consultationApi.start(consultation.id);
      loadConsultation();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start consultation');
    }
  };

  const handleShuffle = async () => {
    if (!consultation) return;
    
    try {
      await consultationApi.shuffle(consultation.id);
      navigate('/consultations');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to shuffle consultant');
    }
  };

  const handleSubmitRating = async () => {
    if (!consultation || rating === 0) return;
    
    setIsSubmittingRating(true);
    try {
      await consultationApi.rate(consultation.id, rating, feedback);
      setShowRating(false);
      loadConsultation();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
    } else {
      try {
        // In production, this would use the actual screen share API
        setIsScreenSharing(true);
      } catch (err) {
        setError('Failed to start screen sharing');
      }
    }
  }, [isScreenSharing]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      setRecordingStartTime(null);
    } else {
      setIsRecording(true);
      setRecordingStartTime(new Date());
    }
  }, [isRecording]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Consultation not found</h1>
        <Button className="mt-4" onClick={() => navigate('/consultations')}>
          Back to Consultations
        </Button>
      </div>
    );
  }

  // Rating Modal
  if (showRating) {
    return (
      <div className="max-w-md mx-auto py-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Rate Your Consultation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-8 w-8",
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium">Feedback (optional)</label>
              <textarea
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                rows={4}
                placeholder="How was your experience?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowRating(false)}
              >
                Skip
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmitRating}
                disabled={rating === 0}
                isLoading={isSubmittingRating}
              >
                Submit Rating
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSessionActive = consultation.status === 'in_progress';
  const isSessionScheduled = consultation.status === 'scheduled';

  return (
    <div className="h-[calc(100vh-12rem)]">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex h-full gap-4">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/consultations')}
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            
            <div className="flex items-center gap-4">
              {/* Recording Indicator */}
              <RecordingIndicator 
                isRecording={isRecording} 
                startTime={recordingStartTime || undefined} 
              />
              
              {/* Session Timer */}
              {isSessionActive && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-mono text-green-500">
                    {sessionDuration}
                  </span>
                </div>
              )}
              
              {consultation.duration_minutes && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {consultation.duration_minutes} min
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Video Container */}
          <div className="flex-1 bg-muted rounded-lg relative overflow-hidden">
            {isSessionActive ? (
              <>
                {/* Screen Share Overlay */}
                {isScreenSharing && (
                  <ScreenShareOverlay
                    isSharing={isScreenSharing}
                    onStopSharing={() => setIsScreenSharing(false)}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                  />
                )}

                {/* Main Video (Consultant) */}
                {!isScreenSharing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <User className="h-12 w-12 text-primary" />
                      </div>
                      <p className="font-medium">{consultation.consultant?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {consultation.consultant?.specializations?.join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Self Video (Small) */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-background rounded-lg border shadow-lg flex items-center justify-center">
                  {isVideoOn ? (
                    <div className="text-center">
                      <User className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-xs text-muted-foreground mt-1">You</p>
                    </div>
                  ) : (
                    <VideoOff className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/90 backdrop-blur rounded-full px-4 py-2 shadow-lg">
                  {/* Mute */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      isMuted ? "bg-destructive text-destructive-foreground" : "hover:bg-muted"
                    )}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                  
                  {/* Video */}
                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      !isVideoOn ? "bg-destructive text-destructive-foreground" : "hover:bg-muted"
                    )}
                    title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </button>
                  
                  {/* Screen Share */}
                  <button
                    onClick={toggleScreenShare}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      isScreenSharing ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                    title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                  >
                    <Monitor className="h-5 w-5" />
                  </button>
                  
                  {/* Recording */}
                  <button
                    onClick={toggleRecording}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      isRecording ? "bg-red-500 text-white" : "hover:bg-muted"
                    )}
                    title={isRecording ? 'Stop recording' : 'Start recording'}
                  >
                    {isRecording ? <StopCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                  </button>
                  
                  <div className="w-px h-8 bg-border mx-1" />
                  
                  {/* Chat Toggle */}
                  <button
                    onClick={() => setActivePanel(activePanel === 'chat' ? null : 'chat')}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      activePanel === 'chat' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                    title="Toggle chat"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>
                  
                  {/* Files Toggle */}
                  <button
                    onClick={() => setActivePanel(activePanel === 'files' ? null : 'files')}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      activePanel === 'files' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                    title="Toggle files"
                  >
                    <FolderOpen className="h-5 w-5" />
                  </button>
                  
                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-3 rounded-full hover:bg-muted transition-colors"
                    title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </button>
                  
                  <div className="w-px h-8 bg-border mx-1" />
                  
                  {/* End Call */}
                  <button
                    onClick={handleEndCall}
                    className="p-3 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    title="End call"
                  >
                    <PhoneOff className="h-5 w-5" />
                  </button>
                </div>

                {/* Shuffle Button */}
                <div className="absolute top-4 right-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShuffle}
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Shuffle Expert
                  </Button>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium capitalize">{consultation.status}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {consultation.status === 'completed' 
                      ? `Duration: ${consultation.duration_minutes} minutes`
                      : 'Waiting for session to start'}
                  </p>
                  {isSessionScheduled && (
                    <div className="mt-4 flex gap-2 justify-center">
                      <Button onClick={handleStartSession}>
                        <Video className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                      {consultation.zoom_join_url && (
                        <a
                          href={consultation.zoom_join_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline">
                            Join Zoom Meeting
                          </Button>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel (Chat/Files) */}
        {activePanel && (
          <div className="w-80 flex flex-col border rounded-lg">
            {/* Panel Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActivePanel('chat')}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                  activePanel === 'chat'
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MessageSquare className="h-4 w-4 inline mr-2" />
                Chat
              </button>
              <button
                onClick={() => setActivePanel('files')}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                  activePanel === 'files'
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FolderOpen className="h-4 w-4 inline mr-2" />
                Files ({files.length})
              </button>
            </div>

            {/* Chat Panel */}
            {activePanel === 'chat' && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm">
                      No messages yet
                    </p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex flex-col",
                          message.user_id === consultation.consultant?.id
                            ? "items-start"
                            : "items-end"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-lg px-3 py-2",
                            message.user_id === consultation.consultant?.id
                              ? "bg-muted"
                              : "bg-primary text-primary-foreground"
                          )}
                        >
                          {message.type === 'code_snippet' ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs opacity-70">
                                <Code className="h-3 w-3" />
                                <span className="capitalize">
                                  {(message.metadata as any)?.language || 'code'}
                                </span>
                              </div>
                              <pre className="text-xs font-mono whitespace-pre-wrap bg-black/10 rounded p-2 overflow-x-auto">
                                <code>{message.message}</code>
                              </pre>
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(message.created_at)}
                        </span>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={!isSessionActive}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!newMessage.trim() || isSendingMessage || !isSessionActive}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      disabled={!isSessionActive}
                      onClick={() => setShowCodeModal(true)}
                    >
                      <Code className="h-3 w-3 mr-1" />
                      Code
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      disabled={!isSessionActive}
                      onClick={() => setShowFileModal(true)}
                    >
                      <FileUp className="h-3 w-3 mr-1" />
                      File
                    </Button>
                  </div>
                </form>
              </>
            )}

            {/* Files Panel */}
            {activePanel === 'files' && (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  <FileList
                    files={files}
                    onDownload={handleDownloadFile}
                  />
                </div>
                {isSessionActive && (
                  <div className="p-4 border-t">
                    <Button
                      className="w-full"
                      onClick={() => setShowFileModal(true)}
                    >
                      <FileUp className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Code Snippet Modal */}
      <CodeSnippetModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        onSubmit={handleSendCodeSnippet}
        isSubmitting={isSendingMessage}
      />

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={showFileModal}
        onClose={() => setShowFileModal(false)}
        onUpload={handleUploadFile}
        isUploading={isUploadingFile}
      />
    </div>
  );
};
