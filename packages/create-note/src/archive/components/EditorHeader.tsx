import React from 'react';
import { Button } from 'packages/ui-components/components/button';
import type { EditorHeaderProps } from '../types';

export default function EditorHeader({ 
  title,
  setTitle,
  lastSaved,
  onBackClick,
  isSaving = false,
  isDirty = false,
  onSave,
  onPublish,
  children
}: EditorHeaderProps) {
  return (
    <div className="border-b border-ghost-purple/20 bg-ghost-dark/90 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          {onBackClick && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBackClick}
              className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
            >
              ← Back
            </Button>
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold bg-transparent border-none outline-none text-white placeholder-gray-400 min-w-[200px]"
            placeholder="Untitled Note..."
          />
        </div>
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-sm text-gray-400">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {isDirty && !isSaving && (
            <span className="text-sm text-amber-400">
              Unsaved changes
            </span>
          )}
          {isSaving && (
            <span className="text-sm text-blue-400">
              Saving...
            </span>
          )}
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={onSave}
              disabled={isSaving}
              className="bg-ghost-purple/20 border-ghost-purple/50 text-white hover:bg-ghost-purple/30 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button 
              onClick={onPublish}
              disabled={isSaving}
              className="bg-gradient-to-r from-ghost-purple to-ghost-neon text-white disabled:opacity-50"
            >
              Publish
            </Button>
          </div>
        </div>
      </div>
      {children && (
        <div className="border-t border-ghost-purple/10">
          {children}
        </div>
      )}
    </div>
  );
}
