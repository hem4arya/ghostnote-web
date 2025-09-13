"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@lib/supabase";
import { RichTextEditor, LinkDialog } from "@/components/rich-text-editor";
import { toast } from "react-toastify";
import { Editor } from "@tiptap/react";
import CompactEditorHeader from "./CompactEditorHeader";
import FloatingWordCount from "./FloatingWordCount";

const CreateNoteForm = () => {
  const router = useRouter();
  const supabase = getSupabaseClient();

  // Basic state
  const [title, setTitle] = useState("");
  const [wordHandle, setWordHandle] = useState("");
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [, setSaving] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  // Validate Word Handle format (two words separated by hyphen)
  const validateWordHandle = (handle: string): boolean => {
    const pattern = /^[a-zA-Z]+(-[a-zA-Z]+)+$/;
    const parts = handle.split("-");
    return (
      pattern.test(handle) &&
      parts.length === 2 &&
      parts.every((part) => part.length > 0)
    );
  };

  const handleWordHandleChange = (value: string) => {
    // Allow only letters, hyphens, and prevent multiple consecutive hyphens
    const sanitized = value
      .toLowerCase()
      .replace(/[^a-z-]/g, "")
      .replace(/-+/g, "-");
    setWordHandle(sanitized);
  };

  const handleContentChange = (htmlContent: string) => {
    setContent(htmlContent);

    // Extract plain text for word/character count
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    setWordCount(plainText.trim() ? plainText.trim().split(/\s+/).length : 0);
    setCharCount(plainText.length);

    // Simulate autosave
    setTimeout(() => setLastSaved(new Date()), 1000);
  };

  // Handle link button click
  const handleLinkClick = () => {
    setIsLinkDialogOpen(true);
  };

  const handleSave = async () => {
    // Extract plain text from HTML content for validation
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    if (!title.trim() && !plainText.trim()) {
      toast.error("Please add a title or content before saving");
      return;
    }

    // Validate Word Handle if provided
    if (wordHandle.trim() && !validateWordHandle(wordHandle.trim())) {
      toast.error(
        'Word Handle must be two words separated by a hyphen (e.g., "my-note")'
      );
      return;
    }

    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to save notes");
        return;
      }

      const trimmedWordHandle = wordHandle.trim();

      // Check if Word Handle already exists (if provided)
      if (trimmedWordHandle) {
        const { data: existingNote } = await supabase
          .from("notes")
          .select("id")
          .eq("word_handle", trimmedWordHandle)
          .single();

        if (existingNote) {
          toast.error(
            "This Word Handle is already taken. Please choose a different one."
          );
          return;
        }
      }

      const { error } = await supabase.from("notes").insert({
        title: title.trim() || "Untitled Note",
        content: content,
        word_handle: trimmedWordHandle || null,
        user_id: user.id,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error saving note:", error);
        toast.error("Failed to save note. Please try again.");
      } else {
        toast.success("Note saved successfully!");
        setLastSaved(new Date());
        // Redirect to dashboard after successful save
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-ghost-black text-white">
      {/* Compact Header - hidden in focus mode */}
      {!focusMode && (
        <CompactEditorHeader
          title={title}
          setTitle={setTitle}
          wordHandle={wordHandle}
          setWordHandle={handleWordHandleChange}
          lastSaved={lastSaved}
          onBackClick={() => router.push("/")}
          onSave={handleSave}
          editor={editor}
          features={{
            basicFormatting: true,
            advancedFormatting: true,
            media: false,
            tables: false,
            code: true,
            math: false,
            citations: false,
            collaboration: false,
          }}
          onLinkClick={handleLinkClick}
        />
      )}

      {/* Floating Word Count - always visible except in focus mode */}
      {!focusMode && (
        <FloatingWordCount wordCount={wordCount} charCount={charCount} />
      )}

      {/* Editor - Clean layout with maximum writing space */}
      <div
        className={focusMode ? "w-full h-screen relative" : "w-full relative"}
      >
        <div className={focusMode ? "h-full" : "max-w-6xl mx-auto px-4 py-6"}>
          <RichTextEditor
            initialContent=""
            placeholder="Start writing your masterpiece..."
            onChange={handleContentChange}
            className={focusMode ? "w-full h-full" : "min-h-[80vh]"}
            autoFocus={false}
            showToolbar={false}
            onEditorReady={setEditor}
            features={{
              basicFormatting: true,
              advancedFormatting: true,
              media: false, // Disable for now to keep it simple
              tables: false,
              code: true,
              math: false,
              citations: false,
              collaboration: false,
            }}
          />
        </div>

        {/* Focus mode toggle button */}
        <button
          onClick={() => setFocusMode(!focusMode)}
          className={
            focusMode
              ? "fixed top-4 right-4 p-3 rounded-full bg-ghost-dark/90 border border-ghost-purple/40 text-gray-400 hover:text-ghost-neon hover:border-ghost-neon/60 transition-all duration-200 z-50 focus:outline-none shadow-lg backdrop-blur-sm"
              : "fixed top-20 right-4 p-2 rounded-full bg-ghost-dark/80 border border-ghost-purple/30 text-gray-400 hover:text-ghost-neon hover:border-ghost-neon/50 transition-all duration-200 z-10 focus:outline-none shadow-md"
          }
          aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"}
          title={focusMode ? "Exit focus mode" : "Enter focus mode"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={focusMode ? "h-5 w-5" : "h-4 w-4"}
          >
            {focusMode ? (
              <path d="M8 3v3a2 2 0 0 1-2 2H3M18 3v3a2 2 0 0 0 2 2h3M3 18v-3a2 2 0 0 1 2-2h3M18 18v-3a2 2 0 0 0-2-2h-3" />
            ) : (
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m13 0h-3a2 2 0 0 1-2-2v-3" />
            )}
          </svg>
        </button>
      </div>

      {/* Link Dialog */}
      {editor && (
        <LinkDialog
          editor={editor}
          isOpen={isLinkDialogOpen}
          onClose={() => setIsLinkDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default CreateNoteForm;
