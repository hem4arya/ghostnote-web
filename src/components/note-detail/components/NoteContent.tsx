/**
 * Note Content Component - Displays the main note content
 */

'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';
import type { Note } from '@/components/note-card';

interface NoteContentProps {
  note: Note;
  isPurchased: boolean;
  whyBuyText: string;
  className?: string;
}

export const NoteContent: React.FC<NoteContentProps> = ({
  note,
  isPurchased,
  whyBuyText,
  className = '',
}) => {
  return (
    <div className={`lg:col-span-2 ${className}`}>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">{note.title}</h1>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-muted-foreground">
        <span>by <span className="text-ghost-purple font-medium">{note.author}</span></span>
        <span className="text-sm">Published on July 8, 2025</span>
      </div>

      <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground prose-strong:text-ghost-neon">
        <p className="text-lg leading-relaxed">{note.previewText}</p>
        
        {!isPurchased && (
          <div className="mt-8 p-6 rounded-lg bg-ghost-dark/30 border border-ghost-purple/20 shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center">
              <Sparkles className="h-6 w-6 mr-3 text-ghost-neon" />
              Why Buy This Note?
            </h2>
            <p className="text-muted-foreground leading-relaxed">{whyBuyText}</p>
          </div>
        )}

        {isPurchased && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-ghost-purple/20 pb-2">Full Note Content</h2>
            <p>
              This is the full content that is revealed after purchase.
              <br/><br/>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
              <br /><br />
              Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
              <br /><br />
              Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteContent;
