import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Mic, 
  MicOff, 
  Clock, 
  TrendingUp, 
  Tag, 
  Star, 
  Eye, 
  ShoppingCart, 
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Input } from 'packages/ui-components/components/input';
import { Button } from 'packages/ui-components/components/button';
import { Badge } from 'packages/ui-components/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from 'packages/ui-components/components/card';

// Speech Recognition types
interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: () => void;
  onend: () => void;
}

interface SearchSuggestion {
  id: string;
  type: 'query' | 'note' | 'category' | 'tag' | 'author';
  text: string;
  subtitle?: string;
  icon?: React.ReactNode;
  metadata?: {
    category?: string;
    price?: number;
    rating?: number;
    popularity?: number;
  };
}

interface SmartPreview {
  id: number;
  title: string;
  author: string;
  category: string;
  tags: string[];
  snippet: string;
  price: number;
  rating: number;
  views: number;
  purchases: number;
  is_free: boolean;
  created_at: string;
  thumbnail?: string;
}

interface SearchFilters {
  priceType: 'all' | 'free' | 'paid';
  category: string;
  sortBy: 'relevance' | 'recent' | 'popularity' | 'price_low' | 'price_high' | 'rating';
  minRating: number;
  maxPrice: number;
}

const PremiumSearchExperience: React.FC = () => {
  // Core search state
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [previews, setPreviews] = useState<SmartPreview[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // UX state
  const [filters, setFilters] = useState<SearchFilters>({
    priceType: 'all',
    category: '',
    sortBy: 'relevance',
    minRating: 0,
    maxPrice: 100
  });
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Enhanced mobile UX features
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Voice search setup
  const recognition = useRef<SpeechRecognitionInstance | null>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check for voice search support
  useEffect(() => {
    setVoiceSearchSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  // Load recent searches
  useEffect(() => {
    const recent = localStorage.getItem('ghostnote_recent_searches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  // Perform main search
  const performSearch = useCallback(async (searchQuery?: string) => {
    const queryToSearch = searchQuery || query;
    if (!queryToSearch.trim()) return;

    setIsSearching(true);
    setShowSuggestions(false);

    try {
      // Simulate API delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock smart previews based on the search query
      const mockPreviews: SmartPreview[] = [
        {
          id: 1,
          title: `Mastering ${queryToSearch}: A Complete Guide`,
          author: 'Sarah Chen',
          category: 'Development',
          tags: [queryToSearch.toLowerCase(), 'best-practices', 'tutorial', 'advanced'],
          snippet: `Learn everything you need to know about ${queryToSearch}. This comprehensive guide covers fundamentals, advanced techniques, and real-world examples. Perfect for beginners and experts alike.`,
          price: 29.99,
          rating: 4.9,
          views: 15420,
          purchases: 1340,
          is_free: false,
          created_at: '2025-01-08'
        },
        {
          id: 2,
          title: `${queryToSearch} Quick Reference & Cheat Sheet`,
          author: 'Alex Thompson',
          category: 'Reference',
          tags: [queryToSearch.toLowerCase(), 'reference', 'cheat-sheet', 'quick-start'],
          snippet: `Quick reference guide for ${queryToSearch}. Includes syntax, common patterns, troubleshooting tips, and performance optimizations. Bookmark this for daily use.`,
          price: 0,
          rating: 4.7,
          views: 8950,
          purchases: 2100,
          is_free: true,
          created_at: '2025-01-07'
        },
        {
          id: 3,
          title: `Advanced ${queryToSearch} Patterns and Techniques`,
          author: 'Maria Rodriguez',
          category: 'Advanced',
          tags: [queryToSearch.toLowerCase(), 'advanced', 'patterns', 'optimization'],
          snippet: `Deep dive into advanced ${queryToSearch} concepts. Covers design patterns, performance optimization, scalability, and enterprise-level implementations.`,
          price: 45.00,
          rating: 4.8,
          views: 6780,
          purchases: 890,
          is_free: false,
          created_at: '2025-01-06'
        },
        {
          id: 4,
          title: `${queryToSearch} for Beginners: Step-by-Step Tutorial`,
          author: 'David Park',
          category: 'Tutorial',
          tags: [queryToSearch.toLowerCase(), 'beginner', 'tutorial', 'step-by-step'],
          snippet: `Perfect introduction to ${queryToSearch} for beginners. No prior experience required. Includes hands-on exercises, examples, and practical projects to build your skills.`,
          price: 19.99,
          rating: 4.6,
          views: 12300,
          purchases: 1560,
          is_free: false,
          created_at: '2025-01-05'
        },
        {
          id: 5,
          title: `${queryToSearch} Case Studies and Real-World Examples`,
          author: 'Jennifer Liu',
          category: 'Case Study',
          tags: [queryToSearch.toLowerCase(), 'case-study', 'examples', 'real-world'],
          snippet: `Explore real-world applications of ${queryToSearch} through detailed case studies. Learn from successful implementations and avoid common pitfalls.`,
          price: 35.00,
          rating: 4.9,
          views: 4560,
          purchases: 672,
          is_free: false,
          created_at: '2025-01-04'
        },
        {
          id: 6,
          title: `Free ${queryToSearch} Resources and Tools Collection`,
          author: 'Community Curated',
          category: 'Resources',
          tags: [queryToSearch.toLowerCase(), 'free', 'resources', 'tools', 'collection'],
          snippet: `Curated collection of the best free ${queryToSearch} resources, tools, libraries, and learning materials. Updated weekly by the community.`,
          price: 0,
          rating: 4.5,
          views: 9870,
          purchases: 3200,
          is_free: true,
          created_at: '2025-01-03'
        }
      ];

      setPreviews(mockPreviews);
      
      // Save to recent searches
      const updatedRecent = [queryToSearch, ...recentSearches.filter(s => s !== queryToSearch)].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem('ghostnote_recent_searches', JSON.stringify(updatedRecent));

    } catch (error) {
      console.error('Search failed:', error);
      setPreviews([]);
    } finally {
      setIsSearching(false);
    }
  }, [query, recentSearches]);

  // Setup voice search
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // Create speech recognition without complex typing
      const SpeechRecognition = (window as unknown as {
        webkitSpeechRecognition: new() => SpeechRecognitionInstance;
        SpeechRecognition: new() => SpeechRecognitionInstance;
      }).webkitSpeechRecognition || (window as unknown as {
        webkitSpeechRecognition: new() => SpeechRecognitionInstance;
        SpeechRecognition: new() => SpeechRecognitionInstance;
      }).SpeechRecognition;
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsVoiceSearching(false);
        performSearch(transcript);
      };
      
      recognitionInstance.onerror = () => {
        setIsVoiceSearching(false);
      };
      
      recognitionInstance.onend = () => {
        setIsVoiceSearching(false);
      };
      
      recognition.current = recognitionInstance;
    }
  }, [performSearch]);

  // Debounced suggestion generation
  const generateSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      // Show default suggestions when empty
      const defaultSuggestions: SearchSuggestion[] = [
        ...recentSearches.slice(0, 3).map(search => ({
          id: `recent_${search}`,
          type: 'query' as const,
          text: search,
          subtitle: 'Recent search',
          icon: <Clock className="w-4 h-4 text-gray-400" />
        })),
        {
          id: 'trending_react',
          type: 'query',
          text: 'React performance optimization',
          subtitle: 'Trending • 2.3k searches',
          icon: <TrendingUp className="w-4 h-4 text-orange-500" />
        },
        {
          id: 'trending_ai',
          type: 'query', 
          text: 'AI prompts for writing',
          subtitle: 'Trending • 1.8k searches',
          icon: <TrendingUp className="w-4 h-4 text-orange-500" />
        },
        {
          id: 'trending_design',
          type: 'query',
          text: 'UI/UX design principles',
          subtitle: 'Trending • 1.5k searches',
          icon: <TrendingUp className="w-4 h-4 text-orange-500" />
        },
        {
          id: 'cat_development',
          type: 'category',
          text: 'Development',
          subtitle: '1,240 notes',
          icon: <Tag className="w-4 h-4 text-blue-500" />
        },
        {
          id: 'cat_design',
          type: 'category',
          text: 'Design',
          subtitle: '892 notes',
          icon: <Tag className="w-4 h-4 text-purple-500" />
        },
        {
          id: 'cat_business',
          type: 'category',
          text: 'Business',
          subtitle: '634 notes',
          icon: <Tag className="w-4 h-4 text-green-500" />
        }
      ];
      setSuggestions(defaultSuggestions);
      return;
    }

    try {
      // In production, this would call the real API
      // For demo purposes, we'll generate intelligent suggestions based on the query
      const mockSuggestions: SearchSuggestion[] = [];
      
      // Smart query completions
      const queryCompletions = [
        `${searchQuery} best practices`,
        `${searchQuery} tutorial`,
        `${searchQuery} examples`,
        `${searchQuery} guide`
      ];
      
      queryCompletions.forEach((completion, index) => {
        if (completion.toLowerCase() !== searchQuery.toLowerCase()) {
          mockSuggestions.push({
            id: `query_${index}`,
            type: 'query',
            text: completion,
            subtitle: `Complete search`,
            icon: <Search className="w-4 h-4 text-gray-500" />
          });
        }
      });

      // Popular notes matching the query
      const relatedNotes = [
        {
          id: 'note_1',
          type: 'note' as const,
          text: `Ultimate ${searchQuery} Masterclass`,
          subtitle: 'by Sarah Chen • Development',
          icon: <Sparkles className="w-4 h-4 text-yellow-500" />,
          metadata: { price: 29.99, rating: 4.8, category: 'Development' }
        },
        {
          id: 'note_2',
          type: 'note' as const,
          text: `${searchQuery} Quick Reference`,
          subtitle: 'by Alex Thompson • Free',
          icon: <Sparkles className="w-4 h-4 text-yellow-500" />,
          metadata: { price: 0, rating: 4.6, category: 'Reference' }
        }
      ];
      
      mockSuggestions.push(...relatedNotes);

      // Related categories
      if (searchQuery.toLowerCase().includes('react') || searchQuery.toLowerCase().includes('javascript')) {
        mockSuggestions.push({
          id: 'cat_dev',
          type: 'category',
          text: 'Development',
          subtitle: '1,240 notes',
          icon: <Tag className="w-4 h-4 text-blue-500" />
        });
      }
      
      if (searchQuery.toLowerCase().includes('design') || searchQuery.toLowerCase().includes('ui')) {
        mockSuggestions.push({
          id: 'cat_design',
          type: 'category',
          text: 'Design',
          subtitle: '892 notes',
          icon: <Tag className="w-4 h-4 text-purple-500" />
        });
      }

      setSuggestions(mockSuggestions.slice(0, 8));
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      // Fallback to simple suggestions
      setSuggestions([]);
    }
  }, [recentSearches]);

  // Handle query change with debouncing
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedSuggestionIndex(-1);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      generateSuggestions(value);
      setShowSuggestions(true);
    }, 150);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'query' || suggestion.type === 'note') {
      setQuery(suggestion.text);
      performSearch(suggestion.text);
    } else if (suggestion.type === 'category') {
      setFilters(prev => ({ ...prev, category: suggestion.text }));
      setQuery('');
      performSearch('');
    } else if (suggestion.type === 'tag') {
      setQuery(suggestion.text);
      performSearch(suggestion.text);
    }
    setShowSuggestions(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
        } else {
          performSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Start voice search
  const startVoiceSearch = () => {
    if (recognition.current && !isVoiceSearching) {
      setIsVoiceSearching(true);
      recognition.current.start();
    }
  };

  // Stop voice search
  const stopVoiceSearch = () => {
    if (recognition.current && isVoiceSearching) {
      recognition.current.stop();
      setIsVoiceSearching(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setPreviews([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Premium Search Bar */}
      <div className="relative">
        <Card className="border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {/* Search Icon */}
              <Search className="w-5 h-5 text-gray-400" />
              
              {/* Search Input */}
              <div className="flex-1 relative">
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder={isMobile ? "Search notes..." : "Search for notes, topics, or creators..."}
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => generateSuggestions(query)}
                  className="border-0 shadow-none text-lg placeholder:text-gray-400 focus-visible:ring-0 p-0"
                />
                
                {/* Search Loading Indicator */}
                {isSearching && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  </div>
                )}
              </div>

              {/* Voice Search Button */}
              {!isMobile && voiceSearchSupported && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={isVoiceSearching ? stopVoiceSearch : startVoiceSearch}
                  className={`p-2 rounded-full transition-colors ${
                    isVoiceSearching 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {isVoiceSearching ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
              )}

              {/* Clear Button */}
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}

              {/* Filter Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-full transition-colors ${
                  showFilters ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Filters (Mobile) */}
            {isMobile && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                <Button 
                  variant={filters.priceType === 'free' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, priceType: 'free' }))}
                >
                  Free
                </Button>
                <Button 
                  variant={filters.sortBy === 'recent' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: 'recent' }))}
                >
                  Recent
                </Button>
                <Button 
                  variant={filters.sortBy === 'popularity' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: 'popularity' }))}
                >
                  Popular
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice Search Feedback */}
        {isVoiceSearching && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 border-red-200 bg-red-50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Listening... Speak now</span>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Smart Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-40 shadow-xl border-gray-200 max-h-96 overflow-y-auto">
            <CardContent className="p-0">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                    index === selectedSuggestionIndex ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  {suggestion.icon}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.text}
                    </div>
                    {suggestion.subtitle && (
                      <div className="text-xs text-gray-500 truncate">
                        {suggestion.subtitle}
                      </div>
                    )}
                  </div>
                  {suggestion.metadata?.price !== undefined && (
                    <Badge variant="outline" className="text-xs">
                      ${suggestion.metadata.price}
                    </Badge>
                  )}
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && !isMobile && (
        <Card className="mt-4 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Price Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Price</label>
                <select 
                  value={filters.priceType} 
                  onChange={(e) => setFilters(prev => ({ ...prev, priceType: e.target.value as 'all' | 'free' | 'paid' }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Notes</option>
                  <option value="free">Free Only</option>
                  <option value="paid">Paid Only</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select 
                  value={filters.category} 
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">All Categories</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Writing">Writing</option>
                  <option value="AI/ML">AI/ML</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <select 
                  value={filters.sortBy} 
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as 'relevance' | 'recent' | 'popularity' | 'price_low' | 'price_high' | 'rating' }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="recent">Most Recent</option>
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Min Rating: {filters.minRating}⭐</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Smart Previews Grid */}
      {previews.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Search Results ({previews.length})
          </h3>
          
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {previews.map((preview) => (
              <Card key={preview.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-gray-200 hover:border-blue-300">
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {preview.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        by {preview.author}
                      </p>
                    </div>
                    <div className="ml-2 text-right">
                      {preview.is_free ? (
                        <Badge variant="secondary" className="text-green-600 bg-green-50">
                          Free
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="font-semibold">
                          ${preview.price}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Snippet */}
                  <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                    {preview.snippet}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {preview.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {preview.rating.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {preview.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3" />
                        {preview.purchases}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {preview.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results State */}
      {query && !isSearching && previews.length === 0 && (
        <Card className="mt-6 border-gray-200">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No results found for &ldquo;{query}&rdquo;
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn&apos;t find any notes matching your search. Try adjusting your search terms or explore our trending content below.
            </p>
            
            {/* Fallback Suggestions */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Try these suggestions:</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={() => handleQueryChange('React')}>
                    React
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={() => handleQueryChange('Design')}>
                    Design
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={() => handleQueryChange('AI prompts')}>
                    AI prompts
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={() => handleQueryChange('Business')}>
                    Business
                  </Badge>
                </div>
              </div>
              
              <Button variant="outline" onClick={() => setQuery('')}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Browse Trending Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PremiumSearchExperience;
