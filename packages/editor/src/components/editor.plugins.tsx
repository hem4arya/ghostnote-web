/**
 * Lexical editor plugins for GhostNote
 * Reusable plugins for formatting, hotkeys, and utilities
 */

import React, { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, EditorState, LexicalEditor } from 'lexical';

// Word Count Plugin
interface WordCountPluginProps {
  onWordCountChange: (wordCount: number, charCount: number) => void;
}

export function WordCountPlugin({ onWordCountChange }: WordCountPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
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

// Placeholder Plugin
interface PlaceholderPluginProps {
  placeholder?: string;
}

export function PlaceholderPlugin({ placeholder = "Start writing..." }: PlaceholderPluginProps) {
  return (
    <div className="editor-placeholder text-gray-400 pointer-events-none absolute top-6 left-6">
      {placeholder}
    </div>
  );
}

// Content Change Plugin
interface ContentChangePluginProps {
  onChange?: (editorState: EditorState, editor: LexicalEditor) => void;
}

export function ContentChangePlugin({ onChange }: ContentChangePluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!onChange) return;

    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState, editor);
    });
  }, [editor, onChange]);

  return null;
}

// Auto Save Plugin
interface AutoSavePluginProps {
  onSave?: (content: string) => void;
  interval?: number; // milliseconds
}

export function AutoSavePlugin({ onSave, interval = 30000 }: AutoSavePluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!onSave) return;

    const timer = setInterval(() => {
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const content = root.getTextContent();
        if (content.trim()) {
          onSave(content);
        }
      });
    }, interval);

    return () => clearInterval(timer);
  }, [editor, onSave, interval]);

  return null;
}

// Keyboard Shortcuts Plugin
export function KeyboardShortcutsPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        // Trigger save action - you can customize this
        console.log('Save triggered via keyboard shortcut');
      }

      // Ctrl/Cmd + B for bold
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        // You can dispatch formatting commands here
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

  return null;
} 