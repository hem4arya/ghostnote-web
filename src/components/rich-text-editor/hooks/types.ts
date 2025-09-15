import type { Editor } from '@tiptap/react';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertMath: () => ReturnType;
    insertCitation: () => ReturnType;
  }
}


export interface UseEditorOptions {
  content?: string;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
  immediatelyRender?: boolean;
  onUpdate?: (editor: Editor) => void;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  autosave?: boolean;
  autosaveInterval?: number;
  features?: {
    tables?: boolean;
    citations?: boolean;
    math?: boolean;
    codeHighlight?: boolean;
    imageUpload?: boolean;
  };
}

export interface EditorError {
  message: string;
  code: string;
  details?: unknown;
}

export interface FontSizeOptions {
  types: string[];
  defaultSize?: string;
}

export interface TextCaseOptions {
  types: string[];
}

export interface HTMLAttributeProps {
  checked?: boolean;
  'data-marker-type'?: string;
  'data-type'?: string;
  style?: string;
  type?: string;
  [key: string]: unknown;
}

export interface ExtendedCommands {
  insertMath: () => boolean;
  insertCitation: () => boolean;
}

export interface ExtendedChain extends ReturnType<Editor['chain']> {
  insertMath: () => ReturnType<Editor['chain']>;
  insertCitation: () => ReturnType<Editor['chain']>;
}

export interface CommandProps {
  editor: Editor & { commands: ExtendedCommands };
  commands: {
    liftListItem: (type: string) => boolean;
    updateAttributes: (type: string, attrs: Record<string, unknown>) => boolean;
    toggleList: (listType: string, itemType: string) => boolean;
  };
  chain: () => ExtendedChain;
}

export interface ExtendedCommandProps extends CommandProps {
  size?: string;
  markerType?: string;
  styleType?: string;
}

export type ExtensionCommand = {
  (props: CommandProps): boolean;
};

export type ExtensionCommands = Record<string, ExtensionCommand>;

export interface AttributeProps {
  styleType?: string;
  markerType?: string;
  fontSize?: string | null;
  [key: string]: string | number | boolean | null | undefined;
}

export interface BulletListOptions {
  HTMLAttributes?: Record<string, string | number | boolean>;
  itemTypeName?: string;
  bulletStyles?: string[];
  defaultStyle?: string;
}

export type SaveFunction = (content: string) => void;

export const EditorErrors = {
  SANITIZATION_ERROR: 'Failed to sanitize content',
  UPLOAD_FAILED: 'Failed to upload file',
  PERFORMANCE_DEGRADATION: 'Editor performance may degrade with large content'
} as const;