/**
 * Note Loading Component - Displays a loading state for the note detail page
 */

'use client';

import * as React from 'react';

interface NoteLoadingProps {
  className?: string;
}

export const NoteLoading: React.FC<NoteLoadingProps> = ({ className = '' }) => {
  return (
    <div className={`flex-grow flex items-center justify-center ${className}`}>
      <div className="animate-pulse text-ghost-purple">Loading...</div>
    </div>
  );
};

export default NoteLoading;
