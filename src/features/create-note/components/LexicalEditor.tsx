"use client";

import React, { useCallback, useEffect } from 'react';
import './LexicalEditor.css';
import { LexicalComposer } from '../lexical/packages/lexical-react/src/LexicalComposer';
import { RichTextPlugin } from '../lexical/packages/lexical-react/src/LexicalRichTextPlugin';
import { ContentEditable } from '../lexical/packages/lexical-react/src/LexicalContentEditable';
import { HistoryPlugin } from '../lexical/packages/lexical-react/src/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '../lexical/packages/lexical-react/src/LexicalAutoFocusPlugin';
import { ListPlugin } from '../lexical/packages/lexical-react/src/LexicalListPlugin';
import { LinkPlugin } from '../lexical/packages/lexical-react/src/LexicalLinkPlugin';
import { LexicalErrorBoundary } from '../lexical/packages/lexical-react/src/LexicalErrorBoundary';
import { useLexicalComposerContext } from '../lexical/packages/lexical-react/src/LexicalComposerContext';
import { OnChangePlugin } from '../lexical/packages/lexical-react/src/LexicalOnChangePlugin';
import { 
  $getRoot, 
  EditorState,
  LexicalEditor as LexicalEditorType
} from '../lexical/packages/lexical/src';
import { HeadingNode, QuoteNode } from '../lexical/packages/lexical-rich-text/src';
import { ListNode, ListItemNode } from '../lexical/packages/lexical-list/src';
import { LinkNode, AutoLinkNode } from '../lexical/packages/lexical-link/src';
import { CodeNode } from '../lexical/packages/lexical-code/src';
import GhostNoteTheme from '../editor/themes/GhostNoteTheme';

interface LexicalEditorProps {
  onChange: (editorState: EditorState, editor: LexicalEditorType) => void;
  onWordCountChange: (wordCount: number, charCount: number) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  initialContent?: string;
}

// Plugin to handle word count updates
function WordCountPlugin({ onWordCountChange }: { onWordCountChange: (wordCount: number, charCount: number) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener((updateListener: { editorState: EditorState }) => {
      updateListener.editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();
        const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
        const charCount = textContent.length;
        onWordCountChange(wordCount, charCount);
      });
    });
  }, [editor, onWordCountChange]);

  return null;
}

// Plugin to get editor content as text
function ContentExtractionPlugin({ onContentChange }: { onContentChange: (content: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener((updateListener: { editorState: EditorState }) => {
      updateListener.editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();
        onContentChange(textContent);
      });
    });
  }, [editor, onContentChange]);

  return null;
}

export default function LexicalEditor({
  onChange,
  onWordCountChange,
  placeholder = "Start writing your masterpiece...",
  className = "",
  autoFocus = false,
  initialContent
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'GhostNoteEditor',
    theme: GhostNoteTheme,
    onError: (error: Error) => {
      console.error('Lexical Editor Error:', error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      AutoLinkNode,
      CodeNode
    ],
    editorState: initialContent ? initialContent : undefined
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={`relative ${className}`}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="min-h-[70vh] p-4 sm:p-6 md:p-8 bg-ghost-dark/80 rounded-lg border border-ghost-gray/50 focus:outline-none focus:ring-1 focus:ring-ghost-purple/50 focus:border-ghost-purple/30 transition-all duration-200 text-white prose-editor overflow-hidden text-base sm:text-lg leading-relaxed"
              aria-placeholder={placeholder}
              placeholder={
                <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                  {placeholder}
                </div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChange} />
        <WordCountPlugin onWordCountChange={onWordCountChange} />
        <ContentExtractionPlugin onContentChange={() => {}} />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        {autoFocus && <AutoFocusPlugin />}
      </div>
    </LexicalComposer>
  );
}

// Export content getter for external use
export function useLexicalContent() {
  const [editor] = useLexicalComposerContext();
  
  const getContent = useCallback(() => {
    return editor.getEditorState().read(() => {
      const root = $getRoot();
      return root.getTextContent();
    });
  }, [editor]);

  const getEditorState = useCallback(() => {
    return editor.getEditorState();
  }, [editor]);

  return { getContent, getEditorState, editor };
}
