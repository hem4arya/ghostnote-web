import React, { useState, useEffect } from 'react';
import { CloneTransparencyBadge } from './CloneTransparencyBadge';
import { TransparencyData } from '../types';
import { getMockTransparencyData, mockApiDelay } from '../utils/mockData';
import { Loader2 } from 'lucide-react';

interface CloneTransparencyWrapperDevProps {
  noteId: string;
  userId?: string;
  className?: string;
  showDetailedInfo?: boolean;
}

/**
 * Development version of the transparency wrapper that uses mock data
 * This allows testing the UI without a backend connection
 */
export function CloneTransparencyWrapperDev({
  noteId,
  userId,
  className = '',
  showDetailedInfo = false
}: CloneTransparencyWrapperDevProps) {
  const [data, setData] = useState<TransparencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMockData() {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        await mockApiDelay(300);
        
        const transparencyData = getMockTransparencyData(noteId);
        setData(transparencyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load transparency data');
      } finally {
        setLoading(false);
      }
    }

    if (noteId) {
      loadMockData();
    }
  }, [noteId, userId]);

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
