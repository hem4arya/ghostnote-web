"use client";

import { createSupabaseClient } from "@lib/supabase";
import type { NoteFormData } from "../../types";

const supabase = createSupabaseClient();

export interface SaveNoteResult {
  success: boolean;
  noteId?: number;
  error?: string;
}

export interface AutoSaveOptions {
  title: string;
  content: string;
  wordCount: number;
  characterCount: number;
}

export async function saveNote(
  noteData: NoteFormData
): Promise<SaveNoteResult> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("notes")
      .insert({
        title: noteData.title,
        body: noteData.content,
        tags: noteData.tags,
        user_id: user.id,
        is_public: !noteData.isPrivate,
        price: noteData.isPremium ? noteData.price || 0 : 0,
        word_count: noteData.content
          .split(/\s+/)
          .filter((word) => word.length > 0).length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error saving note:", error);
      return { success: false, error: error.message };
    }

    return { success: true, noteId: data.id };
  } catch (error) {
    console.error("Error saving note:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateNote(
  noteId: number,
  noteData: NoteFormData
): Promise<SaveNoteResult> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error } = await supabase
      .from("notes")
      .update({
        title: noteData.title,
        body: noteData.content,
        tags: noteData.tags,
        is_public: !noteData.isPrivate,
        price: noteData.isPremium ? noteData.price || 0 : 0,
        word_count: noteData.content
          .split(/\s+/)
          .filter((word) => word.length > 0).length,
        updated_at: new Date().toISOString(),
      })
      .eq("id", noteId)
      .eq("user_id", user.id); // Ensure user can only update their own notes

    if (error) {
      console.error("Error updating note:", error);
      return { success: false, error: error.message };
    }

    return { success: true, noteId };
  } catch (error) {
    console.error("Error updating note:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function autoSave(options: AutoSaveOptions): Promise<boolean> {
  try {
    // Simple auto-save to localStorage for now
    // In a full implementation, this could save drafts to the database
    const draftData = {
      title: options.title,
      content: options.content,
      wordCount: options.wordCount,
      characterCount: options.characterCount,
      lastSaved: new Date().toISOString(),
    };

    localStorage.setItem("ghostnote-draft", JSON.stringify(draftData));
    return true;
  } catch (error) {
    console.error("Error auto-saving:", error);
    return false;
  }
}

export async function loadDraft(): Promise<AutoSaveOptions | null> {
  try {
    const draftData = localStorage.getItem("ghostnote-draft");
    if (draftData) {
      const parsed = JSON.parse(draftData);
      return {
        title: parsed.title || "",
        content: parsed.content || "",
        wordCount: parsed.wordCount || 0,
        characterCount: parsed.characterCount || 0,
      };
    }
    return null;
  } catch (error) {
    console.error("Error loading draft:", error);
    return null;
  }
}

export async function clearDraft(): Promise<boolean> {
  try {
    localStorage.removeItem("ghostnote-draft");
    return true;
  } catch (error) {
    console.error("Error clearing draft:", error);
    return false;
  }
}
