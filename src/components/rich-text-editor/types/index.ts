// Rich Text Editor Type Definitions

import { Editor } from '@tiptap/react';

/**
 * Core editor configuration and feature flags
 */
export interface EditorFeatures {
  basicFormatting: boolean;
  advancedFormatting: boolean;
  media: boolean;
  tables: boolean;
  code: boolean;
  math: boolean;
  citations: boolean;
  collaboration: boolean;
}

/**
 * Main Rich Text Editor component props
 */
export interface RichTextEditorProps {
  content?: string;
  initialContent?: string;
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean;
  className?: string;
  onUpdate?: (content: string) => void;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  features?: Partial<EditorFeatures>;
  theme?: 'light' | 'dark' | 'auto';
  showToolbar?: boolean;
  onEditorReady?: (editor: Editor) => void;
}

/**
 * Editor toolbar configuration
 */
export interface EditorToolbarProps {
  editor: Editor | null;
  features: EditorFeatures;
  className?: string;
  position?: 'top' | 'bottom' | 'floating';
}

/**
 * Toolbar item configuration
 */
export interface ToolbarItem {
  name: string;
  icon: React.ComponentType;
  action: () => void;
  isActive: boolean;
  isDisabled: boolean;
  tooltip: string;
}

/**
 * Media upload result
 */
export interface MediaUploadResult {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  error?: string;
}

/**
 * Editor error types
 */
export enum EditorErrorType {
  UPLOAD_FAILED = 'upload_failed',
  FILE_TOO_LARGE = 'file_too_large',
  INVALID_FILE_TYPE = 'invalid_file_type',
  NETWORK_ERROR = 'network_error',
  PERMISSION_DENIED = 'permission_denied',
  CONTENT_VALIDATION_ERROR = 'content_validation_error',
  EXTENSION_ERROR = 'extension_error'
}

/**
 * Editor error interface
 */
export interface EditorError {
  type: EditorErrorType;
  message: string;
  details?: unknown;
  timestamp: Date;
}