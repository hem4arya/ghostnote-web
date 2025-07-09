import React from 'react';
import { FileText, Eye } from 'lucide-react';

interface WordCountWidgetProps {
  wordCount: number;
  charCount: number;
}

export const WordCountWidget: React.FC<WordCountWidgetProps> = ({
  wordCount,
  charCount
}) => {
  return (
    <div className="fixed bottom-6 left-6 z-50 bg-ghost-dark/90 backdrop-blur-sm border border-ghost-gray/30 rounded-lg px-3 py-2 shadow-lg shadow-ghost-purple/20">
      <div className="flex items-center gap-3 text-xs text-gray-300">
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-ghost-neon" />
          <span className="font-medium">{wordCount}</span>
          <span className="text-ghost-gray text-[10px]">words</span>
        </div>
        <div className="h-3 w-px bg-ghost-gray/40" />
        <div className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5 text-ghost-cyan" />
          <span className="font-medium">{charCount}</span>
          <span className="text-ghost-gray text-[10px]">chars</span>
        </div>
      </div>
    </div>
  );
};
