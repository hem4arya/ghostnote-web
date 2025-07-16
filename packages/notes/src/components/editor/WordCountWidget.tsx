import React from 'react';
import { FileText } from 'lucide-react';

// React 19 compatibility wrappers
const FileTextIcon = FileText as React.ElementType;

// React 19 compatibility wrapper

interface WordCountWidgetProps {
  wordCount?: number;
  characterCount?: number;
  readingTime?: number;
}

export default function WordCountWidget({ 
  wordCount = 0, 
  characterCount = 0, 
  readingTime = 0 
}: WordCountWidgetProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground p-3 border rounded-lg">
      <div className="flex items-center gap-1">
        <FileTextIcon className="h-4 w-4" />
        <span>Stats</span>
      </div>
      <div className="flex gap-4">
        <span>{wordCount} words</span>
        <span>{characterCount} chars</span>
        <span>~{readingTime} min read</span>
      </div>
    </div>
  );
}
