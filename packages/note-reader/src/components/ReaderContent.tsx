'use client';

import { useEffect, useRef, useState } from 'react';
import { Clock, User, Tag, Lock, Shield } from 'lucide-react';
import type { ReaderContentProps } from '../types';

// React 19 compatibility wrappers
const ClockIcon = Clock as React.ElementType;
const LockIcon = Lock as React.ElementType;
const ShieldIcon = Shield as React.ElementType;
const TagIcon = Tag as React.ElementType;
const UserIcon = User as React.ElementType;

import '../styles/reader.css';

export function ReaderContent({ 
  note, 
  fontSize, 
  lineHeight, 
  colorScheme 
}: ReaderContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  // Calculate reading progress on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const progress = (element.scrollTop / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate estimated read time
  const calculateReadTime = (content?: string) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const readTime = note.read_time || calculateReadTime(note.content);
  const wordCount = note.word_count || (note.content ? note.content.split(/\s+/).length : 0);

  return (
    <div className="relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div 
          className="h-full bg-blue-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div 
        ref={contentRef}
        className="reader-content max-w-4xl mx-auto px-6 py-8 overflow-y-auto"
        style={{ 
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
          height: 'calc(100vh - 80px)' // Adjust for header height
        }}
      >
        {/* Note Metadata */}
        <div className="mb-8 border-b pb-6" style={{
          borderColor: colorScheme === 'dark' ? '#374151' :
                      colorScheme === 'sepia' ? '#d97706' : '#e5e7eb'
        }}>
          <div className="flex flex-wrap items-center gap-4 text-sm opacity-70">
            {note.author && (
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                <span>{note.author}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              <span>{formatDate(note.created_at)}</span>
            </div>

            <div className="flex items-center gap-1">
              <span>{readTime} min read</span>
            </div>

            <div className="flex items-center gap-1">
              <span>{wordCount.toLocaleString()} words</span>
            </div>

            {note.isLocked && (
              <div className="flex items-center gap-1 text-yellow-500">
                <LockIcon className="h-4 w-4" />
                <span>Premium</span>
              </div>
            )}

            {note.isEncrypted && (
              <div className="flex items-center gap-1 text-green-500">
                <ShieldIcon className="h-4 w-4" />
                <span>Encrypted</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    colorScheme === 'dark' ? 'bg-gray-800 text-gray-300' :
                    colorScheme === 'sepia' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-700'
                  }`}
                >
                  <TagIcon className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Note Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
          {note.title || 'Untitled Note'}
        </h1>

        {/* Note Content */}
        <div className="prose max-w-none">
          {note.content ? (
            <div 
              className="whitespace-pre-wrap"
              style={{
                fontSize: 'inherit',
                lineHeight: 'inherit',
                color: colorScheme === 'dark' ? '#f3f4f6' :
                       colorScheme === 'sepia' ? '#78350f' : '#111827'
              }}
            >
              {note.content}
            </div>
          ) : (
            <div className="text-center py-12 opacity-50">
              <p>This note appears to be empty.</p>
            </div>
          )}
        </div>

        {/* End of Content Spacer */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}
