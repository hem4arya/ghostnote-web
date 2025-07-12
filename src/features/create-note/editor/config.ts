/**
 * Lexical editor configuration for GhostNote
 */

import { HeadingNode, QuoteNode } from '../lexical/packages/lexical-rich-text/src';
import { ListItemNode, ListNode } from '../lexical/packages/lexical-list/src';
import { CodeHighlightNode, CodeNode } from '../lexical/packages/lexical-code/src';
import { AutoLinkNode, LinkNode } from '../lexical/packages/lexical-link/src';
import { ImageNode } from '../lexical/packages/lexical-image/src';
import { TableCellNode, TableNode, TableRowNode } from '../lexical/packages/lexical-table/src';
import { MarkNode } from '../lexical/packages/lexical-mark/src';
import { HorizontalRuleNode } from '../lexical/packages/lexical-horizontal-rule/src';
import { HashtagNode } from '../lexical/packages/lexical-hashtag/src';
import type { InitialConfigType } from '../lexical/packages/lexical-react/src/LexicalComposer';

import GhostNoteTheme from './themes/GhostNoteTheme';

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
