export const EditorErrors = {
  INVALID_CONTENT: 'Invalid content format',
  UPLOAD_FAILED: 'Failed to upload file',
  SANITIZATION_ERROR: 'Failed to sanitize the input content',
  PERFORMANCE_DEGRADATION: 'Editor performance may degrade with large content',
} as const;

export type EditorError = keyof typeof EditorErrors;