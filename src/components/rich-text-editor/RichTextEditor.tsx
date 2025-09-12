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
 * This is the foundational implementation that will be expanded with full functionality.
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
  features = {
    basicFormatting: true,
    advancedFormatting: true,
    media: true,
    tables: true,
    code: true,
    math: true,
    citations: true,
    collaboration: false,
  },
  theme = "auto",
  showToolbar = true,
  onEditorReady, // New prop to pass editor instance to parent
}) => {
  // Use initialContent if provided, otherwise use content
  const editorContent = initialContent || content;
   
  const { editor } = useEditor({
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
    return <div className="rich-text-editor-loading">Loading editor...</div>;
  }

  return (
    <div className={`rich-text-editor toolbar-only ${className}`} data-theme={theme}>
      {showToolbar && (
        <EditorToolbar
          editor={editor}
          features={features}
          className="editor-toolbar"
        />
      )}
      <div className="editor-content-wrapper">
        <EditorContent editor={editor} className="editor-content" />
      </div>
    </div>
  );
};

export default RichTextEditor;