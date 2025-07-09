import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from 'lucide-react';

interface FormattingToolbarProps {
  activeFormats: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    justifyLeft: boolean;
    justifyCenter: boolean;
    justifyRight: boolean;
    insertUnorderedList: boolean;
    insertOrderedList: boolean;
  };
  executeCommand: (command: string, value?: string) => void;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  activeFormats,
  executeCommand
}) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <button 
          onClick={() => executeCommand("bold")} 
          className={`p-2 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.bold ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.bold}
        >
          <Bold className="h-4 w-4 sm:h-4 sm:w-4" />
        </button>
        <button 
          onClick={() => executeCommand("italic")} 
          className={`p-2 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.italic ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.italic}
        >
          <Italic className="h-4 w-4 sm:h-4 sm:w-4" />
        </button>
        <button 
          onClick={() => executeCommand("underline")} 
          className={`p-2 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.underline ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.underline}
        >
          <Underline className="h-4 w-4 sm:h-4 sm:w-4" />
        </button>
      </div>
      <div className="h-5 sm:h-5 w-px bg-ghost-gray/50" />
      
      {/* Alignment */}
      <div className="flex items-center gap-1">
        <button 
          onClick={() => executeCommand("justifyLeft")} 
          className={`p-2 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.justifyLeft ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.justifyLeft}
        >
          <AlignLeft className="h-4 w-4 sm:h-4 sm:w-4" />
        </button>
        <button 
          onClick={() => executeCommand("justifyCenter")} 
          className={`p-2 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.justifyCenter ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.justifyCenter}
        >
          <AlignCenter className="h-4 w-4 sm:h-4 sm:w-4" />
        </button>
        <button 
          onClick={() => executeCommand("justifyRight")} 
          className={`p-2 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.justifyRight ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.justifyRight}
        >
          <AlignRight className="h-4 w-4 sm:h-4 sm:w-4" />
        </button>
      </div>
      <div className="h-5 sm:h-5 w-px bg-ghost-gray/50" />
      
      {/* Lists */}
      <div className="flex items-center gap-1">
        <button 
          onClick={() => executeCommand("insertUnorderedList")} 
          className={`p-2 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.insertUnorderedList ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.insertUnorderedList}
        >
          <List className="h-4 w-4 sm:h-4 sm:w-4" />
        </button>
        <button 
          onClick={() => executeCommand("insertOrderedList")} 
          className={`p-2 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.insertOrderedList ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.insertOrderedList}
        >
          <ListOrdered className="h-4 w-4 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
};
