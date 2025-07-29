import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';

interface EditorHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  lastSaved: Date | null;
  focusMode: boolean;
  onBackClick: () => void;
  onSave?: () => void;
  children?: React.ReactNode;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  setTitle,
  lastSaved,
  focusMode,
  onBackClick,
  onSave,
  children
}) => {
  return (
    <div className={`border-b border-ghost-gray/50 bg-ghost-dark/80 backdrop-blur-sm sticky top-0 z-40 transition-opacity duration-300 ${focusMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
      <div className="flex items-center justify-between p-3 sm:p-3 max-w-7xl mx-auto">
        <div className="w-14 sm:w-20">
          <button 
            onClick={onBackClick}
            className="p-2 sm:p-1.5 rounded-md text-gray-300 hover:bg-ghost-purple/20 hover:text-ghost-neon flex items-center focus:outline-none"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 sm:h-5 sm:w-5" />
          </button>
        </div>
        
        <div className="flex-1 flex justify-center">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="text-base sm:text-lg font-medium bg-transparent border-none shadow-none focus:ring-0 focus:outline-none p-0 h-auto text-white placeholder-gray-400 text-center w-full"
          />
        </div>
        
        <div className="flex items-center gap-2 sm:gap-2 justify-end">
          {lastSaved && (
            <div className="text-xs sm:text-xs text-gray-400 flex items-center gap-1">
              <div className="h-1.5 w-1.5 bg-ghost-neon rounded-full animate-pulse" />
              <span className="hidden sm:inline">Saved</span> {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          )}
          <button 
            onClick={onSave}
            className="px-3 sm:px-3 py-2 sm:py-1.5 text-sm sm:text-sm font-semibold text-black bg-gradient-to-r from-ghost-cyan to-ghost-neon rounded-md hover:from-ghost-neon hover:to-ghost-cyan transition-colors flex items-center gap-2 sm:gap-1.5 focus:outline-none"
          >
            <Save className="h-4 w-4 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Save</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-t border-ghost-gray/50 px-2 sm:px-4 py-2 relative">
        <div className="flex items-center text-gray-400 max-w-7xl mx-auto">
          {/* Always visible scrollable toolbar */}
          <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-ghost-gray/30 scrollbar-track-transparent">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
