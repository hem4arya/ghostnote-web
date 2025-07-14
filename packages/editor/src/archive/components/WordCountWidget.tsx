import React from 'react';
import { FileText, Clock, Type } from 'lucide-react';
import type { WordCountWidgetProps } from '../../types';

// React 19 compatibility wrappers
const FileTextIcon = FileText as React.ElementType;
const ClockIcon = Clock as React.ElementType;
const TypeIcon = Type as React.ElementType;

export default function WordCountWidget({ 
  wordCount = 0, 
  characterCount = 0
}: WordCountWidgetProps) {
  const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="flex items-center gap-4 text-sm text-gray-300 bg-ghost-dark/90 backdrop-blur-sm border border-ghost-purple/30 rounded-lg px-4 py-2">
        <div className="flex items-center gap-1">
          <FileTextIcon className="h-4 w-4 text-ghost-purple" />
          <span className="text-gray-400">Stats</span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <TypeIcon className="h-3 w-3" />
            <span>{wordCount.toLocaleString()} words</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{characterCount.toLocaleString()} chars</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            <span>~{readingTime} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
}
