"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  $getRoot,
} from 'lexical';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

// GhostNote Theme
const ghostNoteTheme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    overflowed: 'editor-text-overflowed',
    hashtag: 'editor-text-hashtag',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenProperty',
    builtin: 'editor-tokenSelector',
    cdata: 'editor-tokenComment',
    char: 'editor-tokenSelector',
    class: 'editor-tokenFunction',
    'class-name': 'editor-tokenFunction',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenProperty',
    deleted: 'editor-tokenProperty',
    doctype: 'editor-tokenComment',
    entity: 'editor-tokenOperator',
    function: 'editor-tokenFunction',
    important: 'editor-tokenVariable',
    inserted: 'editor-tokenSelector',
    keyword: 'editor-tokenAttr',
    namespace: 'editor-tokenVariable',
    number: 'editor-tokenProperty',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenComment',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenVariable',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenSelector',
    symbol: 'editor-tokenProperty',
    tag: 'editor-tokenProperty',
    url: 'editor-tokenOperator',
    variable: 'editor-tokenVariable',
  },
};

// Enhanced Toolbar Component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateToolbar]);

  return (
    <div className="flex items-center gap-2 p-3 bg-ghost-dark/90 border-b border-ghost-purple/20 rounded-t-lg">
      <Button
        variant="outline"
        size="sm"
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
        </svg>
      </Button>
      
      <div className="w-px h-6 bg-ghost-purple/30 mx-2" />
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={`border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20 ${isBold ? 'bg-ghost-purple/20 text-ghost-neon' : ''}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 100-8H6v8z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12v6" />
        </svg>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={`border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20 ${isItalic ? 'bg-ghost-purple/20 text-ghost-neon' : ''}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={`border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20 ${isUnderline ? 'bg-ghost-purple/20 text-ghost-neon' : ''}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={`border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20 ${isStrikethrough ? 'bg-ghost-purple/20 text-ghost-neon' : ''}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      </Button>
      
      <div className="w-px h-6 bg-ghost-purple/30 mx-2" />
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
        </svg>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Button>
    </div>
  );
}

// Word Count Plugin
function WordCountPlugin({ onWordCountChange }: { onWordCountChange: (wordCount: number, charCount: number) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({editorState}) => {
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

function Placeholder() {
  return <div className="editor-placeholder text-gray-400">Start writing your note...</div>;
}

const CreateNotePage = () => {
  const [title, setTitle] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const initialConfig = {
    namespace: 'CreateNoteEditor',
    theme: ghostNoteTheme,
    onError: (error: Error) => {
      console.error('Lexical Editor Error:', error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving note with title:', title);
  };

  const handleWordCountChange = (words: number, chars: number) => {
    setWordCount(words);
    setCharCount(chars);
  };

  return (
    <div className="min-h-screen bg-ghost-black p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-2xl border-ghost-purple/20 bg-ghost-dark/95">
          <CardHeader className="border-b border-ghost-purple/20 bg-ghost-dark/90">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl font-bold text-white">
                Create New Note
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-400">
                  {wordCount} words • {charCount} characters
                </div>
                <Button 
                  onClick={handleSave} 
                  className="bg-ghost-purple hover:bg-ghost-purple/80 text-white"
                >
                  Save Note
                </Button>
              </div>
            </div>
            <Input
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold border-0 p-0 focus:ring-0 shadow-none bg-transparent text-white placeholder-gray-400"
            />
          </CardHeader>
          <CardContent className="p-0">
            <LexicalComposer initialConfig={initialConfig}>
              <div className="editor-container">
                <ToolbarPlugin />
                <div className="editor-inner">
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable 
                        className="editor-input min-h-[70vh] p-6 bg-ghost-dark/80 border-0 focus:outline-none focus:ring-0 text-white prose-editor overflow-hidden text-base leading-relaxed" 
                      />
                    }
                    placeholder={<Placeholder />}
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <HistoryPlugin />
                  <AutoFocusPlugin />
                  <LinkPlugin />
                  <ListPlugin />
                  <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                  <WordCountPlugin onWordCountChange={handleWordCountChange} />
                </div>
              </div>
            </LexicalComposer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateNotePage;
