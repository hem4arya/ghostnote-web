'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '../../../../lib/supabase';
import Link from 'next/link';
import { Note } from '@/features/notes/components/NoteCard';

interface SearchResult extends Note {
  similarity?: number;
  highlighted?: string;
}

interface IntelligentSearchProps {
  placeholder?: string;
  className?: string;
}

const IntelligentSearch = ({ 
  placeholder = "Search for 'motivational notes for breakup', 'dark writing prompts'...", 
  className = "" 
}: IntelligentSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ghostnote-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        return;
      }

      setResults(data.notes || []);
      saveRecentSearch(searchQuery);
    } catch (searchError) {
      console.error('Search failed:', searchError);
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

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
    }
  };

  const suggestionQueries = [
    "motivational notes for breakup",
    "dark writing prompts",
    "startup pitch summary",
    "creative writing techniques",
    "productivity hacks",
    "coding interview prep"
  ];

  return (
    <div ref={searchRef} className={`relative w-full max-w-2xl ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="pl-10 pr-12 py-3 text-lg bg-ghost-dark/50 border-ghost-purple/30 focus:border-ghost-neon focus:ring-ghost-neon/20 text-white placeholder-gray-400"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-ghost-purple/20"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Dropdown */}
      {isOpen && (
        <Card className="absolute top-full mt-2 w-full bg-ghost-dark/95 backdrop-blur-lg border-ghost-purple/30 shadow-2xl shadow-ghost-purple/10 z-50 max-h-96 overflow-y-auto">
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
                    onClick={() => setIsOpen(false)}
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

            {/* Recent Searches & Suggestions */}
            {!isLoading && query.length <= 2 && (
              <div className="space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Searches</h4>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((recent, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setQuery(recent);
                            performSearch(recent);
                          }}
                          className="text-xs border-ghost-purple/30 hover:border-ghost-neon hover:text-ghost-neon"
                        >
                          {recent}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Try Searching For</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestionQueries.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setQuery(suggestion);
                          performSearch(suggestion);
                        }}
                        className="text-xs text-left justify-start text-gray-400 hover:text-ghost-neon hover:bg-ghost-purple/20"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default IntelligentSearch;
