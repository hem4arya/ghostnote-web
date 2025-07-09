import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, HelpCircle } from 'lucide-react';

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
  showToolbarMenu: boolean;
  isMobile: boolean;
  selectedImage: HTMLImageElement | null;
  onHelpClick: () => void;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  activeFormats,
  executeCommand,
  showToolbarMenu,
  isMobile,
  selectedImage,
  onHelpClick
}) => {
  return (
    <div className={`flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-3 overflow-x-auto hide-scrollbar ${showToolbarMenu || !isMobile ? 'flex' : 'hidden sm:flex'}`}>
      {/* Text Formatting */}
      <div className="flex items-center gap-0.5">
        <button 
          onClick={() => executeCommand("bold")} 
          className={`p-1 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.bold ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.bold}
        >
          <Bold className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
        <button 
          onClick={() => executeCommand("italic")} 
          className={`p-1 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.italic ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.italic}
        >
          <Italic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
        <button 
          onClick={() => executeCommand("underline")} 
          className={`p-1 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.underline ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.underline}
        >
          <Underline className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
      <div className="h-4 sm:h-5 w-px bg-ghost-gray/50" />
      
      {/* Alignment */}
      <div className="flex items-center gap-0.5">
        <button 
          onClick={() => executeCommand("justifyLeft")} 
          className={`p-1 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.justifyLeft ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.justifyLeft}
        >
          <AlignLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
        <button 
          onClick={() => executeCommand("justifyCenter")} 
          className={`p-1 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.justifyCenter ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.justifyCenter}
        >
          <AlignCenter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
        <button 
          onClick={() => executeCommand("justifyRight")} 
          className={`p-1 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.justifyRight ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.justifyRight}
        >
          <AlignRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
      <div className="h-4 sm:h-5 w-px bg-ghost-gray/50" />
      
      {/* Lists */}
      <div className="flex items-center gap-0.5">
        <button 
          onClick={() => executeCommand("insertUnorderedList")} 
          className={`p-1 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.insertUnorderedList ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.insertUnorderedList}
        >
          <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
        <button 
          onClick={() => executeCommand("insertOrderedList")} 
          className={`p-1 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.insertOrderedList ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          aria-pressed={activeFormats.insertOrderedList}
        >
          <ListOrdered className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
      <div className="h-4 sm:h-5 w-px bg-ghost-gray/50" />
      
      {/* Help Button - Only show when no image is selected */}
      {!selectedImage && (
        <div className="flex items-center gap-0.5">
          <button 
            onClick={onHelpClick}
            className="p-1 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 focus:outline-none text-gray-300"
            aria-label="Toggle resize help"
          >
            <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
