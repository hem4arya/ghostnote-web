"use client";

import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useState } from "react";

// UI components
import { Badge } from "../../../ui-components/src/components/badge";
import { Card, CardContent } from "../../../ui-components/src/components/card";

interface EditorProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  showToolbar?: boolean;
  onWordCountChange?: (wordCount: number, charCount: number) => void;
}

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
};

export default function Editor({
  placeholder = "Start writing your note...",
  className = "",
  autoFocus = true,
  readOnly = false,
  showToolbar = true,
  onWordCountChange,
}: EditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const initialConfig = {
    namespace: "GhostNoteEditor",
    theme,
    onError: (error: Error) => {
      console.error("Lexical Error:", error);
    },
    editable: !readOnly,
  };

  const handleWordCountChange = (
    newWordCount: number,
    newCharCount: number
  ) => {
    setWordCount(newWordCount);
    setCharCount(newCharCount);
    onWordCountChange?.(newWordCount, newCharCount);
  };

  return (
    <Card
      className={`border-ghost-purple/20 bg-ghost-dark/95 shadow-2xl ${className}`}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <CardContent className="p-0">
          <div className="editor-container">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-content-editable min-h-[70vh] p-6 bg-ghost-dark/80 border-0 focus:outline-none focus:ring-0 text-white prose-editor overflow-hidden text-base leading-relaxed"
                  aria-placeholder={placeholder}
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
            {autoFocus && <AutoFocusPlugin />}
          </div>

          {/* Status bar */}
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
        </CardContent>
      </LexicalComposer>
    </Card>
  );
}
