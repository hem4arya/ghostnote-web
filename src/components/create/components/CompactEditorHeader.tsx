'use client';

import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { EditorToolbar, EditorFeatures } from '@/components/rich-text-editor';

interface CompactEditorHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  wordHandle?: string;
  setWordHandle?: (wordHandle: string) => void;
  lastSaved: Date | null;
  onBackClick: () => void;
  onSave?: () => void;
  editor: Editor | null;
  features: Partial<EditorFeatures>;
}

/**
 * CompactEditorHeader Component
 * 
 * A unified, compact header that combines title inputs, save button, and toolbar
 * in a single slim bar to maximize writing space.
 */
const CompactEditorHeader: React.FC<CompactEditorHeaderProps> = ({
  title,
  setTitle,
  wordHandle,
  setWordHandle,
  lastSaved,
  onBackClick,
  onSave,
  editor,
  features,
}) => {
  return (
    <div className="sticky top-0 z-40 bg-ghost-dark/95 backdrop-blur-sm">
      {/* Main Header Row */}
      <div className="flex items-center justify-between px-3 py-2 max-w-7xl mx-auto">
        {/* Left: Back Button */}
        <button 
          onClick={onBackClick}
          className="p-1.5 rounded-md text-gray-300 hover:bg-ghost-purple/20 hover:text-ghost-neon flex items-center focus:outline-none transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        
        {/* Center: Title and Word Handle */}
        <div className="flex-1 flex items-center justify-center gap-3 max-w-md mx-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="text-sm font-medium bg-transparent border-none shadow-none focus:ring-0 focus:outline-none p-1 h-auto text-white placeholder-gray-400 text-center flex-1 min-w-0"
          />
          {setWordHandle && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-500">@</span>
              <input
                value={wordHandle || ''}
                onChange={(e) => setWordHandle(e.target.value)}
                placeholder="word-handle"
                className="text-xs bg-transparent border border-gray-600 rounded px-1.5 py-0.5 focus:ring-0 focus:outline-none focus:border-ghost-neon text-white placeholder-gray-500 text-center w-20"
                maxLength={20}
              />
            </div>
          )}
        </div>
        
        {/* Right: Save Info and Button */}
        <div className="flex items-center gap-2">
          {lastSaved && (
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <div className="h-1 w-1 bg-ghost-neon rounded-full animate-pulse" />
              <span className="hidden sm:inline">Saved</span>
              <span>{lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          )}
          <button 
            onClick={onSave}
            className="px-2.5 py-1.5 text-xs font-semibold text-black bg-gradient-to-r from-ghost-cyan to-ghost-neon rounded-md hover:from-ghost-neon hover:to-ghost-cyan transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            <Save className="h-3 w-3" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Toolbar Row */}
      <div className="px-3 py-1.5">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-ghost-gray/30 scrollbar-track-transparent">
            {editor && (
              <EditorToolbar
                editor={editor}
                features={features}
                className="compact-toolbar"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactEditorHeader;