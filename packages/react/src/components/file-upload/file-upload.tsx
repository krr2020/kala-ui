'use client';

import { CloudUpload, File as FileIcon, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../button';

export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  disabled?: boolean;
  value?: File | null;
  onClear?: () => void;
  error?: string;
  progress?: number;
  onError?: (error: string) => void;
}

export function FileUpload({
  onFileSelect,
  accept,
  maxSize,
  disabled,
  value,
  onClear,
  error,
  progress,
  onError,
  className,
  ...props
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    const file = files[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files?.[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const validateAndSelectFile = (file: File) => {
    if (maxSize && file.size > maxSize) {
      onError?.(`File size exceeds ${formatFileSize(maxSize)}`);
      return;
    }
    onFileSelect?.(file);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {value ? (
        <div className="relative flex items-center p-4 border rounded bg-muted theme-card">
          <div className="p-2 mr-4 bg-background rounded border theme-card">
            <FileIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{value.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(value.size)}</p>
            {progress !== undefined && (
              <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
            )}
          </div>
          {!disabled && onClear && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-2 text-muted-foreground hover:text-destructive"
              onClick={onClear}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded transition-colors cursor-pointer theme-input',
            'focus-ring',
            isDragging
              ? 'border-primary bg-primary/10'
              : 'bg-background hover:bg-muted',
            disabled && 'opacity-50 cursor-not-allowed hover:bg-background',
            error && 'border-destructive bg-destructive/10',
            className,
          )}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileInput}
            disabled={disabled}
          />
          <div className="p-3 mb-3 rounded-full bg-muted">
            <CloudUpload className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="mb-1 text-sm font-medium text-foreground">
            <span className="text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            {accept ? accept.split(',').join(', ') : 'Any file'}
            {maxSize && ` (max ${formatFileSize(maxSize)})`}
          </p>
        </button>
      )}
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
