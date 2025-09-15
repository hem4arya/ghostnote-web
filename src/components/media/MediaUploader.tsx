'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { validateFiles, type FileValidationResult } from '@/lib/fileValidation';
import { uploadFiles, type UploadProgress } from '@/../../lib/storage';
import { UploadProgressList } from './UploadProgressList';

interface MediaUploaderProps {
  onFileSelect: (urls: string[]) => void;
  onError?: (errors: FileValidationResult[] | Error) => void;
  bucket: string;
  path?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
}

export function MediaUploader({
  onFileSelect,
  onError,
  bucket,
  path,
  accept = 'image/*',
  multiple = true,
  maxFiles = 10,
  className
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = useCallback(async (files: FileList) => {
    const selectedFiles = Array.from(files).slice(0, maxFiles);
    setIsValidating(true);
    setUploadProgress([]);
    
    try {
      // Validate files
      const validationResults = await validateFiles(selectedFiles);
      const invalidResults = validationResults.filter(result => !result.isValid);
      
      if (invalidResults.length > 0) {
        onError?.(invalidResults);
        return;
      }
      
      setIsValidating(false);
      
      // Upload files
      const urls = await uploadFiles(
        selectedFiles,
        { bucket, path },
        (progress) => setUploadProgress(progress)
      );
      
      onFileSelect(urls);
    } catch (error) {
      console.error('Error processing files:', error);
      onError?.(error instanceof Error ? error : new Error('An error occurred while processing files'));
    } finally {
      setIsValidating(false);
    }
  }, [maxFiles, onFileSelect, onError, bucket, path]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const { files } = e.dataTransfer;
    if (!files.length) return;
    
    processFiles(files);
  }, [processFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files?.length) return;

    processFiles(files);
    
    // Reset the input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFiles]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'relative flex flex-col items-center justify-center w-full h-32 px-4 py-6 text-center border-2 border-dashed rounded-lg transition-colors',
          isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-300 dark:border-gray-700',
          !isValidating && 'hover:border-gray-400 dark:hover:border-gray-600 cursor-pointer',
          className
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={!isValidating ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={isValidating}
        />
        
        <div className="space-y-1">
          {isValidating ? (
            <>
              <svg
                className="w-10 h-10 mx-auto text-blue-500 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Validating files...
              </div>
            </>
          ) : (
            <>
              <svg
                className="w-10 h-10 mx-auto text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Click to upload</span> or drag and drop
                {multiple && <p className="text-xs">Up to {maxFiles} files</p>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Progress List */}
      {uploadProgress.length > 0 && (
        <UploadProgressList files={uploadProgress} />
      )}
    </div>
  );
}