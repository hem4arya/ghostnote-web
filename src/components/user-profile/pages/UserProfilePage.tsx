/**
 * UserProfilePage Component
 * Main user profile page displaying profile info and published notes
 */

'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/shared/ui/components/button';
import { ProfileHeader } from '../components/ProfileHeader';
import { PublishedNotes } from '../components/PublishedNotes';
import { useUserProfile } from '../hooks/useUserProfile';
import type { UserProfilePageProps } from '../types';

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ username }) => {
  const {
    profile,
    notes,
    profileLoading,
    notesLoading,
    error
  } = useUserProfile(username);

  // Error state
  if (error && !profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history.back()}
                className="hover:bg-muted/50"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Profile</h1>
                <p className="text-sm text-muted-foreground">@{decodeURIComponent(username)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Profile Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error}
            </p>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Profile</h1>
              <p className="text-sm text-muted-foreground">
                @{decodeURIComponent(username)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <ProfileHeader
            profile={profile}
            loading={profileLoading}
          />

          {/* Published Notes */}
          {!profileLoading && profile && (
            <PublishedNotes
              notes={notes}
              loading={notesLoading}
              username={username}
            />
          )}
        </div>
      </div>
    </div>
  );
};