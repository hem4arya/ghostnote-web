"use client";

import { ArrowLeft, Eye, Save } from "lucide-react";
import React from "react";
import { Button } from "../../../ui-components/src/components/button";
import { EditorHeaderProps } from "../types";

// React 19 compatibility wrappers
const ArrowLeftIcon = ArrowLeft as React.ElementType;
const EyeIcon = Eye as React.ElementType;
const SaveIcon = Save as React.ElementType;

const EditorHeader: React.FC<EditorHeaderProps> = ({
  title = "",
  onTitleChange,
  setTitle,
  onSave,
  onPublish,
  onBackClick,
  isSaving = false,
  isPublishing = false,
  isDirty = false,
  lastSaved,
  children,
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (onTitleChange) onTitleChange(newTitle);
    if (setTitle) setTitle(newTitle);
  };

  const formatLastSaved = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-4">
        {onBackClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackClick}
            className="p-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        )}

        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter note title..."
          className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-0 placeholder-gray-400"
        />
      </div>

      <div className="flex items-center space-x-4">
        {lastSaved && (
          <span className="text-sm text-gray-500">
            Last saved {formatLastSaved(lastSaved)}
          </span>
        )}

        {children as React.ReactNode}

        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="flex items-center space-x-2"
        >
          <SaveIcon className="h-4 w-4" />
          <span>{isSaving ? "Saving..." : "Save"}</span>
        </Button>

        <Button
          size="sm"
          onClick={onPublish}
          disabled={isPublishing}
          className="flex items-center space-x-2"
        >
          <EyeIcon className="h-4 w-4" />
          <span>{isPublishing ? "Publishing..." : "Publish"}</span>
        </Button>
      </div>
    </div>
  );
};

export default EditorHeader;
