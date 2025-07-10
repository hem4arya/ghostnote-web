import React from 'react';
import { CloneTransparencyBadge } from './CloneTransparencyBadge';
import { useTransparencyData } from '@/utils/transparency';
import { Loader2 } from 'lucide-react';

interface CloneTransparencyWrapperProps {
  noteId: string;
  userId?: string;
  className?: string;
  showDetailedInfo?: boolean;
}

/**
 * Wrapper component that fetches transparency data and displays the badge
 */
export function CloneTransparencyWrapper({
  noteId,
  userId,
  className = '',
  showDetailedInfo = false
}: CloneTransparencyWrapperProps) {
  const { data, loading, error } = useTransparencyData(parseInt(noteId), userId);

  // Don't render anything while loading
  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-sm text-gray-400 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Checking content transparency...</span>
      </div>
    );
  }

  // Don't render anything if there's an error or no data
  if (error || !data) {
    return null;
  }

  // Only render the badge if the note is actually a clone
  // For original content, we don't need to show anything
  if (!data.is_clone) {
    return null;
  }

  return (
    <CloneTransparencyBadge
      is_clone={data.is_clone}
      originality_score={data.originality_score}
      originality_level={data.originality_level}
      similarity_score={data.similarity_score}
      original_note={data.original_note}
      transparency_badge={data.transparency_badge}
      buyer_message={data.buyer_message}
      className={className}
      showDetailedInfo={showDetailedInfo}
    />
  );
}
