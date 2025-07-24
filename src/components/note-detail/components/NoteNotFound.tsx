/**
 * Note Not Found Component - Displays a message when a note is not found
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/shared/ui/components/button';

interface NoteNotFoundProps {
  className?: string;
}

export const NoteNotFound: React.FC<NoteNotFoundProps> = ({ className = '' }) => {
  return (
    <div className={`flex-grow flex items-center justify-center ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-ghost-purple mb-4">Note Not Found</h2>
        <p className="text-muted-foreground mb-6">The note you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NoteNotFound;
