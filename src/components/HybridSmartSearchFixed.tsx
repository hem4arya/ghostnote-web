import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Clock, TrendingUp, Tag, Zap } from 'lucide-react';
import { Input } from '@shared/ui/components/input';
import { Button } from '@shared/ui/components/button';
import { Badge } from '@shared/ui/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/components/card';
import { supabase } from '../../lib/supabase';

interface SearchResult {
  id: number;
  title: string;
  body: string;
  tags: string[];
  category: string;
  author: string;
  price: number;
  rating: number;
  review_count: number;
  created_at: string;
  semantic_score: number;
  fulltext_score: number;
  fuzzy_score: number;
  combined_score: number;
  is_fallback?: boolean;
}

interface SearchMetadata {
  used_semantic: boolean;
  used_fulltext: boolean;
  used_fuzzy: boolean;
  filters_applied: {
    category: string | null;
    min_rating: number | null;
    max_price: number | null;
  };
}

interface SearchSuggestions {
  popular_queries: string[];
  related_categories: string[];
  trending_tags: string[];
}

interface HybridSearchResponse {
  query: string;
  search_type: string;
  execution_time_ms: number;
  total_results: number;
  search_results: SearchResult[];
  fallback_results: SearchResult[];
  search_suggestions: SearchSuggestions;
  search_metadata: SearchMetadata;
  performance_tips: string[];
}

const HybridSmartSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'semantic' | 'fulltext' | 'fuzzy' | 'hybrid'>('hybrid');
  const [category, setCategory] = useState<string>('');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<HybridSearchResponse | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Categories for filtering
  const categories = [
    'All Categories',
    'Development',
    'AI/ML',
    'Design',
    'Business',
    'Writing',
    'Marketing',
    'Finance',
    'Health',
    'Education'
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const recent = localStorage.getItem('ghostnote_recent_searches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  // Save search to recent searches
  const saveRecentSearch = useCallback((searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('ghostnote_recent_searches', JSON.stringify(updated));
  }, [recentSearches]);

  // Show toast notification (simplified)
  const showToast = (title: string, description?: string, variant?: string) => {
    console.log(`${variant ? `[${variant}] ` : ''}${title}: ${description || ''}`);
    // In production, you would use a proper toast library
  };

  // Perform hybrid search
  const performSearch = async () => {
    if (!query.trim()) {
      showToast("Search Query Required", "Please enter a search query to find notes.", "error");
      return;
    }

    setIsSearching(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('hybrid-search', {
        body: {
          query: query.trim(),
          search_type: searchType,
          category: category === 'All Categories' ? null : category,
          min_rating: minRating,
          max_price: maxPrice,
          match_threshold: 0.2,
          match_count: 20,
          include_analytics: true
        }
      });

      if (error) throw error;

      setSearchResults(data as HybridSearchResponse);
      saveRecentSearch(query.trim());

      // Show performance feedback
      if (data.execution_time_ms > 150) {
        showToast("Search Completed", `Found ${data.total_results} results in ${data.execution_time_ms}ms`);
      }

    } catch (error) {
      console.error('Search error:', error);
      showToast("Search Failed", "Unable to perform search. Please try again.", "error");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  // Clear search results
  const clearSearch = () => {
    setQuery('');
    setSearchResults(null);
  };

  // Render search result card
  const renderSearchResult = (result: SearchResult, index: number) => (
    <Card key={result.id} className="mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {result.title}
              {result.is_fallback && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Trending
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>by {result.author}</span>
              <Badge variant="outline">{result.category}</Badge>
              <span className="flex items-center gap-1">
                ⭐ {result.rating.toFixed(1)} ({result.review_count})
              </span>
              <span className="font-semibold text-green-600">
                ${result.price.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-blue-600">
              {(result.combined_score * 100).toFixed(1)}% match
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Rank #{index + 1}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-700 mb-3 line-clamp-2">
          {result.body.substring(0, 200)}...
        </p>
        
        {/* Tags */}
        {result.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {result.tags.slice(0, 5).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Score breakdown */}
        <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Semantic: {(result.semantic_score * 100).toFixed(0)}%
          </div>
          <div className="flex items-center gap-1">
            <Search className="w-3 h-3" />
            Text: {(result.fulltext_score * 100).toFixed(0)}%
          </div>
          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Fuzzy: {(result.fuzzy_score * 100).toFixed(0)}%
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Button size="sm" className="flex-1">
            View Details
          </Button>
          <Button size="sm" variant="outline">
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hybrid Smart Search
        </h1>
        <p className="text-gray-600">
          Advanced AI-powered search with semantic understanding, full-text matching, and fuzzy search
        </p>
      </div>

      {/* Search Interface */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Enter your search query (e.g., 'React performance optimization')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  onClick={clearSearch}
                >
                  ×
                </Button>
              )}
            </div>
            <Button 
              onClick={performSearch} 
              disabled={isSearching}
              className="min-w-[100px]"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Search Type Selection */}
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium">Search Type:</label>
            <select 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value as 'semantic' | 'fulltext' | 'fuzzy' | 'hybrid')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="hybrid">Hybrid (Best)</option>
              <option value="semantic">Semantic Only</option>
              <option value="fulltext">Full-Text Only</option>
              <option value="fuzzy">Fuzzy Only</option>
            </select>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Min Rating: {minRating}⭐
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Max Price: ${maxPrice}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Searches */}
      {recentSearches.length > 0 && !searchResults && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              Recent Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setQuery(search)}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults && (
        <div className="space-y-6">
          {/* Results Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    Search Results for &quot;{searchResults.query}&quot;
                  </h2>
                  <p className="text-gray-600">
                    {searchResults.total_results} results found in {searchResults.execution_time_ms}ms
                    using {searchResults.search_type} search
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {searchResults.search_type}
                </Badge>
              </div>

              {/* Search Metadata */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className={searchResults.search_metadata.used_semantic ? 'text-green-600' : 'text-gray-400'}>
                    Semantic Search
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-green-500" />
                  <span className={searchResults.search_metadata.used_fulltext ? 'text-green-600' : 'text-gray-400'}>
                    Full-Text Search
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-purple-500" />
                  <span className={searchResults.search_metadata.used_fuzzy ? 'text-green-600' : 'text-gray-400'}>
                    Fuzzy Search
                  </span>
                </div>
              </div>

              {/* Performance Tips */}
              {searchResults.performance_tips.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Performance Tips:</h4>
                  <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                    {searchResults.performance_tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Results */}
          {searchResults.search_results.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Primary Results</h3>
              {searchResults.search_results.map((result, index) => 
                renderSearchResult(result, index)
              )}
            </div>
          )}

          {/* Fallback Results */}
          {searchResults.fallback_results.length > 0 && (
            <div>
              <div className="border-t border-gray-200 my-6"></div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold">Trending Notes (Since we found limited results)</h3>
              </div>
              {searchResults.fallback_results.map((result, index) => 
                renderSearchResult(result, index + searchResults.search_results.length)
              )}
            </div>
          )}

          {/* Search Suggestions */}
          {searchResults.search_suggestions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Search Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {searchResults.search_suggestions.popular_queries.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Popular Queries:</h4>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.search_suggestions.popular_queries.map((queryItem, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => setQuery(queryItem)}
                        >
                          {queryItem}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.search_suggestions.related_categories.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Related Categories:</h4>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.search_suggestions.related_categories.map((cat, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="cursor-pointer hover:bg-gray-200"
                          onClick={() => setCategory(cat)}
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.search_suggestions.trending_tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Trending Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.search_suggestions.trending_tags.map((tag, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => setQuery(tag)}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* No Results */}
      {searchResults && searchResults.search_results.length === 0 && searchResults.fallback_results.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find any notes matching your search criteria.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Try:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Using different keywords</li>
                <li>Checking your spelling</li>
                <li>Removing some filters</li>
                <li>Using broader search terms</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HybridSmartSearch;
