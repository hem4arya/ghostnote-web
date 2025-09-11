'use client';

import React from 'react';

interface FloatingWordCountProps {
  wordCount: number;
  charCount: number;
  className?: string;
}

/**
 * FloatingWordCount Component
 * 
 * A floating widget that displays word and character count in the bottom-left corner
 * with a glassmorphic effect.
 */
const FloatingWordCount: React.FC<FloatingWordCountProps> = ({
  wordCount,
  charCount,
  className = '',
}) => {
  return (
    <div
      className={`
        fixed bottom-4 left-4 z-30
        px-3 py-2 rounded-lg
        bg-ghost-dark/40 backdrop-blur-[12px]
        border border-ghost-gray/30
        shadow-lg
        text-xs text-gray-300
        transition-all duration-300
        hover:bg-ghost-dark/60 hover:border-ghost-gray/50
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="text-ghost-purple">W:</span>
          <span className="font-mono">{wordCount}</span>
        </span>
        <span className="w-px h-3 bg-ghost-gray/40" />
        <span className="flex items-center gap-1">
          <span className="text-ghost-cyan">C:</span>
          <span className="font-mono">{charCount}</span>
        </span>
      </div>
    </div>
  );
};

export default FloatingWordCount;