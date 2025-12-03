import React, { useState, useEffect } from 'react';
import { Circle, StopCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RecordingIndicatorProps {
  isRecording: boolean;
  startTime?: Date;
  className?: string;
}

export const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({
  isRecording,
  startTime,
  className,
}) => {
  const [elapsed, setElapsed] = useState('00:00');

  useEffect(() => {
    if (!isRecording || !startTime) {
      setElapsed('00:00');
      return;
    }

    const updateElapsed = () => {
      const diff = Math.floor((Date.now() - startTime.getTime()) / 1000);
      const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
      const seconds = (diff % 60).toString().padStart(2, '0');
      setElapsed(`${minutes}:${seconds}`);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [isRecording, startTime]);

  if (!isRecording) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full',
        'bg-red-500/10 border border-red-500/20',
        className
      )}
    >
      <Circle className="h-3 w-3 fill-red-500 text-red-500 animate-pulse" />
      <span className="text-sm font-medium text-red-500">
        Recording
      </span>
      <span className="text-sm font-mono text-red-500/80">
        {elapsed}
      </span>
    </div>
  );
};

interface RecordingControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
  className?: string;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  disabled = false,
  className,
}) => {
  return (
    <button
      onClick={isRecording ? onStopRecording : onStartRecording}
      disabled={disabled}
      className={cn(
        'p-3 rounded-full transition-colors',
        isRecording
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'hover:bg-muted',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      title={isRecording ? 'Stop Recording' : 'Start Recording'}
    >
      {isRecording ? (
        <StopCircle className="h-5 w-5" />
      ) : (
        <Circle className="h-5 w-5" />
      )}
    </button>
  );
};

