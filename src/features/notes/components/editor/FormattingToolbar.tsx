import React from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';

interface FormattingToolbarProps {
  onFormat?: (format: string) => void;
  activeFormats?: string[];
  executeCommand?: (command: string, value?: string) => void;
}

export default function FormattingToolbar({ onFormat, activeFormats = [], executeCommand }: FormattingToolbarProps) {
  const handleFormat = (format: string) => {
    onFormat?.(format);
    executeCommand?.(format);
  };

  return (
    <div className="flex gap-1 p-2 border-b">
      <Button
        variant={activeFormats.includes('bold') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleFormat('bold')}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={activeFormats.includes('italic') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleFormat('italic')}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={activeFormats.includes('underline') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleFormat('underline')}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <div className="w-px bg-border mx-1" />
      <Button
        variant={activeFormats.includes('ul') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleFormat('ul')}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={activeFormats.includes('ol') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleFormat('ol')}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );
}
