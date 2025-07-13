/**
 * Lexical editor configuration for GhostNote
 * Centralized configuration for all editor instances
 */

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ImageNode } from '@lexical/image';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { MarkNode } from '@lexical/mark';
import { HorizontalRuleNode } from '@lexical/horizontal-rule';
import { HashtagNode } from '@lexical/hashtag';
import type { InitialConfigType } from '@lexical/react/LexicalComposer';

import GhostNoteTheme from '../editor/themes/GhostNoteTheme';

const editorConfig: InitialConfigType = {
  namespace: 'GhostNote Editor',
  theme: GhostNoteTheme,
  onError: (error: Error) => {
    console.error('Lexical Error:', error);
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    AutoLinkNode,
    LinkNode,
    ImageNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    MarkNode,
    HorizontalRuleNode,
    HashtagNode,
  ],
  editorState: null,
};

export default editorConfig; 