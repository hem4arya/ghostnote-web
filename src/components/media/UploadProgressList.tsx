'use client';

import { cn } from '@/lib/utils';
import { getFileSizeString } from '@/lib/fileValidation';
import type { UploadProgress } from '@/../../lib/storage';

interface UploadProgressListProps {
  files: UploadProgress[];
  className?: string;
}

export function UploadProgressList({ files, className }: UploadProgressListProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {files.map(({ file, progress, status, error }) => (
        <div
          key={`${file.name}-${file.size}`}
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg',
            status === 'error' ? 'bg-red-50 dark:bg-red-950' : 'bg-gray-50 dark:bg-gray-900'
          )}
        >
          {/* File Icon */}
          <div className="shrink-0">
            <svg
              className={cn(
                'w-8 h-8',
                status === 'completed' ? 'text-green-500' : 
                status === 'error' ? 'text-red-500' :
                'text-blue-500'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {status === 'completed' ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : status === 'error' ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              )}
            </svg>
          </div>
          
          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium truncate">
                {file.name}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {getFileSizeString(file.size)}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-1">
              <div
                className={cn(
                  'h-1.5 rounded-full',
                  status === 'error' ? 'bg-red-200 dark:bg-red-800' : 'bg-gray-200 dark:bg-gray-700'
                )}
              >
                <div
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    status === 'completed' ? 'bg-green-500' :
                    status === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            {/* Status Text */}
            <div className="mt-0.5 text-xs">
              {status === 'completed' ? (
                <span className="text-green-600 dark:text-green-400">Upload complete</span>
              ) : status === 'error' ? (
                <span className="text-red-600 dark:text-red-400">{error || 'Upload failed'}</span>
              ) : (
                <span className="text-blue-600 dark:text-blue-400">
                  {status === 'uploading' ? 'Uploading...' : 'Waiting...'}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}