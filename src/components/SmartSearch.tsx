'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { sampleNotes } from '@/data/sampleNotes';
import { Note } from '@/components/NoteCard';

interface SearchResult extends Note {
  similarity?: number;
  highlighted?: string;
}

interface SmartSearchProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const SmartSearch = ({ 
  query, 
  isOpen, 
  onClose, 
  className = "" 
}: SmartSearchProps) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ghostnote-recent-searches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing recent searches:', e);
        }
      }
    }
  }, []);

  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (typeof window !== 'undefined') {
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('ghostnote-recent-searches', JSON.stringify(updated));
    }
  }, [recentSearches]);

  // Intelligent search simulation using keyword matching and semantic similarity
  const performSmartSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Process search immediately without artificial delay
    const queryLower = searchQuery.toLowerCase();
    const keywords = queryLower.split(' ').filter(word => word.length > 1);
    
    // Smart keyword mapping
    const semanticMap: { [key: string]: string[] } = {
      'motivation': ['motivational', 'inspiration', 'encouragement', 'uplift'],
      'breakup': ['relationship', 'love', 'heart', 'emotional'],
      'dark': ['gothic', 'noir', 'mysterious', 'shadow'],
      'writing': ['content', 'text', 'author', 'creative'],
      'startup': ['business', 'entrepreneur', 'pitch', 'company'],
      'interview': ['job', 'career', 'professional', 'coding'],
      'ai': ['artificial', 'intelligence', 'machine', 'learning'],
      'design': ['ui', 'ux', 'visual', 'interface'],
      'security': ['cyber', 'protection', 'hack', 'safe'],
      'crypto': ['blockchain', 'bitcoin', 'digital', 'currency'],
      'marketing': ['growth', 'sales', 'promotion', 'business'],
      'react': ['javascript', 'frontend', 'component', 'development'],
      'advanced': ['expert', 'professional', 'complex', 'sophisticated']
    };

    // Expand keywords with semantic alternatives
    const expandedKeywords = new Set(keywords);
    keywords.forEach(keyword => {
      Object.entries(semanticMap).forEach(([key, synonyms]) => {
        if (keyword.includes(key) || synonyms.some(syn => keyword.includes(syn))) {
          expandedKeywords.add(key);
          synonyms.forEach(syn => expandedKeywords.add(syn));
        }
      });
    });

    // Search and score notes
    const scoredResults = sampleNotes.map(note => {
      let score = 0;
      const searchableText = `${note.title} ${note.previewText} ${note.category} ${note.author}`.toLowerCase();
      
      // Exact phrase match (highest score)
      if (searchableText.includes(queryLower)) {
        score += 100;
      }

      // Individual keyword matches
      Array.from(expandedKeywords).forEach(keyword => {
        if (searchableText.includes(keyword)) {
          score += 15;
        }
      });

      // Category boost
      if (note.category.toLowerCase().includes(queryLower)) {
        score += 50;
      }

      // Title match boost
      if (note.title.toLowerCase().includes(queryLower)) {
        score += 75;
      }

      // Author match
      if (note.author.toLowerCase().includes(queryLower)) {
        score += 25;
      }

      return { ...note, similarity: Math.min(score / 100, 1) };
    });

    // Filter and sort results
    const filteredResults = scoredResults
      .filter(result => result.similarity > 0)
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
      .slice(0, 8);

    setResults(filteredResults);
    if (filteredResults.length > 0) {
      saveRecentSearch(searchQuery);
    }
    setIsLoading(false);
  }, [saveRecentSearch]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 2) {
        performSmartSearch(query);
      } else {
        setResults([]);
        setIsLoading(false);
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      // Clear loading state if component unmounts or query changes
      if (query.length <= 2) {
        setIsLoading(false);
      }
    };
  }, [query, performSmartSearch]);

  const suggestionQueries = [
    "motivational notes for breakup",
    "dark writing prompts", 
    "startup pitch summary",
    "AI and machine learning",
    "React programming tips",
    "design principles"
  ];

  if (!isOpen) {
    // Reset loading state when dropdown closes
    if (isLoading) {
      setIsLoading(false);
    }
    return null;
  }

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
                  {note.similarity && note.similarity > 0 && (
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
                    <button
                      key={index}
                      onClick={() => {
                        // Parent component should handle this
                        onClose();
                      }}
                      className="text-xs border border-ghost-purple/30 hover:border-ghost-neon hover:text-ghost-neon px-2 py-1 rounded transition-colors"
                    >
                      {recent}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Try Searching For</h4>
              <div className="space-y-2">
                {suggestionQueries.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onClose()}
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

export default SmartSearch;
