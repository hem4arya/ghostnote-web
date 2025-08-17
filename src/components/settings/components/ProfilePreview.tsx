'use client';

import React from 'react';
import Image from 'next/image';
import { User2 } from 'lucide-react';
import { NoteCard } from '@/components/note-card/NoteCard';
import { Card } from '@/components/shared/ui/components/card';
import type { Profile, Note } from '../types';
import { parseISO, format as formatDate } from 'date-fns';

interface ProfilePreviewProps {
  profile: Profile | null;
  publishedNotes?: Note[];
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({ profile, publishedNotes = [] }) => {
  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={`${profile.username}'s avatar`}
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <User2 className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{profile.username}</h2>
            {profile.bio && (
              <p className="text-muted-foreground mt-2">{profile.bio}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Joined {profile.created_at ? formatDate(parseISO(profile.created_at), 'MMMM yyyy') : 'Unknown date'}
            </p>
          </div>
        </div>
      </Card>

      {/* Published Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Published Notes</h3>
        {publishedNotes.length > 0 ? (
          <div className="h-[500px] overflow-auto">
            <div className="grid gap-4">
              {publishedNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">No published notes yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
