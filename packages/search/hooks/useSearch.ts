import { useState, useCallback } from 'react';
import { SearchState, SearchOptions, SearchFilters, SearchResult } from '../types';

const initialState: SearchState = {
  query: '',
  results: [],
  loading: false,
  error: null,
  filters: {},
  totalResults: 0,
  hasMore: false,
};

export function useSearch() {
  const [searchState, setSearchState] = useState<SearchState>(initialState);

  const search = useCallback(async (query: string, options: SearchOptions = {}) => {
    if (!query.trim()) {
      setSearchState(prev => ({ ...prev, results: [], totalResults: 0 }));
      return;
    }

    setSearchState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // TODO: Implement actual search API call
      // For now, return mock results
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: `Results for "${query}"`,
          content: 'Mock search result content...',
          author: 'Test Author',
          createdAt: new Date().toISOString(),
          similarity: 0.95,
        },
      ];

      setSearchState(prev => ({
        ...prev,
        results: options.offset ? [...prev.results, ...mockResults] : mockResults,
        loading: false,
        totalResults: mockResults.length,
        hasMore: false,
      }));
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Search failed',
      }));
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState(initialState);
  }, []);

  const setFilters = useCallback((filters: Partial<SearchFilters>) => {
    setSearchState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  const loadMore = useCallback(async () => {
    if (!searchState.hasMore || searchState.loading) return;
    
    await search(searchState.query, {
      offset: searchState.results.length,
      limit: 10,
    });
  }, [searchState.hasMore, searchState.loading, searchState.query, searchState.results.length, search]);

  return {
    searchState,
    search,
    clearSearch,
    setFilters,
    loadMore,
  };
}
