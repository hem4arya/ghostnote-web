import React from 'react';
import { ArrowLeft, Save, FileText, Eye } from 'lucide-react';

interface EditorHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  lastSaved: Date | null;
  wordCount: number;
  charCount: number;
  showToolbarMenu: boolean;
  setShowToolbarMenu: (show: boolean) => void;
  isMobile: boolean;
  focusMode: boolean;
  onBackClick: () => void;
  children?: React.ReactNode;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  setTitle,
  lastSaved,
  wordCount,
  charCount,
  showToolbarMenu,
  setShowToolbarMenu,
  isMobile,
  focusMode,
  onBackClick,
  children
}) => {
  return (
    <div className={`border-b border-ghost-gray/50 bg-ghost-dark/80 backdrop-blur-sm sticky top-0 z-40 transition-opacity duration-300 ${focusMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
      <div className="flex items-center justify-between p-2 sm:p-3 max-w-7xl mx-auto">
        <div className="w-12 sm:w-20">
          <button 
            onClick={onBackClick}
            className="p-1 sm:p-1.5 rounded-md text-gray-300 hover:bg-ghost-purple/20 hover:text-ghost-neon flex items-center focus:outline-none"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
        
        <div className="flex-1 flex justify-center">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="text-sm sm:text-lg font-medium bg-transparent border-none shadow-none focus:ring-0 focus:outline-none p-0 h-auto text-white placeholder-gray-400 text-center w-full"
          />
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 justify-end">
          {lastSaved && (
            <div className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
              <div className="h-1.5 w-1.5 bg-ghost-neon rounded-full animate-pulse" />
              <span className="hidden sm:inline">Saved</span> {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          )}
          <button className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-black bg-gradient-to-r from-ghost-cyan to-ghost-neon rounded-md hover:from-ghost-neon hover:to-ghost-cyan transition-colors flex items-center gap-1 sm:gap-1.5 focus:outline-none">
            <Save className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Sell</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-t border-ghost-gray/50 px-2 sm:px-4 py-1 relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-400 max-w-7xl mx-auto">
          {/* Mobile toolbar toggle */}
          <div className="flex items-center justify-between sm:hidden mb-1">
            <button 
              onClick={() => setShowToolbarMenu(!showToolbarMenu)}
              className="text-xs text-ghost-neon flex items-center gap-1 py-1"
            >
              <span>{showToolbarMenu ? "Hide formatting" : "Show formatting"}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`h-3 w-3 transition-transform duration-200 ${showToolbarMenu ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {/* Mobile word count */}
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <span>{wordCount} words</span>
              <div className="h-2 w-px bg-ghost-gray/50" />
              <span>{charCount} chars</span>
            </div>
          </div>

          {/* Toolbar content */}
          {children}
          
          {/* Word & Character Count - Desktop only */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              <span>{wordCount} words</span>
            </div>
            <div className="h-3 w-px bg-ghost-gray/50" />
            <div className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              <span>{charCount} characters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
