"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@lib/supabase";
import {
  RichTextEditor,
} from "@/components/rich-text-editor";
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
  const [focusMode, ] = useState<boolean>(false);
  const [, setSaving] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);


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
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNoteForm;
