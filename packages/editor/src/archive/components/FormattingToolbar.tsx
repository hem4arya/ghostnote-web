import React from 'react';
import { Button } from 'packages/ui-components/src/components/button';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import type { FormattingToolbarProps } from '../types';

export default function FormattingToolbar({ activeFormats = [], executeCommand }: FormattingToolbarProps) {
  const handleFormat = (format: string) => {
    executeCommand(format);
  };

  const formatButtons = [
    { command: 'bold', icon: Bold, label: 'Bold' },
    { command: 'italic', icon: Italic, label: 'Italic' },
    { command: 'underline', icon: Underline, label: 'Underline' },
  ];

  const listButtons = [
    { command: 'insertUnorderedList', icon: List, label: 'Bullet List' },
    { command: 'insertOrderedList', icon: ListOrdered, label: 'Numbered List' },
  ];

  const alignButtons = [
    { command: 'justifyLeft', icon: AlignLeft, label: 'Align Left' },
    { command: 'justifyCenter', icon: AlignCenter, label: 'Align Center' },
    { command: 'justifyRight', icon: AlignRight, label: 'Align Right' },
  ];

  return (
    <div className="flex gap-1 p-3 border-b border-ghost-purple/10 bg-ghost-dark/50">
      {/* Text Formatting */}
      <div className="flex gap-1">
        {formatButtons.map(({ command, icon: Icon, label }) => (
          <Button
            key={command}
            variant={activeFormats.includes(command) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleFormat(command)}
            className={
              activeFormats.includes(command)
                ? 'bg-ghost-purple/30 text-white border-ghost-purple/50'
                : 'text-gray-300 hover:bg-ghost-purple/20 hover:text-white'
            }
            title={label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <div className="w-px bg-ghost-purple/20 mx-2" />

      {/* Lists */}
      <div className="flex gap-1">
        {listButtons.map(({ command, icon: Icon, label }) => (
          <Button
            key={command}
            variant={activeFormats.includes(command) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleFormat(command)}
            className={
              activeFormats.includes(command)
                ? 'bg-ghost-purple/30 text-white border-ghost-purple/50'
                : 'text-gray-300 hover:bg-ghost-purple/20 hover:text-white'
            }
            title={label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <div className="w-px bg-ghost-purple/20 mx-2" />

      {/* Alignment */}
      <div className="flex gap-1">
        {alignButtons.map(({ command, icon: Icon, label }) => (
          <Button
            key={command}
            variant={activeFormats.includes(command) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleFormat(command)}
            className={
              activeFormats.includes(command)
                ? 'bg-ghost-purple/30 text-white border-ghost-purple/50'
                : 'text-gray-300 hover:bg-ghost-purple/20 hover:text-white'
            }
            title={label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  );
}
