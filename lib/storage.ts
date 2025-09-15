import { supabase } from './supabase';

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface UploadOptions {
  bucket: string;
  path?: string;
  cacheControl?: string;
  upsert?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

const defaultOptions: Required<Omit<UploadOptions, 'bucket'>> = {
  path: '',
  cacheControl: '3600',
  upsert: false,
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

/**
 * Generates a unique file name to prevent collisions
 */
function generateUniqueFileName(fileName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = fileName.split('.').pop();
  const baseName = fileName.split('.').slice(0, -1).join('.');
  
  return `${baseName}-${timestamp}-${random}.${extension}`;
}

/**
 * Uploads a single file to Supabase Storage with retry logic
 */
export async function uploadFile(
  file: File,
  options: UploadOptions,
  onProgress?: (progress: number) => void
): Promise<string> {
  const { bucket, path, cacheControl, upsert, retryAttempts, retryDelay } = {
    ...defaultOptions,
    ...options,
  };

  const fileName = generateUniqueFileName(file.name);
  const fullPath = path ? `${path}/${fileName}` : fileName;

  let attempt = 0;
  while (attempt < retryAttempts) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fullPath, file, {
          cacheControl,
          upsert
        });

      if (error) throw error;
      if (!data?.path) throw new Error('No path returned from upload');

      // Return the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      attempt++;
      
      // If we've exhausted all attempts, rethrow the error
      if (attempt === retryAttempts) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw new Error('Upload failed after all retry attempts');
}

/**
 * Uploads multiple files to Supabase Storage with progress tracking
 */
export async function uploadFiles(
  files: File[],
  options: UploadOptions,
  onProgress?: (progress: UploadProgress[]) => void
): Promise<string[]> {
  const progress = new Map<File, UploadProgress>();

  // Initialize progress tracking for each file
  files.forEach(file => {
    progress.set(file, {
      file,
      progress: 0,
      status: 'pending'
    });
  });

  // Helper function to update progress
  const updateProgress = (file: File, update: Partial<UploadProgress>) => {
    const current = progress.get(file);
    if (current) {
      progress.set(file, { ...current, ...update });
      onProgress?.(Array.from(progress.values()));
    }
  };

  // Upload files in parallel
  const uploadPromises = files.map(async (file) => {
    updateProgress(file, { status: 'uploading' });

    try {
      const url = await uploadFile(file, options, (progress) => {
        updateProgress(file, { progress });
      });

      updateProgress(file, { status: 'completed', progress: 100 });
      return url;
    } catch (error) {
      updateProgress(file, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed',
        progress: 0
      });
      throw error;
    }
  });

  // Wait for all uploads to complete
  return Promise.all(uploadPromises);
}

/**
 * Deletes a file from Supabase Storage
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}

/**
 * Deletes multiple files from Supabase Storage
 */
export async function deleteFiles(bucket: string, paths: string[]): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove(paths);

  if (error) throw error;
}