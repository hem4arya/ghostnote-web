'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, Sparkles, User, Heart, TrendingUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User as SupabaseUser } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { Note } from '@/components/NoteCard';

interface SearchResult extends Note {
  similarity?: number;
  highlighted?: string;
  score?: number;
  source?: 'semantic' | 'behavioral' | 'collaborative' | 'fallback';
}

interface PersonalizedSearchResponse {
  semantic_results: SearchResult[];
  behavioral_results: SearchResult[];
  collaborative_results: SearchResult[];
  fallback_results: SearchResult[];
  metadata: {
    user_id?: string;
    has_behavioral_data: boolean;
    total_results: number;
    search_time_ms: number;
  };
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
  const [personalizedResults, setPersonalizedResults] = useState<PersonalizedSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'behavioral' | 'collaborative'>('all');
  const searchRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();

  // Check user authentication
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

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

  const performBasicSearch = useCallback(async (searchQuery: string) => {
    const { data, error } = await supabase.functions.invoke('search-notes', {
      body: { query: searchQuery }
    });

    if (error) {
      console.error('Basic search error:', error);
      return;
    }

    setResults(data.notes?.map((note: SearchResult) => ({ ...note, source: 'semantic' as const })) || []);
    setPersonalizedResults(null);
  }, [supabase.functions]);

  // Enhanced search with personalization
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      if (user?.id) {
        // Use personalized search for authenticated users
        const { data, error } = await supabase.functions.invoke('personalized-search', {
          body: { 
            user_id: user.id,
            query: searchQuery,
            include_behavioral: true,
            include_collaborative: true,
            limit: 10
          }
        });

        if (error) {
          console.error('Personalized search error:', error);
          // Fallback to basic search
          await performBasicSearch(searchQuery);
          return;
        }

        setPersonalizedResults(data);
        // Combine all results for the main display
        const allResults = [
          ...data.semantic_results.map((r: SearchResult) => ({ ...r, source: 'semantic' as const })),
          ...data.behavioral_results.map((r: SearchResult) => ({ ...r, source: 'behavioral' as const })),
          ...data.collaborative_results.map((r: SearchResult) => ({ ...r, source: 'collaborative' as const }))
        ];
        setResults(allResults);
      } else {
        // Use basic search for anonymous users
        await performBasicSearch(searchQuery);
      }
      
      saveRecentSearch(searchQuery);
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to basic search
      await performBasicSearch(searchQuery);
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase.functions, saveRecentSearch, performBasicSearch]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 2) {
        performSearch(query);
      } else {
        setResults([]);
        setPersonalizedResults(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setPersonalizedResults(null);
    setIsOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
    }
  };

  const getResultIcon = (source: string) => {
    switch (source) {
      case 'behavioral':
        return <User className="h-4 w-4 text-blue-400" />;
      case 'collaborative':
        return <Heart className="h-4 w-4 text-pink-400" />;
      case 'semantic':
      default:
        return <Sparkles className="h-4 w-4 text-ghost-neon" />;
    }
  };

  const getResultBadge = (source: string) => {
    switch (source) {
      case 'behavioral':
        return 'For You';
      case 'collaborative':
        return 'Popular';
      case 'semantic':
      default:
        return 'Match';
    }
  };

  const getFilteredResults = () => {
    if (!personalizedResults) return results;
    
    switch (activeTab) {
      case 'behavioral':
        return personalizedResults.behavioral_results.map(r => ({ ...r, source: 'behavioral' as const }));
      case 'collaborative':
        return personalizedResults.collaborative_results.map(r => ({ ...r, source: 'collaborative' as const }));
      default:
        return results;
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
                {/* Results Header with Tabs for Personalized Search */}
                {personalizedResults && user && (
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-ghost-neon" />
                      <h3 className="text-lg font-semibold text-white">Smart Results</h3>
                      <Badge variant="secondary" className="bg-ghost-neon/20 text-ghost-neon">
                        {personalizedResults.metadata.total_results} found
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant={activeTab === 'all' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('all')}
                        className="text-xs"
                      >
                        All
                      </Button>
                      {personalizedResults.behavioral_results.length > 0 && (
                        <Button
                          variant={activeTab === 'behavioral' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setActiveTab('behavioral')}
                          className="text-xs"
                        >
                          <User className="h-3 w-3 mr-1" />
                          For You
                        </Button>
                      )}
                      {personalizedResults.collaborative_results.length > 0 && (
                        <Button
                          variant={activeTab === 'collaborative' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setActiveTab('collaborative')}
                          className="text-xs"
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Basic results header for non-personalized search */}
                {(!personalizedResults || !user) && (
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-ghost-neon" />
                    <h3 className="text-lg font-semibold text-white">Search Results</h3>
                    <Badge variant="secondary" className="bg-ghost-neon/20 text-ghost-neon">
                      {results.length} found
                    </Badge>
                  </div>
                )}
                
                {/* Display filtered results */}
                {getFilteredResults().map((note) => (
                  <Link
                    key={note.id}
                    href={`/notes/${note.id}`}
                    onClick={() => setIsOpen(false)}
                    className="block p-3 rounded-lg bg-ghost-gray/20 hover:bg-ghost-purple/20 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        {getResultIcon(note.source || 'semantic')}
                        <h4 className="font-medium text-white group-hover:text-ghost-neon transition-colors line-clamp-1">
                          {note.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-ghost-neon/30 text-ghost-neon">
                          {getResultBadge(note.source || 'semantic')}
                        </Badge>
                        {note.similarity && (
                          <Badge variant="outline" className="text-xs border-blue-300/30 text-blue-300">
                            {Math.round(note.similarity * 100)}%
                          </Badge>
                        )}
                        {note.score && (
                          <Badge variant="outline" className="text-xs border-green-300/30 text-green-300">
                            {note.score.toFixed(1)}
                          </Badge>
                        )}
                      </div>
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

                {/* Show fallback content for new users */}
                {personalizedResults && !personalizedResults.metadata.has_behavioral_data && (
                  <div className="mt-6 p-4 bg-ghost-purple/10 border border-ghost-purple/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-yellow-400" />
                      <h4 className="font-medium text-white">New to GhostNote?</h4>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      Explore these popular notes to get personalized recommendations in the future!
                    </p>
                    <div className="space-y-2">
                      {personalizedResults.fallback_results.slice(0, 3).map((note) => (
                        <Link
                          key={note.id}
                          href={`/notes/${note.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-2 rounded bg-ghost-gray/10 hover:bg-ghost-gray/20 transition-colors"
                        >
                          <TrendingUp className="h-4 w-4 text-orange-400" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white">{note.title}</div>
                            <div className="text-xs text-gray-500">{note.category} • ${note.price}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No Results */}
            {!isLoading && query.length > 2 && results.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">No notes found for &quot;{query}&quot;</div>
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
