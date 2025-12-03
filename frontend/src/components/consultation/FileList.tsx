import React from 'react';
import { 
  File, 
  FileText, 
  FileCode, 
  FileSpreadsheet,
  Download,
  ExternalLink,
  User,
  Clock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn, formatRelativeTime } from '../../lib/utils';

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

interface FileListProps {
  files: ConsultationFile[];
  currentUserId?: number;
  onDownload?: (file: ConsultationFile) => void;
  onPreview?: (file: ConsultationFile) => void;
  isLoading?: boolean;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return FileSpreadsheet;
  }
  if (mimeType.includes('javascript') || mimeType.includes('python') || mimeType.includes('php') || mimeType.includes('html') || mimeType.includes('css') || mimeType.includes('json') || mimeType.includes('code')) {
    return FileCode;
  }
  if (mimeType.includes('text') || mimeType.includes('document') || mimeType.includes('pdf')) {
    return FileText;
  }
  return File;
};

const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toUpperCase() || '' : '';
};

export const FileList: React.FC<FileListProps> = ({
  files,
  currentUserId,
  onDownload,
  onPreview,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="h-10 w-10 rounded bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8">
        <File className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          No files shared yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => {
        const FileIcon = getFileIcon(file.mime_type);
        const isOwner = file.uploader.id === currentUserId;
        const extension = getFileExtension(file.original_name);

        return (
          <div
            key={file.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border transition-colors',
              'hover:bg-muted/50'
            )}
          >
            {/* File Icon */}
            <div className="relative">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileIcon className="h-5 w-5 text-primary" />
              </div>
              {extension && (
                <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-background border rounded px-1">
                  {extension}
                </span>
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate" title={file.original_name}>
                {file.original_name}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{file.human_size}</span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {isOwner ? 'You' : file.uploader.full_name}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatRelativeTime(file.created_at)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {onPreview && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPreview(file)}
                  title="Preview"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
              {onDownload && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDownload(file)}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

