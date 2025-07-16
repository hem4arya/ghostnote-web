"use client";

import { createSupabaseClient } from "@lib/supabase";
import { useCallback, useEffect, useState } from "react";
import type { AccessType, Note, UseNoteAccessReturn } from "../types";

export function useNoteAccess(noteId: number): UseNoteAccessReturn {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessType, setAccessType] = useState<AccessType>("free");

  const supabase = createSupabaseClient();

  const checkAccess = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // First, try to get the note data
      const { data: noteData, error: noteError } = await supabase
        .from("notes")
        .select("*")
        .eq("id", noteId)
        .single();

      if (noteError) {
        if (noteError.code === "PGRST116") {
          setError("Note not found");
        } else {
          setError("Failed to load note");
        }
        setLoading(false);
        return;
      }

      setNote(noteData);

      // Determine access type based on note properties
      let currentAccessType: AccessType = "free";
      let currentHasAccess = true;

      if (noteData.isEncrypted) {
        currentAccessType = "encrypted";
      } else if (noteData.isLocked || noteData.price) {
        currentAccessType = "premium";
      } else if (noteData.is_private) {
        currentAccessType = "private";
      }

      // Check if user has access based on access type
      if (currentAccessType === "premium") {
        // Check if user has purchased this note or has premium subscription
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          currentHasAccess = false;
        } else {
          // Check for purchase record or subscription
          const { data: purchaseData } = await supabase
            .from("purchases")
            .select("*")
            .eq("user_id", user.id)
            .eq("note_id", noteId)
            .single();

          const { data: subscriptionData } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "active")
            .single();

          currentHasAccess = !!(purchaseData || subscriptionData);
        }
      } else if (currentAccessType === "private") {
        // Check if user is the owner or has been granted access
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          currentHasAccess = false;
        } else {
          currentHasAccess = noteData.user_id === user.id;
        }
      } else if (currentAccessType === "encrypted") {
        // For encrypted notes, we need to check if user has the decryption key
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          currentHasAccess = false;
        } else {
          // This would typically involve checking for encryption keys
          // For now, we'll assume access if user is authenticated
          currentHasAccess = true;
        }
      }

      setAccessType(currentAccessType);
      setHasAccess(currentHasAccess);
    } catch (err) {
      console.error("Error checking note access:", err);
      setError("Failed to check access permissions");
    } finally {
      setLoading(false);
    }
  }, [noteId, supabase]);

  useEffect(() => {
    if (noteId) {
      checkAccess();
    }
  }, [noteId, checkAccess]);

  return {
    note,
    loading,
    error,
    hasAccess,
    accessType,
    checkAccess,
  };
}
