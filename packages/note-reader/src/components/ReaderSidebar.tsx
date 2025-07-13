'use client';

import { useState } from 'react';
import { Type, AlignLeft, Download, Share2, Heart } from 'lucide-react';
import { Button } from 'packages/ui-components/components/button';
import type { ReaderSidebarProps } from '../types';

export function ReaderSidebar({ 
  note, 
  fontSize, 
  lineHeight, 
  onFontSizeChange, 
  onLineHeightChange 
}: ReaderSidebarProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'info' | 'actions'>('settings');

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([note.content || ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title || 'untitled-note'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: note.title || 'Untitled Note',
        text: note.content?.slice(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <aside className="fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-40 overflow-y-auto">
      <div className="p-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'info'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Info
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'actions'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Actions
          </button>
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Font Size */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Type className="h-4 w-4" />
                Font Size
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => onFontSizeChange(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>12px</span>
                  <span className="font-medium">{fontSize}px</span>
                  <span>24px</span>
                </div>
              </div>
            </div>

            {/* Line Height */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <AlignLeft className="h-4 w-4" />
                Line Height
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1.2"
                  max="2.0"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => onLineHeightChange(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1.2</span>
                  <span className="font-medium">{lineHeight.toFixed(1)}</span>
                  <span>2.0</span>
                </div>
              </div>
            </div>

            {/* Quick Font Size Buttons */}
            <div>
              <label className="text-sm font-medium mb-3 block">Quick Adjust</label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFontSizeChange(Math.max(12, fontSize - 1))}
                  className="flex-1"
                >
                  A-
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFontSizeChange(16)}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFontSizeChange(Math.min(24, fontSize + 1))}
                  className="flex-1"
                >
                  A+
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-2">Note Details</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium">Title:</span> {note.title || 'Untitled'}
                </div>
                {note.author && (
                  <div>
                    <span className="font-medium">Author:</span> {note.author}
                  </div>
                )}
                {note.created_at && (
                  <div>
                    <span className="font-medium">Created:</span>{' '}
                    {new Date(note.created_at).toLocaleDateString()}
                  </div>
                )}
                <div>
                  <span className="font-medium">Words:</span>{' '}
                  {note.content ? note.content.split(/\s+/).length.toLocaleString() : 0}
                </div>
                <div>
                  <span className="font-medium">Characters:</span>{' '}
                  {note.content ? note.content.length.toLocaleString() : 0}
                </div>
              </div>
            </div>

            {note.tags && note.tags.length > 0 && (
              <div>
                <h3 className="font-medium text-sm mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(note.isLocked || note.isEncrypted) && (
              <div>
                <h3 className="font-medium text-sm mb-2">Security</h3>
                <div className="space-y-1 text-sm">
                  {note.isLocked && (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Premium Content
                    </div>
                  )}
                  {note.isEncrypted && (
                    <div className="flex items-center gap-2 text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      End-to-End Encrypted
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-3">
            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full justify-start"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Note
            </Button>

            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              Download as Text
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
            >
              <Heart className="h-4 w-4 mr-2" />
              Add to Favorites
            </Button>

            <div className="border-t pt-3 mt-4">
              <p className="text-xs text-gray-500 mb-2">Reading Statistics</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Reading Progress</span>
                  <span>0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Time</span>
                  <span>
                    {Math.ceil((note.content ? note.content.split(/\s+/).length : 0) / 200)} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
