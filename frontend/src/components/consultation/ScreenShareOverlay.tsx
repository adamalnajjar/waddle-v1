import React from 'react';
import { Monitor, StopCircle, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface ScreenShareOverlayProps {
  isSharing: boolean;
  isRemoteSharing?: boolean;
  sharerName?: string;
  onStopSharing?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

export const ScreenShareOverlay: React.FC<ScreenShareOverlayProps> = ({
  isSharing,
  isRemoteSharing = false,
  sharerName,
  onStopSharing,
  isFullscreen = false,
  onToggleFullscreen,
  className,
}) => {
  if (!isSharing && !isRemoteSharing) return null;

  return (
    <div className={cn('absolute inset-0', className)}>
      {/* Screen share placeholder */}
      <div className="absolute inset-0 flex items-center justify-center bg-muted/90">
        <div className="text-center">
          <div className="h-24 w-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Monitor className="h-12 w-12 text-primary" />
          </div>
          <p className="text-lg font-medium">
            {isRemoteSharing
              ? `${sharerName || 'Consultant'} is sharing their screen`
              : 'You are sharing your screen'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {isRemoteSharing
              ? 'You can see their screen content here'
              : 'Others can see your screen'}
          </p>
        </div>
      </div>

      {/* Controls overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        {/* Sharing indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Monitor className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {isRemoteSharing ? 'Screen Share' : 'Sharing Screen'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onToggleFullscreen && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onToggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4 mr-1" />
              ) : (
                <Maximize2 className="h-4 w-4 mr-1" />
              )}
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
          )}
          {!isRemoteSharing && onStopSharing && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onStopSharing}
            >
              <StopCircle className="h-4 w-4 mr-1" />
              Stop Sharing
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ScreenShareButtonProps {
  isSharing: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}

export const ScreenShareButton: React.FC<ScreenShareButtonProps> = ({
  isSharing,
  onToggle,
  disabled = false,
  className,
}) => {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        'p-3 rounded-full transition-colors',
        isSharing
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      title={isSharing ? 'Stop Screen Share' : 'Share Screen'}
    >
      <Monitor className="h-5 w-5" />
    </button>
  );
};

