/**
 * AvatarUpload Component
 * Handles avatar image upload to Supabase Storage
 */

"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/shared/ui/components/button";
import { Input } from "@/components/shared/ui/components/input";
import { Label } from "@/components/shared/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui/components/card";
import { Upload, User, X, Camera } from "lucide-react";
import { getSupabaseClient } from "@lib/supabase";
import { toast } from "sonner";
import type { Profile } from "../types";

interface AvatarUploadProps {
  profile: Profile | null;
  onAvatarUpdate: (avatarUrl: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  profile,
  onAvatarUpdate,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = getSupabaseClient();

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Clear selected file
  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload avatar to Supabase Storage
  const handleUpload = async () => {
    if (!selectedFile || !profile?.id) {
      toast.error("Please select an image and ensure you are logged in");
      return;
    }

    try {
      setUploading(true);
      console.log("Starting avatar upload for user:", profile.id);

      // Generate unique filename
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      console.log("Uploading to path:", filePath);

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("Avatars")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);

        // Handle specific bucket not found error
        if (
          uploadError.message.includes("Bucket not found") ||
          uploadError.message.includes("bucket does not exist") ||
          uploadError.message.includes("The resource was not found")
        ) {
          toast.error(
            '❌ Storage bucket "Avatars" not found. Please create it in your Supabase dashboard first.'
          );
          console.error(
            "🔧 Bucket setup required. Please follow the setup guide in supabase-storage-setup.md"
          );
        } else {
          toast.error(`Upload failed: ${uploadError.message}`);
        }
        return;
      }

      console.log("Upload successful:", uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("Avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log("Public URL:", publicUrl);

      // Update profile in database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", profile.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        toast.error(`Failed to update profile: ${updateError.message}`);
        return;
      }

      console.log("Profile updated successfully");

      // Update local state
      onAvatarUpdate(publicUrl);

      // Clear selection
      clearSelection();

      toast.success("Avatar updated successfully!");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Camera className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Profile Avatar</CardTitle>
            <CardDescription>
              Upload a profile picture (max 5MB)
              <br />
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Avatar Display */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Current avatar"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ghost-purple to-ghost-neon flex items-center justify-center border-2 border-primary/20">
                <User className="h-10 w-10 text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Current Avatar
            </p>
            <p className="text-xs text-muted-foreground">
              {profile?.avatar_url
                ? "Custom avatar uploaded"
                : "Using default avatar"}
            </p>
          </div>
        </div>

        {/* File Selection */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Select New Avatar
            </Label>
            <div className="flex items-center gap-3">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                className="border-white/20 hover:border-white/40"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
              {selectedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, GIF, WebP (max 5MB)
            </p>
          </div>

          {/* Preview */}
          {selectedFile && previewUrl && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Preview
              </Label>
              <div className="flex items-center gap-4 p-4 border border-border/50 rounded-lg bg-muted/20">
                <Image
                  src={previewUrl}
                  alt="Avatar preview"
                  width={60}
                  height={60}
                  className="w-15 h-15 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="bg-primary hover:bg-primary/90 hover:shadow-[0_0_16px_rgba(0,255,65,0.3)] hover:border-[#00ff41] text-white font-medium px-6 py-2 transition-all duration-300 border border-transparent"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Avatar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
