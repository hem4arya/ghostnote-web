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
import { Extension } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';

interface UseEditorOptions {
  content?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onUpdate?: (content: string) => void;
  onChange?: (content: string) => void;
  editable?: boolean;
}

// Type definitions for Tiptap command parameters
interface CommandProps {
  commands: {
    liftListItem: (type: string) => boolean;
    updateAttributes: (type: string, attrs: Record<string, unknown>) => boolean;
    toggleList: (listType: string, itemType: string) => boolean;
  };
  editor: {
    isActive: (type: string) => boolean;
    getAttributes: (type: string) => Record<string, unknown>;
  };
  chain: () => {
    toggleBulletList: () => { updateAttributes: (type: string, attrs: Record<string, unknown>) => { run: () => boolean } };
    toggleOrderedList: () => { updateAttributes: (type: string, attrs: Record<string, unknown>) => { run: () => boolean } };
    toggleTaskList: () => { updateAttributes: (type: string, attrs: Record<string, unknown>) => { run: () => boolean } };
  };
}

interface AttributeProps {
  [key: string]: unknown;
}

interface HTMLAttributeProps {
  [key: string]: unknown;
}

/**
 * Custom BulletList Extension
 */
const CustomBulletList = BulletList.extend({
  addAttributes() {
    return {
      styleType: {
        default: 'disc',
        parseHTML: (el: HTMLElement) => el.style.listStyleType || 'disc',
        renderHTML: (attributes: AttributeProps) => ({
          style: attributes.styleType === 'none' ? '' : `list-style-type: ${attributes.styleType}`,
          'data-style-type': attributes.styleType,
        }),
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setBulletStyle: (styleType: string) => ({ commands, editor, chain }: CommandProps) => {
        if (editor.isActive('bulletList')) {
          const currentStyle = editor.getAttributes('bulletList').styleType;
          if (currentStyle === styleType) {
            return commands.liftListItem('listItem');
          }
          return commands.updateAttributes('bulletList', { styleType });
        }
        return chain().toggleBulletList().updateAttributes('bulletList', { styleType }).run();
      },
    };
  },
});

/**
 * Custom OrderedList Extension
 */
const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      styleType: {
        default: 'decimal',
        parseHTML: (el: HTMLElement) => el.style.listStyleType || 'decimal',
        renderHTML: (attributes: AttributeProps) => ({
          style: `list-style-type: ${attributes.styleType}`,
          'data-style-type': attributes.styleType,
        }),
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setOrderedStyle: (styleType: string) => ({ commands, editor, chain }: CommandProps) => {
        if (editor.isActive('orderedList')) {
          const currentStyle = editor.getAttributes('orderedList').styleType;
          if (currentStyle === styleType) {
            return commands.liftListItem('listItem');
          }
          return commands.updateAttributes('orderedList', { styleType });
        }
        return chain().toggleOrderedList().updateAttributes('orderedList', { styleType }).run();
      },
    };
  },
});

/**
 * Custom TaskItem Extension
 */
const CustomTaskItem = TaskItem.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      markerType: {
        default: 'checkbox',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-marker-type') || 'checkbox',
        renderHTML: (attributes: AttributeProps) => ({
          'data-marker-type': attributes.markerType,
        }),
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setTaskMarker: (markerType: string) => ({ commands, editor, chain }: CommandProps) => {
        if (editor.isActive('taskList')) {
          const currentMarker = editor.getAttributes('taskItem').markerType;
          if (currentMarker === markerType) {
            return commands.liftListItem('taskItem');
          }
          return commands.updateAttributes('taskItem', { markerType });
        }
        return chain().toggleTaskList().updateAttributes('taskItem', { markerType }).run();
      },
      toggleTaskCross: () => ({ commands, editor }: CommandProps) => {
        if (editor.isActive('taskItem')) {
          const currentMarker = editor.getAttributes('taskItem').markerType;
          if (currentMarker === 'cross') {
            return commands.toggleList('taskList', 'taskItem');
          }
          return commands.updateAttributes('taskItem', { markerType: 'cross', checked: true });
        }
        return false;
      },
    };
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: HTMLAttributeProps }) {
    const markerType = HTMLAttributes['data-marker-type'] || 'checkbox';
    let inputType = markerType === 'radio' ? 'radio' : 'checkbox';
    let checked = HTMLAttributes.checked ? 'checked' : null;

    if (markerType === 'check' || markerType === 'cross') {
      inputType = 'checkbox';
      checked = HTMLAttributes.checked ? 'checked' : null;
    }

    return [
      'li',
      { ...HTMLAttributes, 'data-type': 'taskItem', 'data-marker-type': markerType },
      [
        'label',
        [
          'input',
          {
            type: inputType,
            checked,
            'data-marker-type': markerType,
          },
        ],
        ['span', { 'data-type': 'label-content' }, 0],
      ],
    ];
  },
});

/**
 * Custom TaskList
 */
const CustomTaskList = TaskList.configure({
  itemTypeName: 'taskItem',
});

/**
 * Font Size Extension
 */
const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: { chain: any }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }: { chain: any }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    } as any;
  },
});

/**
 * Text Case Extension
 */
const TextCase = Extension.create({
  name: 'textCase',

  addCommands() {
    return {
      toggleUppercase: () => ({ editor, chain }: { editor: any; chain: any }) => {
        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to);
        const upperText = text.toUpperCase();
        
        return chain()
          .insertContentAt({ from, to }, upperText)
          .run();
      },
      toggleLowercase: () => ({ editor, chain }: { editor: any; chain: any }) => {
        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to);
        const lowerText = text.toLowerCase();
        
        return chain()
          .insertContentAt({ from, to }, lowerText)
          .run();
      },
      toggleTitleCase: () => ({ editor, chain }: { editor: any; chain: any }) => {
        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to);
        const titleText = text.replace(/\w\S*/g, (txt: string) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        
        return chain()
          .insertContentAt({ from, to }, titleText)
          .run();
      },
    } as any;
  },
});

/**
 * useEditor Hook
 */
const useEditor = (options: UseEditorOptions = {}) => {
  const {
    content = '',
    placeholder = 'Start writing...',
    autoFocus = false,
    onUpdate,
    onChange,
    editable = true,
  } = options;

  const editor = useTiptapEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      CustomBulletList,
      CustomOrderedList,
      CustomTaskList,
      CustomTaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Superscript,
      Subscript,
      HorizontalRule,
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      FontSize,
      TextCase,
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
  };
};

export default useEditor;