import type { Editor } from '@tiptap/react';
import type { Commands } from '@tiptap/core';
import type { NodeType } from 'prosemirror-model';

export interface ExtensionConfig<T> {
  name: string;
  options: T;
  storage: Record<string, unknown>;
  editor: Editor;
  type: NodeType;
  parent?: () => Partial<Commands<boolean>>;
}

export interface FontSizeOptions {
  types: string[];
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

export interface CommandProps {
  editor: Editor;
  commands: {
    liftListItem: (type: string) => boolean;
    updateAttributes: (type: string, attrs: Record<string, unknown>) => boolean;
    toggleList: (listType: string, itemType: string) => boolean;
  };
  chain: () => Commands<boolean>;
}

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

export type ExtensionCommand = (props: CommandProps) => boolean;
export type ExtensionCommands = Partial<Record<string, ExtensionCommand>>;