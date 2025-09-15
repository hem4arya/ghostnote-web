const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Common MIME type map for file extensions
const MIME_TYPE_MAP: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
  'text/csv': ['.csv'],
  'application/json': ['.json'],
};

// File signature map for common file types
const FILE_SIGNATURES: { [key: string]: number[] } = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/gif': [0x47, 0x49, 0x46],
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
};

export interface FileValidationError {
  message: string;
  code: 'FILE_TOO_LARGE' | 'INVALID_TYPE' | 'INVALID_SIGNATURE' | 'GENERIC_ERROR';
}

export interface FileValidationResult {
  isValid: boolean;
  error?: FileValidationError;
}

/**
 * Validates a file based on size, MIME type, and file signature
 */
export async function validateFile(file: File): Promise<FileValidationResult> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: {
        code: 'FILE_TOO_LARGE',
        message: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      },
    };
  }

  // Check MIME type
  const allowedExtensions = MIME_TYPE_MAP[file.type];
  if (!allowedExtensions) {
    return {
      isValid: false,
      error: {
        code: 'INVALID_TYPE',
        message: 'File type not allowed',
      },
    };
  }

  // Check file signature
  const signature = FILE_SIGNATURES[file.type];
  if (signature) {
    try {
      const isValidSignature = await validateFileSignature(file, signature);
      if (!isValidSignature) {
        return {
          isValid: false,
          error: {
            code: 'INVALID_SIGNATURE',
            message: 'File signature does not match its type',
          },
        };
      }
    } catch (_error) {
      return {
        isValid: false,
        error: {
          code: 'GENERIC_ERROR',
          message: 'Error validating file signature',
        },
      };
    }
  }

  return { isValid: true };
}

/**
 * Validates a file's signature (magic number) by reading the first few bytes
 */
async function validateFileSignature(file: File, signature: number[]): Promise<boolean> {
  const bytes = await readFileBytes(file, signature.length);
  return signature.every((byte, index) => byte === bytes[index]);
}

/**
 * Reads the first n bytes of a file
 */
async function readFileBytes(file: File, length: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (!reader.result || typeof reader.result === 'string') {
        reject(new Error('Failed to read file bytes'));
        return;
      }
      
      const array = new Uint8Array(reader.result);
      resolve(array.slice(0, length));
    };
    
    reader.onerror = () => reject(reader.error);
    
    const blob = file.slice(0, length);
    reader.readAsArrayBuffer(blob);
  });
}

/**
 * Validates an array of files
 */
export async function validateFiles(files: File[]): Promise<FileValidationResult[]> {
  return Promise.all(files.map(validateFile));
}

/**
 * Gets a friendly file size string
 */
export function getFileSizeString(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}