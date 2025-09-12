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
 * A unified, compact header with back button, toolbar, and save button in a single slim row.
 */
const CompactEditorHeader: React.FC<CompactEditorHeaderProps> = ({
  lastSaved,
  onBackClick,
  onSave,
  editor,
  features,
}) => {
  return (
    <div className="sticky top-0 z-40 bg-ghost-dark/95 backdrop-blur-sm">
      {/* Single Row: Back Button, Toolbar, Save Info/Button */}
      <div className="flex items-center justify-between px-3 py-1 max-w-7xl mx-auto">
        {/* Left: Back Button */}
        <button 
          onClick={onBackClick}
          className="p-1.5 rounded-md text-gray-300 hover:bg-ghost-purple/20 hover:text-ghost-neon flex items-center focus:outline-none transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        
        {/* Center: Toolbar */}
        <div className="flex-1 mx-4 overflow-x-auto scrollbar-thin scrollbar-thumb-ghost-gray/30 scrollbar-track-transparent">
          {editor && (
            <EditorToolbar
              editor={editor}
              features={features}
              className="compact-toolbar"
            />
          )}
        </div>

        {/* Right: Save Info and Button */}
        <div className="flex items-center gap-2">
          {lastSaved && (
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <div className="h-1 w-1 bg-ghost-neon rounded-full animate-pulse" />
              <span className="hidden sm:inline">Saved</span>
              <span>{lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
    </div>
  );
};

export default CompactEditorHeader;