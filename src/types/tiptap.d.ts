declare module '@tiptap/react' {
  import type { Editor as CoreEditor, Extensions } from '@tiptap/core';
  import type { EditorOptions } from '@tiptap/pm/state';
  import React from 'react';

  export interface EditorContentProps {
    editor: Editor | null;
    className?: string;
  }

  export type Editor = CoreEditor;
  
  export const EditorContent: React.FC<EditorContentProps>;
  
  export interface UseEditorOptions extends Partial<EditorOptions> {
    content?: string;
    extensions?: Extensions;
    injectCSS?: boolean;
    editable?: boolean;
    autofocus?: boolean;
    editorProps?: Record<string, unknown>;
    parseOptions?: Record<string, unknown>;
    enableCoreExtensions?: boolean;
  }

  export const useEditor: (options?: UseEditorOptions) => Editor | null;
  
  export type { Extensions, Editor as TiptapEditor } from '@tiptap/core';
}