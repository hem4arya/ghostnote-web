/**
 * SettingsPage Component
 * Main settings page with profile management
 */

'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/shared/ui/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/components/tabs';
import { ProfileSettings } from '@/components/settings/components/ProfileSettings';
import { PreferencesSettings } from '@/components/settings/components/PreferencesSettings';
import { AvatarUpload } from '@/components/settings/components/AvatarUpload';
import { ProfilePreview } from '@/components/settings/components/ProfilePreview';
import { useProfile } from '@/components/settings/hooks/useProfile';
import { useSettings } from '@/components/settings/hooks/useSettings';
import type { SettingsPageProps } from '@/components/settings/types';

export const SettingsPage: React.FC<SettingsPageProps> = () => {
  const { loading: authLoading, checkAuth, goBack } = useSettings();
  const { profile, publishedNotes, loading: profileLoading, saveProfile, updateAvatarUrl } = useProfile();

  // Check authentication
  if (!checkAuth()) {
    return null;
  }

  // Loading state
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
            <TabsTrigger value="preview">Preview Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="space-y-6">
            {/* Avatar Upload */}
            {!profileLoading && profile && (
              <AvatarUpload
                profile={profile}
                onAvatarUpdate={updateAvatarUrl}
              />
            )}

            {/* Profile Settings */}
            <ProfileSettings
              profile={profile}
              loading={profileLoading}
              onSave={saveProfile}
            />

            {/* Preferences Settings */}
            <PreferencesSettings />
          </TabsContent>

          <TabsContent value="preview">
            <ProfilePreview 
              profile={profile}
              publishedNotes={publishedNotes}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;