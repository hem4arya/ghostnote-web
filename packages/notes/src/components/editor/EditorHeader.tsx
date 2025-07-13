import React from 'react';
import { Button } from 'packages/ui-components/src/components/button';

interface EditorHeaderProps {
  title?: string;
  setTitle?: (title: string) => void;
  lastSaved?: Date | null;
  onSave?: () => void;
  onPreview?: () => void;
  isPreview?: boolean;
  onBackClick?: () => void;
  children?: React.ReactNode;
  focusMode?: boolean;
}

export default function EditorHeader({ 
  title = "Note Editor",
  setTitle,
  lastSaved,
  onSave, 
  onPreview, 
  isPreview = false,
  onBackClick,
  children,
  focusMode = false
}: EditorHeaderProps) {
  return (
    <div className={`border-b ${focusMode ? 'bg-muted/20' : ''}`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          {onBackClick && (
            <Button variant="outline" size="sm" onClick={onBackClick}>
              ← Back
            </Button>
          )}
          {setTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold bg-transparent border-none outline-none"
              placeholder="Note title..."
            />
          ) : (
            <h1 className="text-xl font-semibold">{title}</h1>
          )}
        </div>
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-sm text-muted-foreground">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <div className="flex gap-2">
            {onPreview && (
              <Button 
                variant="outline" 
                onClick={onPreview}
              >
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
            )}
            {onSave && (
              <Button onClick={onSave}>
                Save
              </Button>
            )}
          </div>
        </div>
      </div>
      {children && (
        <div className="border-t">
          {children}
        </div>
      )}
    </div>
  );
}
