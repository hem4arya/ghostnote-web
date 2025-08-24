/**
 * ProfileHeader Component
 * Displays user's avatar, username, and bio
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { User, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/shared/ui/components/card';
import type { ProfileHeaderProps } from '../types';

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  loading
}) => {
  if (loading) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar Skeleton */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted/50 animate-pulse" />
            
            {/* Content Skeleton */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="h-8 bg-muted/50 rounded animate-pulse w-48 mx-auto md:mx-0" />
              <div className="space-y-2">
                <div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4 mx-auto md:mx-0" />
              </div>
              <div className="h-4 bg-muted/50 rounded animate-pulse w-32 mx-auto md:mx-0" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-muted/30 flex items-center justify-center">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">User Not Found</h1>
              <p className="text-muted-foreground">
                The profile you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.username || 'User'}
                width={128}
                height={128}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-ghost-purple to-ghost-neon flex items-center justify-center border-4 border-primary/20">
                <User className="h-12 w-12 md:h-16 md:w-16 text-white" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {profile.username || 'Anonymous User'}
            </h1>
            
            {profile.bio && (
              <p className="text-lg text-muted-foreground mb-4 max-w-2xl">
                {profile.bio}
              </p>
            )}

            {/* User Stats */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-4">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-2xl font-bold text-foreground">{profile.notes_count || 0}</span>
                <span className="text-sm text-muted-foreground">Notes</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-2xl font-bold text-foreground">{profile.sales_count || 0}</span>
                <span className="text-sm text-muted-foreground">Sales</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-2xl font-bold text-foreground">{profile.views_count || 0}</span>
                <span className="text-sm text-muted-foreground">Views</span>
              </div>
            </div>

            {profile.created_at && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground mt-4">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};