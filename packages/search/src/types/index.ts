// Search Feature Type Definitions

// Local Note interface for search package self-containment
export interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  price: number;
  rating: number;
  views: number;
  purchases: number;
  created_at: string;
  updated_at?: string;
  is_free?: boolean;
  snippet?: string;
  purchase_count?: number;
  view_count?: number;
}

export interface SearchNote extends Note {
  similarity?: number;
  relevanceScore?: number;
  source?: "semantic" | "behavioral" | "collaborative";
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  similarity?: number;
  relevanceScore?: number;
}

export interface SearchFilters {
  category?: string;
  dateRange?: "day" | "week" | "month" | "year" | "all";
  sortBy?: "relevance" | "date" | "popularity" | "similarity";
  author?: string;
  tags?: string[];
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  filters: SearchFilters;
  totalResults: number;
  hasMore: boolean;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  useSemanticSearch?: boolean;
  useHybridSearch?: boolean;
  includePremiumFeatures?: boolean;
}

export interface SearchHook {
  searchState: SearchState;
  search: (query: string, options?: SearchOptions) => Promise<void>;
  clearSearch: () => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  loadMore: () => Promise<void>;
}

// Component Props
export interface SearchComponentProps {
  onSearch?: (query: string) => void;
  onResultClick?: (result: SearchResult) => void;
  placeholder?: string;
  showFilters?: boolean;
  enablePremiumFeatures?: boolean;
  className?: string;
}
