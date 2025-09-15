import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TaskItem from '@tiptap/extension-task-item';
import type { ExtensionCommand } from '../hooks/types';

export const createBulletListExtension = () => {
  type BulletListAttributes = {
    styleType: {
      default: string;
      parseHTML: (el: HTMLElement) => string;
      renderHTML: (attributes: { styleType: string }) => { style: string; 'data-style-type': string };
    };
  };
  return BulletList.extend({
    addAttributes(): BulletListAttributes {
      return {
        styleType: {
          default: 'disc',
          parseHTML: (el: HTMLElement) => el.style.listStyleType || 'disc',
          renderHTML: (attributes: { styleType: string }) => ({
            style: attributes.styleType === 'none' ? '' : `list-style-type: ${attributes.styleType}`,
            'data-style-type': attributes.styleType,
          }),
        },
      };
    },
    addCommands() {
      return {
        ...this.parent?.(),
        setBulletStyle: (styleType: string): ExtensionCommand => 
          ({ commands, editor, chain }): boolean => {
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
};

export const createOrderedListExtension = () => {
  return OrderedList.extend({
    addAttributes() {
      return {
        styleType: {
          default: 'decimal',
          parseHTML: (el: HTMLElement) => el.style.listStyleType || 'decimal',
          renderHTML: (attributes: { styleType: string }) => ({
            style: `list-style-type: ${attributes.styleType}`,
            'data-style-type': attributes.styleType,
          }),
        },
      };
    },
    addCommands() {
      return {
        ...this.parent?.(),
        setOrderedStyle: (styleType: string): ExtensionCommand => 
          ({ commands, editor, chain }) => {
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
};

export const createTaskItemExtension = () => {
  return TaskItem.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        markerType: {
          default: 'checkbox',
          parseHTML: (el: HTMLElement) => el.getAttribute('data-marker-type') || 'checkbox',
          renderHTML: (attributes: { markerType: string }) => ({
            'data-marker-type': attributes.markerType,
          }),
        },
      };
    },
    addCommands() {
      return {
        ...this.parent?.(),
        setTaskMarker: (markerType: string): ExtensionCommand =>
          ({ chain }): boolean => {
            return chain().focus().updateAttributes('taskItem', { markerType }).run();
          },
      };
    },
    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, string | number | boolean> }) {
      const attributes = this.options.HTMLAttributes;
      return ['li', { ...attributes, ...HTMLAttributes }, 0];
    },
  });
};