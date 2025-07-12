import { TransparencyData } from '../types';

/**
 * Determines if transparency information should be shown prominently
 * @param transparencyData - The transparency data to evaluate
 * @returns boolean indicating if transparency warning should be prominent
 */
export function shouldShowProminentTransparency(transparencyData: TransparencyData): boolean {
  if (!transparencyData.is_clone) return false;
  
  // Show prominent transparency for high similarity scores
  return transparencyData.similarity_score ? transparencyData.similarity_score >= 70 : false;
}

/**
 * Gets user-friendly text for originality level
 * @param level - The originality level
 * @returns User-friendly description
 */
export function getOriginalityDescription(level: string): string {
  switch (level) {
    case 'Original':
      return 'This content was created from scratch by the author.';
    case 'Modified':
      return 'This content significantly builds upon and modifies existing material.';
    case 'Heavily Inspired':
      return 'This content draws heavily from existing sources with some modifications.';
    case 'Clone':
      return 'This content is very similar to existing material with minimal changes.';
    default:
      return 'Content originality assessment not available.';
  }
}

/**
 * Generates appropriate purchase warning text
 * @param transparencyData - The transparency data
 * @returns Warning text for buyers
 */
export function getPurchaseWarning(transparencyData: TransparencyData): string | null {
  if (!transparencyData.is_clone) return null;
  
  const similarity = transparencyData.similarity_score || 0;
  
  if (similarity >= 90) {
    return 'This content is nearly identical to existing material. Consider if this offers sufficient value for your needs.';
  }
  
  if (similarity >= 70) {
    return 'This content is heavily based on existing material. Review the modifications before purchasing.';
  }
  
  if (similarity >= 50) {
    return 'This content builds upon existing material with notable modifications.';
  }
  
  return null;
}

/**
 * Formats the transparency data for display in note cards
 * @param transparencyData - The transparency data
 * @returns Formatted display data
 */
export function formatTransparencyForCard(transparencyData: TransparencyData) {
  return {
    showBadge: transparencyData.is_clone || transparencyData.originality_score === 100,
    badgeText: transparencyData.transparency_badge.text,
    badgeVariant: transparencyData.transparency_badge.severity,
    originalityScore: transparencyData.originality_score,
    shouldWarn: shouldShowProminentTransparency(transparencyData),
    warningText: getPurchaseWarning(transparencyData),
  };
}
