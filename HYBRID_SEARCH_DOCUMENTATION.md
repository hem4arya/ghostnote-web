# Hybrid Search Edge Function - Complete Implementation

## Overview

This Edge Function implements a sophisticated hybrid search system that combines semantic search, full-text search, and fuzzy matching to provide the best possible search experience for the GhostNote marketplace.

## Features

### Core Search Types
- **Semantic Search**: Uses AI embeddings to understand meaning and context
- **Full-text Search**: Traditional keyword-based search with PostgreSQL's built-in capabilities
- **Fuzzy Search**: Handles typos and approximate matches using similarity algorithms
- **Hybrid Search**: Combines all three approaches with weighted scoring

### Advanced Features
- **Intelligent Fallbacks**: Shows trending content when search results are poor
- **Smart Suggestions**: Provides related queries, categories, and trending tags
- **Performance Analytics**: Tracks search performance and user behavior
- **Flexible Filtering**: Category, rating, price, and custom filters
- **Error Handling**: Graceful degradation when services are unavailable

## Files Structure

```
supabase/functions/hybrid-search/
├── index.ts          # Main Edge Function implementation
├── deno.json         # Deno configuration for the function
├── deno.d.ts         # TypeScript declarations for Deno
└── schema.sql        # Database schema and functions

supabase/functions/_shared/
└── cors.ts           # CORS headers configuration
```

## API Usage

### Request Format

```typescript
POST /functions/v1/hybrid-search

{
  "query": "machine learning tutorials",
  "user_id": "optional-user-uuid",
  "category": "Technology",
  "min_rating": 4.0,
  "max_price": 50.0,
  "search_type": "hybrid", // semantic | fulltext | fuzzy | hybrid
  "match_threshold": 0.3,
  "match_count": 20,
  "include_analytics": true
}
```

### Response Format

```typescript
{
  "query": "machine learning tutorials",
  "search_type": "hybrid",
  "execution_time_ms": 145,
  "total_results": 15,
  "search_results": [
    {
      "id": 123,
      "title": "Complete Machine Learning Guide",
      "body": "Learn ML from basics to advanced...",
      "tags": ["ml", "python", "ai"],
      "category": "Technology",
      "author": "John Doe",
      "price": 29.99,
      "rating": 4.8,
      "review_count": 156,
      "created_at": "2024-01-15T10:30:00Z",
      "semantic_score": 0.85,
      "fulltext_score": 0.92,
      "fuzzy_score": 0.78,
      "combined_score": 0.87,
      "trending_score": 95.5
    }
  ],
  "fallback_results": [], // Trending notes if main results are poor
  "search_suggestions": {
    "popular_queries": ["machine learning basics", "ML algorithms"],
    "related_categories": ["Technology", "Education", "Data Science"],
    "trending_tags": ["python", "ai", "neural-networks"]
  },
  "search_metadata": {
    "used_semantic": true,
    "used_fulltext": true,
    "used_fuzzy": true,
    "filters_applied": {
      "category": "Technology",
      "min_rating": 4.0,
      "max_price": null
    }
  },
  "performance_tips": [
    "Try using more specific terms for better results"
  ]
}
```

## Technical Implementation

### 1. Machine Learning Pipeline

The function uses the Xenova/transformers library to generate embeddings:

```typescript
// Singleton pattern for efficient model loading
class PipelineSingleton {
  static async getInstance(): Promise<Pipeline> {
    // Loads all-MiniLM-L6-v2 model for semantic embeddings
    // Model is cached after first load for performance
  }
}
```

### 2. Database Integration

The hybrid search uses a PostgreSQL function that combines multiple search strategies:

```sql
-- Main search function with weighted scoring
CREATE FUNCTION hybrid_search_notes(
  search_query TEXT,
  query_embedding vector(384),
  -- ... other parameters
)
RETURNS TABLE (
  -- Combined results with scores
)
```

### 3. Error Handling

- **Graceful Degradation**: If embedding generation fails, falls back to text-only search
- **Timeout Protection**: Prevents long-running searches from hanging
- **Fallback Content**: Shows trending notes when search results are poor
- **Analytics Failures**: Search continues even if analytics tracking fails

### 4. Performance Optimizations

- **Model Caching**: ML model loaded once and reused
- **Database Indexes**: Optimized for vector similarity and text search
- **Parallel Processing**: Multiple search strategies run concurrently
- **Result Limiting**: Configurable result counts to prevent large responses

## Deployment Instructions

### 1. Database Setup

Run the schema.sql file to create necessary tables and functions:

```sql
-- This creates all required tables, indexes, and functions
\i supabase/functions/hybrid-search/schema.sql
```

### 2. Deploy the Edge Function

```bash
# Deploy to Supabase
supabase functions deploy hybrid-search

# Test the function
supabase functions invoke hybrid-search --data '{"query":"test search"}'
```

### 3. Environment Variables

Ensure these are set in your Supabase project:
- `SUPABASE_URL`: Your project URL
- `SUPABASE_ANON_KEY`: Public API key

### 4. Enable Extensions

Make sure these PostgreSQL extensions are enabled:
- `vector`: For embedding storage and similarity search
- `pg_trgm`: For fuzzy text matching

## Frontend Integration

### Basic Search

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

const searchNotes = async (query: string) => {
  const { data, error } = await supabase.functions.invoke('hybrid-search', {
    body: { query, search_type: 'hybrid' }
  });
  
  return data;
};
```

### Advanced Search with Filters

```typescript
const advancedSearch = async (searchParams: HybridSearchRequest) => {
  const { data, error } = await supabase.functions.invoke('hybrid-search', {
    body: searchParams
  });
  
  if (error) throw error;
  return data;
};
```

## Monitoring and Analytics

The system automatically tracks:
- Search query patterns
- Performance metrics
- User behavior
- Popular categories and tags

Query the `search_performance` table for insights:

```sql
-- Most popular searches
SELECT query, COUNT(*) as frequency 
FROM search_performance 
GROUP BY query 
ORDER BY frequency DESC;

-- Average search performance
SELECT AVG(execution_time_ms) as avg_time,
       AVG(results_count) as avg_results
FROM search_performance;
```

## Troubleshooting

### Common Issues

1. **Embedding Generation Fails**
   - Check internet connectivity for CDN model downloads
   - Verify transformers library is accessible
   - Function falls back to text-only search automatically

2. **Slow Performance**
   - Check database indexes are created
   - Monitor function execution time
   - Consider reducing match_count for faster responses

3. **No Results**
   - System automatically provides fallback trending content
   - Check search suggestions for alternative queries
   - Verify database has content and proper indexes

4. **TypeScript Errors**
   - Ensure Deno type declarations are properly configured
   - Use @ts-expect-error for external CDN imports
   - Verify CORS configuration is correct

### Performance Tips

- Use specific search terms for better semantic matching
- Enable trending score updates with periodic function calls
- Monitor search analytics to optimize query patterns
- Consider caching popular search results

## Future Enhancements

- **Personalized Search**: Use user behavior to improve results
- **Real-time Updates**: Live search suggestions as user types
- **Advanced Filtering**: More sophisticated filter combinations
- **Search Result Caching**: Cache popular queries for faster responses
- **A/B Testing**: Test different search strategies and weights
