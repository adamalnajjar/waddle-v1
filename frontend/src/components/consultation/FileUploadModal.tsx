import React, { useState, useRef, useCallback } from 'react';
import { Modal, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Alert, AlertDescription } from '../ui/Alert';
import { 
  Upload, 
  File, 
  FileText, 
  FileCode, 
  FileSpreadsheet,
  X,
  AlertCircle 
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  isUploading?: boolean;
  maxSizeBytes?: number;
  allowedTypes?: string[];
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_ALLOWED_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/javascript',
  'text/x-python',
  'text/x-php',
  'text/html',
  'text/css',
  'application/json',
];

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return FileSpreadsheet;
  }
  if (mimeType.includes('javascript') || mimeType.includes('python') || mimeType.includes('php') || mimeType.includes('html') || mimeType.includes('css') || mimeType.includes('json')) {
    return FileCode;
  }
  if (mimeType.includes('text') || mimeType.includes('document') || mimeType.includes('pdf')) {
    return FileText;
  }
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isUploading = false,
  maxSizeBytes = DEFAULT_MAX_SIZE,
  allowedTypes = DEFAULT_ALLOWED_TYPES,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${formatFileSize(maxSizeBytes)} limit`;
    }
    if (!allowedTypes.includes(file.type) && file.type !== '') {
      return 'File type not allowed. Please upload documents, code files, or PDFs.';
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleUpload = () => {
    if (!selectedFile) return;
    onUpload(selectedFile);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError(null);
    onClose();
  };

  const FileIcon = selectedFile ? getFileIcon(selectedFile.type) : File;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload File"
      description="Share documents, code files, or presentations"
      size="md"
    >
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Drop Zone */}
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50',
            selectedFile && 'border-primary bg-primary/5'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleInputChange}
            accept={allowedTypes.join(',')}
          />

          {selectedFile ? (
            <div className="space-y-3">
              <div className="h-16 w-16 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                <FileIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium truncate max-w-[250px] mx-auto">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="h-16 w-16 mx-auto rounded-lg bg-muted flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">
                  Drop your file here or click to browse
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Max {formatFileSize(maxSizeBytes)} • Documents, code files, PDFs
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Allowed file types */}
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Supported formats:</p>
          <p>PDF, Word, Excel, PowerPoint, Text, JavaScript, Python, PHP, HTML, CSS, JSON</p>
        </div>
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          isLoading={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </ModalFooter>
    </Modal>
  );
};

