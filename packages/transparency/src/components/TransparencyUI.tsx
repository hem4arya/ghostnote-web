import React from 'react';
import { useTransparencyData, formatTransparencyForCard } from './transparency';

interface TransparencyUIProps {
  noteId: string;
  userId?: string;
  className?: string;
  showDetailedInfo?: boolean;
}

/**
 * Simple UI wrapper for transparency features
 */
export function TransparencyUI({
  noteId,
  userId,
  className = '',
  showDetailedInfo = false
}: TransparencyUIProps) {
  const { data, loading, error } = useTransparencyData(Number(noteId), userId);

  if (loading) return <div className={`transparency-loading ${className}`}>Loading transparency info...</div>;
  if (error) return <div className={`transparency-error ${className}`}>Error loading transparency info</div>;
  if (!data) return null;

  const displayData = formatTransparencyForCard(data);

  return (
    <div className={`transparency-ui ${className}`}>
      {displayData.showBadge && (
        <div className={`transparency-badge ${displayData.badgeVariant}`}>
          {displayData.badgeText}
        </div>
      )}
      {showDetailedInfo && displayData.shouldWarn && displayData.warningText && (
        <div className="transparency-warning">
          {displayData.warningText}
        </div>
      )}
    </div>
  );
}

export default TransparencyUI;
