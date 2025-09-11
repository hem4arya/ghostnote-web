'use client';

import { useEditor as useTiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';

interface UseEditorOptions {
  content?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onUpdate?: (content: string) => void;
  onChange?: (content: string) => void;
  editable?: boolean;
}

/**
 * useEditor Hook
 * 
 * Custom hook for managing the Tiptap editor instance and state.
 * This is a placeholder implementation that will be expanded with full functionality.
 */
const useEditor = (options: UseEditorOptions = {}) => {
  const { 
    content = '', 
    placeholder = 'Start writing...', 
    autoFocus = false,
    onUpdate, 
    onChange,
    editable = true 
  } = options;

  const editor = useTiptapEditor({
    extensions: [
      StarterKit.configure({
        // Configure built-in extensions
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      // Text alignment extension
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      // Text styling extensions
      Underline,
      Superscript,
      Subscript,
      // Structural extensions
      HorizontalRule,
      // Task list extensions
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      // Text styling extensions
      TextStyle, // Required for font family and color
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    editable,
    autofocus: autoFocus,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onUpdate) {
        onUpdate(html);
      }
      if (onChange) {
        onChange(html);
      }
    },
  });

  return {
    editor,
    // Additional editor utilities will be added here
  };
};

export default useEditor;