/**
 * Editor Toolbar Component
 * Uses GhostNote UI components for consistent design
 */

import React, { useCallback, useEffect, useState } from 'react';
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
} from 'lexical';

import { Button } from 'packages/ui-components/src/components/button';
import { Separator } from 'packages/ui-components/src/components/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'packages/ui-components/src/components/tooltip';

// Icon components for toolbar buttons
const UndoIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
);

const RedoIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
  </svg>
);

const BoldIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
  </svg>
);

const ItalicIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const UnderlineIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const StrikethroughIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
  </svg>
);

const AlignLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const AlignCenterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
  </svg>
);

const AlignRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const AlignJustifyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default function EditorToolbar() {
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
      editor.registerUpdateListener(({ editorState }) => {
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
    <TooltipProvider>
      <div className="flex items-center gap-2 p-3 bg-ghost-dark/90 border-b border-ghost-purple/20 rounded-t-lg">
        {/* History Controls */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={!canUndo}
              onClick={() => {
                editor.dispatchCommand(UNDO_COMMAND, undefined);
              }}
              className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
            >
              <UndoIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={!canRedo}
              onClick={() => {
                editor.dispatchCommand(REDO_COMMAND, undefined);
              }}
              className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
            >
              <RedoIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 bg-ghost-purple/30" />

        {/* Text Formatting */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
              }}
              className={`border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20 ${
                isBold ? 'bg-ghost-purple/20 text-ghost-neon' : ''
              }`}
            >
              <BoldIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold (Ctrl+B)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
              }}
              className={`border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20 ${
                isItalic ? 'bg-ghost-purple/20 text-ghost-neon' : ''
              }`}
            >
              <ItalicIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic (Ctrl+I)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
              }}
              className={`border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20 ${
                isUnderline ? 'bg-ghost-purple/20 text-ghost-neon' : ''
              }`}
            >
              <UnderlineIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Underline (Ctrl+U)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
              }}
              className={`border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20 ${
                isStrikethrough ? 'bg-ghost-purple/20 text-ghost-neon' : ''
              }`}
            >
              <StrikethroughIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Strikethrough</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 bg-ghost-purple/30" />

        {/* Alignment Controls */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
              }}
              className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
            >
              <AlignLeftIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Left</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
              }}
              className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
            >
              <AlignCenterIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Center</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
              }}
              className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
            >
              <AlignRightIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Right</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
              }}
              className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
            >
              <AlignJustifyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Justify</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
} 
