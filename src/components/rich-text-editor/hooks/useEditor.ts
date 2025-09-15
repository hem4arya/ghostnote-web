'use client';

import { useEffect, useRef } from 'react';
import { useEditor as useTiptapEditor } from '@tiptap/react';
import type { EditorView } from 'prosemirror-view';

// Tiptap Core & Extensions
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { LinkExtension } from '../extensions/LinkExtension';
import Mention from '@tiptap/extension-mention';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
// Code highlighting
import { common, createLowlight } from 'lowlight';

// Third-party Libraries
import DOMPurify from 'isomorphic-dompurify';
import { debounce } from 'lodash';

// Initialize lowlight with common languages
const lowlight = createLowlight(common);

// Install CharacterCount extension
import CharacterCount from '@tiptap/extension-character-count';

// Local Custom Extensions & Types
import { TableExtensions } from '../extensions/TableExtensions';
import { TextAlignExtension } from '../extensions/TextAlignExtension';
import { 
  createBulletListExtension,
  createOrderedListExtension,
  createTaskItemExtension 
} from '../extensions/ListExtensions';
// --- ERROR: FontSizeExtension and TextCaseExtension were used but not imported.
// --- You need to import them from your local files. Example:
// import { FontSizeExtension } from '../extensions/FontSizeExtension';
// import { TextCaseExtension } from '../extensions/TextCaseExtension';

import { EditorErrors } from './constants';
import type { UseEditorOptions } from './types';

const useEditor = (options: UseEditorOptions = {}) => {
  const { 
    content = '', 
    placeholder = 'Start writing...', 
    autoFocus = false, 
    onUpdate, 
    onChange,
    onSave,
    editable = true
  } = options;

  const debouncedSave = useRef(onSave ? debounce(onSave, 500) : undefined).current;

  const sanitizeContent = (html: string) => {
    try {
      if (typeof html !== 'string') {
        return '';
      }
      // Added common tags and attributes for rich text content
      const clean = DOMPurify.sanitize(html, { 
        USE_PROFILES: { html: true }, 
        ADD_TAGS: ['iframe', 'img', 'code', 'pre', 'blockquote'], 
        ADD_ATTR: ['target', 'allowfullscreen', 'frameborder', 'src', 'alt', 'class', 'data-language'] 
      });
      return clean;
    } catch {
      throw new Error(EditorErrors.SANITIZATION_ERROR);
    }
  };

  const editor = useTiptapEditor({
    extensions: [
      CharacterCount.configure({
        limit: 10000
      }),
      ...TableExtensions,
      LinkExtension.configure({
        HTMLAttributes: {
          class: 'cursor-pointer text-blue-500 hover:text-blue-600 underline',
        },
      }),
      StarterKit.configure({ 
        heading: { levels: [1, 2, 3, 4, 5, 6] }, 
        // Disabled to use custom list extensions below
        bulletList: false, 
        orderedList: false 
      }),
      createBulletListExtension(),
      createOrderedListExtension(),
      TaskList.configure({ itemTypeName: 'taskItem' }),
      createTaskItemExtension(),
      TextAlignExtension,
      Underline,
      Superscript,
      Subscript,
      HorizontalRule,
      TextStyle,
      FontFamily.configure({ types: ['textStyle'] }),
      Color.configure({ types: ['textStyle'] }),
      Highlight.configure({ multicolor: true }),
      LinkExtension,
      Mention.configure({ 
        // You'll need to define suggestion options for Mention to be useful
        suggestion: {} 
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),
      Image.configure({ inline: true, allowBase64: true }),
      // --- ERROR FIX: These extensions must be imported to be used.
      // --- Uncomment these lines after importing them above.
      // FontSizeExtension,
      // TextCaseExtension,
      ...TableExtensions,
      // --- ERROR FIX: TextAlignExtension was listed twice. Removed duplicate.
    ],
    content: sanitizeContent(content),
    editable,
    autofocus: autoFocus,
    editorProps: {
      attributes: { 
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        'data-placeholder': placeholder 
      },
      handleDOMEvents: {
        input: () => {
          const html = sanitizeContent(editor?.getHTML() ?? '');
          onUpdate?.(editor!);
          onChange?.(html);
          debouncedSave?.(html);
          return false;
        },
      },
      handlePaste: () => false,
      handleDrop: (view: EditorView, event: DragEvent) => {
        const files = event.dataTransfer?.files;
        if (files?.length) {
          const file = files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onload = (e) => {
              const dataUrl = e.target?.result as string;
              if (editor) {
                const { schema } = view.state;
                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                if (!coordinates) return;
                const node = schema.nodes.image.create({ src: dataUrl });
                const transaction = view.state.tr.insert(coordinates.pos, node);
                view.dispatch(transaction);
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && editable) {
      // Monitor performance through character count extension
      const text = editor.getText();
      const wordCount = text.trim().split(/\s+/).length;
      if (wordCount > 10000) console.warn(EditorErrors.PERFORMANCE_DEGRADATION);
    }
  }, [editor, editable]);

  return editor; // It's conventional to return the editor instance directly
};

export default useEditor;