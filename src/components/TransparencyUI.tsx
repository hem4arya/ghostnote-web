import React from 'react';
import { CloneTransparencyWrapper as TransparencyWrapper } from '@/features/transparency';

interface TransparencyUIProps {
  noteId: string;
  userId?: string;
  className?: string;
  showDetailedInfo?: boolean;
}

/**
 * Simple UI wrapper for transparency features
 * This component stays in the root for easy access across the app
 * while the full feature logic is in src/features/transparency/
 */
export function TransparencyUI({
  noteId,
  userId,
  className = '',
  showDetailedInfo = false
}: TransparencyUIProps) {
  return (
    <TransparencyWrapper
      noteId={noteId}
      userId={userId}
      className={className}
      showDetailedInfo={showDetailedInfo}
    />
  );
}

export default TransparencyUI;
