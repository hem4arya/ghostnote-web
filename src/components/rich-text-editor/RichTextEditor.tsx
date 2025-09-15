"use client";

import React from "react";
import { EditorContent } from "@tiptap/react";
import { RichTextEditorProps } from "./types";
import { useEditor } from "./hooks";
import { EditorToolbar } from "./components";
import "./styles/editor.css";

/**
 * RichTextEditor Component
 *
 * Main rich text editor component built with Tiptap.
 * This is the foundational implementation that integrates toolbar, link dialog, and table menu.
 */
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content = "",
  initialContent,
  placeholder = "Start writing...",
  editable = true,
  autoFocus = false,
  className = "",
  onUpdate,
  onChange,
  onSave, // eslint-disable-line @typescript-eslint/no-unused-vars
  theme = "auto",
  showToolbar = true,
  onEditorReady,
}) => {
  // Use initialContent if provided, otherwise use content
  const editorContent = initialContent || content;

  // Initialize editor with useEditor hook
  const editor = useEditor({
    content: editorContent,
    placeholder,
    autoFocus,
    onUpdate,
    onChange,
    editable,
  });

  // Pass editor instance to parent when ready
  React.useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  if (!editor) {
    return (
      <div className="rich-text-editor-loading" data-theme={theme}>
        Loading editor...
      </div>
    );
  }

  return (
    <div
      className={`rich-text-editor ${showToolbar ? "toolbar-only" : "no-toolbar"} ${className}`}
      data-theme={theme}
    >
      {showToolbar && (
        <EditorToolbar editor={editor} />
      )}
      <div className="editor-content-wrapper">
        <EditorContent editor={editor} className="editor-content" />
      </div>
    </div>
  );
};

export default RichTextEditor;