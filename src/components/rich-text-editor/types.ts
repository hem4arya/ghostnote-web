import type { Editor } from '@tiptap/react';

// Define the shape of our custom commands
export interface CustomCommands {
  setFontSize: (fontSize: string) => boolean;
  unsetFontSize: () => boolean;
  toggleUppercase: () => boolean;
  toggleLowercase: () => boolean;
  toggleTitleCase: () => boolean;
  insertMath: () => boolean;
  insertCitation: () => boolean;
}

// Base types and interfaces for the editor

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
  showStatusBar?: boolean;
  onEditorReady?: (editor: import('@tiptap/react').Editor) => void;
}

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

export interface PerformanceConfig {
  debounceInterval: number; // ms
  maxDocumentSize: number; // words
}

export enum EditorError {
  INVALID_CONTENT = 'Invalid content format',
  UPLOAD_FAILED = 'File upload failed',
  SANITIZATION_ERROR = 'Content sanitization failed',
  PERFORMANCE_DEGRADATION = 'Document too large',
}

export interface UseEditorOptions {
  content?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onUpdate?: (content: string) => void;
  onChange?: (content: string) => void;
  editable?: boolean;
}

type Commands = Record<string, unknown>;

export function hasCustomCommands(commands: unknown): commands is Record<string, (...args: unknown[]) => boolean> {
  if (typeof commands !== 'object' || commands === null) return false;
  const commandsObj = commands as Commands;
  return Object.values(commandsObj).every(value => typeof value === 'function');
}