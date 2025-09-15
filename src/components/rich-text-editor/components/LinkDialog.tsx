'use client';

import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';

interface LinkDialogProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * LinkDialog Component
 * 
 * A modal dialog for adding, editing, and removing hyperlinks in the editor.
 */
const LinkDialog: React.FC<LinkDialogProps> = ({ editor, isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);

  // Get current link URL when dialog opens
  useEffect(() => {
    if (isOpen) {
      const currentUrl = editor.getAttributes('link').href || '';
      setUrl(currentUrl);
      setIsValidUrl(true);
    }
  }, [isOpen, editor]);

  // Validate URL format
  const validateUrl = (inputUrl: string): boolean => {
    if (!inputUrl.trim()) return false;
    
    try {
      const urlToTest = inputUrl.startsWith('http://') || inputUrl.startsWith('https://') 
        ? inputUrl 
        : `https://${inputUrl}`;
      
      new URL(urlToTest);
      return true;
    } catch {
      return false;
    }
  };

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsValidUrl(newUrl === '' || validateUrl(newUrl));
  };

  // Apply link to selected text with preview data
  const handleSave = async () => {
    if (!url.trim()) {
      handleUnlink();
      return;
    }

    if (!validateUrl(url)) {
      setIsValidUrl(false);
      return;
    }

    const finalUrl = url.startsWith('http://') || url.startsWith('https://') 
      ? url 
      : `https://${url}`;

    try {
      const response = await fetch(`/api/preview?url=${encodeURIComponent(finalUrl)}`);
      const { } = await response.json();
      editor.chain().focus().setLink({ href: finalUrl }).run();
    } catch {
      editor.chain().focus().setLink({ href: finalUrl }).run();
    }

    onClose();
  };

  // Remove link from selected text
  const handleUnlink = () => {
    editor.chain().focus().unsetLink().run();
    onClose();
  };

  // Handle Enter and Escape key presses
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  // Check if current selection has a link
  const hasLink = editor.isActive('link');

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-ghost-dark/95 backdrop-blur-md border border-ghost-gray/40 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          {hasLink ? 'Edit Link' : 'Add Link'}
        </h3>
        
        {/* URL Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            URL
          </label>
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            onKeyDown={handleKeyPress}
            placeholder="https://example.com"
            className={`
              w-full px-[8px] py-2 bg-ghost-black/50 border rounded-lg text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-ghost-purple/50 focus:border-ghost-purple/50
              transition-colors
              ${!isValidUrl ? 'border-red-500' : 'border-ghost-gray/30'}
            `}
            autoFocus
          />
          {!isValidUrl && (
            <p className="text-red-400 text-sm mt-1">
              Please enter a valid URL
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!isValidUrl}
              className="px-4 py-2 bg-ghost-purple text-white rounded-lg hover:bg-ghost-purple/80 
                         focus:outline-none focus:ring-2 focus:ring-ghost-purple/50 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {hasLink ? 'Update' : 'Save'}
            </button>
            
            {hasLink && (
              <button
                onClick={handleUnlink}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                           focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors"
              >
                Unlink
              </button>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ghost-gray/20 text-gray-300 rounded-lg hover:bg-ghost-gray/30 
                       focus:outline-none focus:ring-2 focus:ring-ghost-gray/50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkDialog;