// Homepage feature type definitions

export interface HomepageState {
  isAuthModalOpen: boolean;
  searchQuery: string;
  featuredNotes: Array<{
    id: string;
    title: string;
    preview: string;
    author: string;
    createdAt: string;
  }>;
}

export interface SearchFilters {
  category?: string;
  dateRange?: 'week' | 'month' | 'year';
  sortBy?: 'recent' | 'popular' | 'trending';
}

export interface HeroAction {
  type: 'get-started' | 'explore' | 'search';
  target?: string;
}

// Re-export commonly used global types for convenience
// export type { User } from '@/lib/types/auth';
// export type { Note } from '@/features/notes/types';
