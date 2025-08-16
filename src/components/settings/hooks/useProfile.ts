/**
 * useProfile Hook
 * Custom hook for managing user profile data
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/navbar/hooks/useAuth";
import { getSupabaseClient } from "@lib/supabase";
import { toast } from "sonner";
import type { Profile, SettingsFormData } from "../types";

export const useProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = getSupabaseClient();

  // Wrap fetchProfile in useCallback to fix dependency warning
  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log("Fetching profile for user:", user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("Fetch result:", { data, error });

      if (error) {
        // If profile doesn't exist (PGRST116), that's okay - we'll create it when saving
        if (error.code === "PGRST116") {
          console.log(
            "Profile doesn't exist yet, will be created on first save"
          );
          setProfile(null);
          return;
        }

        console.error("Error fetching profile:", error);
        toast.error(`Failed to load profile: ${error.message}`);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred while loading profile");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // Save profile changes
  const saveProfile = async (formData: SettingsFormData) => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setSaving(true);
      console.log("Attempting to save profile for user:", user.id);
      console.log("Form data:", formData);

      // First, try to update the existing profile
      const { data: updateData, error: updateError } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          bio: formData.bio,
        })
        .eq("id", user.id)
        .select();

      console.log("Update result:", { updateData, updateError });

      // If profile doesn't exist, create it
      if (updateError && updateError.code === "PGRST116") {
        console.log("Profile doesn't exist, creating new profile...");

        const { data: insertData, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            username: formData.username,
            bio: formData.bio,
            avatar_url: null,
          })
          .select();

        console.log("Insert result:", { insertData, insertError });

        if (insertError) {
          console.error("Error creating profile:", insertError);
          toast.error(`Failed to create profile: ${insertError.message}`);
          return;
        }

        if (insertData && insertData[0]) {
          setProfile(insertData[0]);
          toast.success("Profile created successfully!");
          return;
        }
      }

      // Handle other update errors
      if (updateError) {
        console.error("Error updating profile:", updateError);
        toast.error(`Failed to save profile: ${updateError.message}`);
        return;
      }

      // Update successful
      if (updateData && updateData[0]) {
        setProfile(updateData[0]);
        toast.success("Profile updated successfully!");
      } else {
        // Update local profile state if no data returned
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                username: formData.username,
                bio: formData.bio,
              }
            : null
        );
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  // Update avatar URL in local state
  const updateAvatarUrl = (avatarUrl: string) => {
    setProfile(prev => prev ? {
      ...prev,
      avatar_url: avatarUrl
    } : null);
  };

  // Fetch profile when user is available
  useEffect(() => {
    if (user && !authLoading) {
      fetchProfile();
    }
  }, [user, authLoading, fetchProfile]);

  return {
    profile,
    loading: authLoading || loading,
    saving,
    saveProfile,
    updateAvatarUrl,
    refetchProfile: fetchProfile,
  };
};
