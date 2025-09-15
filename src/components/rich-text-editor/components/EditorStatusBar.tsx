'use client';

import React, { useEffect, useState } from 'react';
import type { Editor as TipTapEditor } from '@tiptap/react';

interface EditorStatusBarProps {
  editor: TipTapEditor;
}

const EditorStatusBar: React.FC<EditorStatusBarProps> = ({ editor }) => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [saveStatus, setSaveStatus] = useState('Saved');

  useEffect(() => {
    const updateStats = (): void => {
      const text = editor.getText();
      const words = text.split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      setCharCount(text.length);
      setReadingTime(Math.ceil(words / 200));
    };

    updateStats(); // Initial stats
    editor.on('update', updateStats);
    return (): void => {
      editor.off('update', updateStats);
    };
  }, [editor]);

  useEffect(() => {
    // Simulate network check and save status
    const interval = setInterval(() => {
      setSaveStatus(navigator.onLine ? 'Saved' : 'Offline');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between p-2 border-t border-gray-300 text-sm text-gray-500">
      <div>Words: {wordCount} | Characters: {charCount} | Reading time: {readingTime} min</div>
      <div>{saveStatus}</div>
    </div>
  );
};

export default EditorStatusBar;