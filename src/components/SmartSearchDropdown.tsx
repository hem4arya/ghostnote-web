'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { Note } from '@/features/notes/components/NoteCard';

interface SearchResult extends Note {
  similarity?: number;
}

interface SmartSearchDropdownProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const SmartSearchDropdown = ({ 
  query, 
  isOpen, 
  onClose, 
  className = "" 
}: SmartSearchDropdownProps) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ghostnote-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveRecentSearch = useCallback((searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('ghostnote-recent-searches', JSON.stringify(updated));
  }, [recentSearches]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      // Call the Supabase Edge Function for intelligent search
      const { data, error } = await supabase.functions.invoke('search-notes', {
        body: { query: searchQuery }
      });

      if (error) {
        console.error('Search error:', error);
        // Fallback to sample data for demo
        setResults([]);
        return;
      }

      setResults(data.notes || []);
      saveRecentSearch(searchQuery);
    } catch (searchError) {
      console.error('Search failed:', searchError);
      // Fallback to sample data for demo
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [saveRecentSearch]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 2) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  const suggestionQueries = [
    "motivational notes for breakup",
    "dark writing prompts", 
    "startup pitch summary",
    "creative writing techniques"
  ];

  if (!isOpen) return null;

  return (
    <Card className={`absolute top-full mt-2 w-full bg-ghost-dark/95 backdrop-blur-lg border-ghost-purple/30 shadow-2xl shadow-ghost-purple/10 z-50 max-h-96 overflow-y-auto ${className}`}>
      <div className="p-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-ghost-neon mr-2" />
            <span className="text-gray-300">Searching with AI...</span>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-ghost-neon" />
              <h3 className="text-lg font-semibold text-white">Smart Results</h3>
              <Badge variant="secondary" className="bg-ghost-neon/20 text-ghost-neon">
                {results.length} found
              </Badge>
            </div>
            
            {results.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                onClick={onClose}
                className="block p-3 rounded-lg bg-ghost-gray/20 hover:bg-ghost-purple/20 transition-colors group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white group-hover:text-ghost-neon transition-colors line-clamp-1">
                    {note.title}
                  </h4>
                  {note.similarity && (
                    <Badge variant="outline" className="text-xs border-ghost-neon/30 text-ghost-neon">
                      {Math.round(note.similarity * 100)}% match
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                  {note.previewText}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {note.category}
                    </Badge>
                    <span className="text-xs text-gray-500">by {note.author}</span>
                  </div>
                  <span className="text-sm font-medium text-ghost-neon">${note.price}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && query.length > 2 && results.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">No notes found for &ldquo;{query}&rdquo;</div>
            <div className="text-sm text-gray-500">Try a different search term or browse our categories</div>
          </div>
        )}

        {/* Suggestions when no query */}
        {!isLoading && query.length <= 2 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Try Searching For</h4>
              <div className="space-y-2">
                {suggestionQueries.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      // This will be handled by the parent component
                      onClose();
                    }}
                    className="block w-full text-left text-xs text-gray-400 hover:text-ghost-neon hover:bg-ghost-purple/20 p-2 rounded transition-colors"
                  >
                    <Search className="inline h-3 w-3 mr-2" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SmartSearchDropdown;
