// Homepage utility functions

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  tags: string[];
  rating: number;
}

export interface SearchFilters {
  category?: string;
  timeRange?: "week" | "month" | "year" | "all";
  sortBy?: "relevance" | "recent" | "popular" | "rating";
}

/**
 * Formats search query for better results
 */
export function formatSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

/**
 * Filters search results based on criteria
 */
export function filterSearchResults(
  results: SearchResult[], 
  filters: SearchFilters
): SearchResult[] {
  let filtered = [...results];

  if (filters.category && filters.category !== "all") {
    filtered = filtered.filter(result => 
      result.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  if (filters.timeRange && filters.timeRange !== "all") {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (filters.timeRange) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    filtered = filtered.filter(result => 
      new Date(result.publishedAt) >= cutoffDate
    );
  }

  // Sort results
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "recent":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case "rating":
          return b.rating - a.rating;
        case "popular":
          // Assuming we have a popularity score (for now using rating as proxy)
          return b.rating - a.rating;
        default: // relevance
          return 0; // Would implement relevance scoring
      }
    });
  }

  return filtered;
}

/**
 * Highlights search terms in text
 */
export function highlightSearchTerms(text: string, searchQuery: string): string {
  if (!searchQuery.trim()) return text;
  
  const terms = searchQuery.split(" ").filter(term => term.length > 0);
  let highlightedText = text;
  
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, "gi");
    highlightedText = highlightedText.replace(
      regex, 
      '<mark class="bg-ghost-neon/20 text-ghost-neon">$1</mark>'
    );
  });
  
  return highlightedText;
}

/**
 * Generates search suggestions based on query
 */
export function generateSearchSuggestions(query: string): string[] {
  const suggestions: Record<string, string[]> = {
    "tech": ["technology", "programming", "software", "web development"],
    "design": ["ui design", "ux design", "graphic design", "design systems"],
    "business": ["entrepreneurship", "marketing", "strategy", "finance"],
    "ai": ["artificial intelligence", "machine learning", "neural networks"],
    "react": ["react hooks", "react components", "next.js", "react state"],
  };

  const lowercaseQuery = query.toLowerCase();
  
  for (const [key, values] of Object.entries(suggestions)) {
    if (lowercaseQuery.includes(key)) {
      return values;
    }
  }
  
  return [];
}

/**
 * Tracks search analytics (placeholder for real implementation)
 */
export function trackSearch(query: string, resultsCount: number): void {
  // In a real app, this would send data to analytics service
  console.log("Search tracked:", { query, resultsCount, timestamp: new Date() });
}
