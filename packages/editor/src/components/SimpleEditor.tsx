"use client";

import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

// Simple toolbar component
function SimpleToolbar() {
  return (
    <div className="flex items-center gap-2 p-3 bg-ghost-dark/90 border-b border-ghost-purple/20 rounded-t-lg">
      <Button
        variant="outline"
        size="sm"
        className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
          />
        </svg>
      </Button>

      <Separator orientation="vertical" className="h-6 bg-ghost-purple/30" />

      <Button
        variant="outline"
        size="sm"
        className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"
          />
        </svg>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      </Button>
    </div>
  );
}

// Simple content area
function SimpleContent({
  placeholder,
  onWordCountChange,
}: {
  placeholder: string;
  onWordCountChange?: (wordCount: number, charCount: number) => void;
}) {
  const [content, setContent] = useState("");

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);

    // Calculate word and character count
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    // Call the callback if provided
    if (onWordCountChange) {
      onWordCountChange(words, chars);
    }
  };

  return (
    <div className="relative">
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder={placeholder}
        className="w-full min-h-[70vh] p-6 bg-ghost-dark/80 border-0 focus:outline-none focus:ring-0 text-white prose-editor overflow-hidden text-base leading-relaxed resize-none"
        style={{
          fontFamily: "inherit",
          lineHeight: "1.6",
        }}
      />
      {!content && (
        <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
}

// Main editor component
interface SimpleEditorProps {
  placeholder?: string;
  showToolbar?: boolean;
  showWordCount?: boolean;
  onWordCountChange?: (wordCount: number, charCount: number) => void;
}

export default function SimpleEditor({
  placeholder = "Start writing your note...",
  showToolbar = true,
  showWordCount = true,
  onWordCountChange,
}: SimpleEditorProps) {
  return (
    <Card className="border-ghost-purple/20 bg-ghost-dark/95 shadow-2xl">
      <CardContent className="p-0">
        {showToolbar && <SimpleToolbar />}
        <SimpleContent
          placeholder={placeholder}
          onWordCountChange={onWordCountChange}
        />
        {showWordCount && (
          <div className="flex items-center justify-between p-4 border-t border-ghost-purple/20 bg-ghost-dark/90">
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="border-ghost-purple/30 text-gray-300"
              >
                0 words
              </Badge>
              <Badge
                variant="outline"
                className="border-ghost-purple/30 text-gray-300"
              >
                0 characters
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
