"use client";

import React from "react";
import { WordCountWidgetProps } from "../types";

const WordCountWidget: React.FC<WordCountWidgetProps> = ({
  wordCount,
  charCount,
  characterCount,
  readingTime,
  target,
}) => {
  const displayCharCount = charCount || characterCount || 0;
  const estimatedReadingTime = readingTime || Math.ceil(wordCount / 200);

  return (
    <div className="flex items-center space-x-4 p-2 text-sm text-gray-600 bg-gray-50 border-t">
      <span>{wordCount} words</span>
      <span>{displayCharCount} characters</span>
      <span>{estimatedReadingTime} min read</span>
      {target && (
        <span
          className={wordCount >= target ? "text-green-600" : "text-orange-600"}
        >
          Target: {target} ({((wordCount / target) * 100).toFixed(0)}%)
        </span>
      )}
    </div>
  );
};

export default WordCountWidget;
