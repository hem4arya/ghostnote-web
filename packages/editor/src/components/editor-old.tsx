"use client";

import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $getRoot, EditorState, LexicalEditor } from "lexical";
import { useCallback, useState } from "react";

import { Badge } from "../../../ui-components/src/components/badge";
import { Card, CardContent } from "../../../ui-components/src/components/card";

import EditorToolbar from "./editor-toolbar";
import editorConfig from "./editor.config";
import "./editor.css";
import { PlaceholderPlugin, WordCountPlugin } from "./editor.plugins";

interface EditorProps {
  onChange?: (editorState: EditorState, editor: LexicalEditor) => void;
  onWordCountChange?: (wordCount: number, charCount: number) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  initialContent?: string;
  showToolbar?: boolean;
  showWordCount?: boolean;
}

export default function Editor({
  onChange,
  onWordCountChange,
  placeholder = "Start writing your note...",
  className = "",
  autoFocus = false,
  initialContent,
  showToolbar = true,
  showWordCount = true,
}: EditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const config = {
    ...editorConfig,
    editorState: initialContent,
  };

  const handleWordCountChange = useCallback(
    (words: number, chars: number) => {
      setWordCount(words);
      setCharCount(chars);
      onWordCountChange?.(words, chars);
    },
    [onWordCountChange]
  );

  return (
    <Card
      className={`border-ghost-purple/20 bg-ghost-dark/95 shadow-2xl ${className}`}
    >
      <LexicalComposer initialConfig={config}>
        <CardContent className="p-0">
          {showToolbar && <EditorToolbar />}

          <div className="editor-container">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-content-editable min-h-[70vh] p-6 bg-ghost-dark/80 border-0 focus:outline-none focus:ring-0 text-white prose-editor overflow-hidden text-base leading-relaxed"
                  aria-placeholder={placeholder}
                  placeholder={placeholder}
                />
              }
              placeholder={
                <div className="editor-placeholder text-gray-400 pointer-events-none absolute top-6 left-6">
                  {placeholder}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />

            <HistoryPlugin />
            <LinkPlugin />
            <ListPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <PlaceholderPlugin />
            <WordCountPlugin onWordCountChange={handleWordCountChange} />
            {autoFocus && <AutoFocusPlugin />}
          </div>

          {showWordCount && (
            <div className="flex items-center justify-between p-4 border-t border-ghost-purple/20 bg-ghost-dark/90">
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className="border-ghost-purple/30 text-gray-300"
                >
                  {wordCount} words
                </Badge>
                <Badge
                  variant="outline"
                  className="border-ghost-purple/30 text-gray-300"
                >
                  {charCount} characters
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </LexicalComposer>
    </Card>
  );
}

// Export content getter for external use
export function useEditorContent() {
  const [editor] = useLexicalComposerContext();

  const getContent = useCallback(() => {
    return editor.getEditorState().read(() => {
      const root = $getRoot();
      return root.getTextContent();
    });
  }, [editor]);

  const getEditorState = useCallback(() => {
    return editor.getEditorState();
  }, [editor]);

  return { getContent, getEditorState, editor };
}
