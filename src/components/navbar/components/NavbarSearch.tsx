'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, FileText } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'note' | 'recent' | 'trending';
  excerpt?: string;
  timestamp?: string;
}

interface NavbarSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
}

export const NavbarSearch = ({
  isOpen,
  onClose,
  onSearch,
  placeholder = "Search notes, tags, or content...",
  suggestions = [],
  recentSearches = []
}: NavbarSearchProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setQuery('');
      onClose();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSearch(suggestion.title);
    setQuery('');
    onClose();
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const totalItems = suggestions.length + recentSearches.length;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % totalItems);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            if (selectedIndex < suggestions.length) {
              const suggestion = suggestions[selectedIndex];
              onSearch(suggestion.title);
              setQuery('');
              onClose();
            } else {
              const recentIndex = selectedIndex - suggestions.length;
              const searchQuery = recentSearches[recentIndex];
              if (searchQuery.trim()) {
                onSearch(searchQuery.trim());
                setQuery('');
                onClose();
              }
            }
          } else if (query.trim()) {
            onSearch(query.trim());
            setQuery('');
            onClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, suggestions, recentSearches, query, onClose, onSearch]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:relative md:inset-auto">
      {/* Mobile Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="fixed top-4 left-4 right-4 md:static md:top-auto md:left-auto md:right-auto glass-morphism md:bg-transparent border border-white/20 md:border-0 rounded-lg md:rounded-none shadow-xl md:shadow-none">
        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center gap-2 p-3 md:p-0">
            <Search className="h-4 w-4 text-gray-300 flex-shrink-0" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  handleSearch(query);
                }
              }}
              placeholder={placeholder}
              className="flex-1 border-0 bg-transparent focus:ring-0 text-white placeholder:text-gray-300 navbar-search-input"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-300 hover:text-white flex-shrink-0 md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Dropdown */}
        {(query || suggestions.length > 0 || recentSearches.length > 0) && (
          <div 
            ref={dropdownRef}
            className="border-t border-white/10 md:absolute md:top-full md:left-0 md:right-0 md:mt-2 md:border md:rounded-lg md:shadow-xl glass-morphism max-h-80 overflow-y-auto"
          >
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-300 px-2 py-1 mb-1">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left p-2 rounded-md transition-all duration-200 ${
                      index === selectedIndex
                        ? 'bg-white/20 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {suggestion.type === 'note' && <FileText className="h-4 w-4" />}
                        {suggestion.type === 'recent' && <Clock className="h-4 w-4" />}
                        {suggestion.type === 'trending' && <TrendingUp className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{suggestion.title}</div>
                        {suggestion.excerpt && (
                          <div className="text-xs text-gray-400 truncate mt-1">
                            {suggestion.excerpt}
                          </div>
                        )}
                        {suggestion.timestamp && (
                          <div className="text-xs text-gray-500 mt-1">
                            {suggestion.timestamp}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-2 border-t border-white/10">
                <div className="text-xs font-medium text-gray-300 px-2 py-1 mb-1">
                  Recent Searches
                </div>
                {recentSearches.map((recent, index) => {
                  const actualIndex = suggestions.length + index;
                  return (
                    <button
                      key={recent}
                      onClick={() => handleSearch(recent)}
                      className={`w-full text-left p-2 rounded-md transition-all duration-200 ${
                        actualIndex === selectedIndex
                          ? 'bg-white/20 text-white'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4" />
                        <span className="truncate">{recent}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {query && suggestions.length === 0 && recentSearches.length === 0 && (
              <div className="p-4 text-center text-gray-300">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No suggestions found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarSearch;
