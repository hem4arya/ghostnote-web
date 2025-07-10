# Advanced Search Edge Function - Implementation Guide

## Overview

The Advanced Search system provides a sophisticated AI-powered search experience for the GhostNote marketplace, combining semantic understanding with personalization, popularity metrics, and creator trust factors to deliver the most relevant results.

## Features

- **Semantic Search**: Uses AI embeddings to understand meaning and context
- **Personalization**: Adapts results based on user preferences and history
- **Advanced Ranking**: Multi-factor scoring system for result relevance
- **Trend Analysis**: Incorporates popularity and recency metrics
- **Creator Trust**: Boosts content from verified and trusted creators
- **Intelligent Fallbacks**: Shows trending content when search results are poor

## Architecture

### Edge Function

The search is implemented as a Supabase Edge Function using Deno, which allows for:

- Low-latency responses globally
- Integration with ML models via CDN
- Direct database access for comprehensive search

### Database Components

- `notes` table with vector embeddings
- `search_analytics` for tracking search patterns
- `user_preferences` for personalization
- PostgreSQL functions for scoring and ranking

### Machine Learning Integration

- Uses the Xenova/transformers library via CDN
- Implements the all-MiniLM-L6-v2 model for semantic embeddings
- Singleton pattern for efficient model loading

## Ranking Factors

The search algorithm uses a weighted combination of factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| Content Similarity | 35% | Semantic relevance to the query |
| Popularity | 25% | Based on purchases, views, ratings |
| Recency | 15% | Newer content ranks higher |
| Creator Trust | 15% | Verified creators and trust score |
| Personalization | 10% | User preferences and history |

## API Usage

### Request Format

```typescript
// POST to /functions/v1/advanced-search
{
  "query": "machine learning tutorials",
  "user_id": "optional-user-uuid",
  "category": "Technology",
  "min_rating": 4.0,
  "max_price": 50.0,
  "match_threshold": 0.3,
  "match_count": 20
}
```

### Response Format

```typescript
{
  "query": "machine learning tutorials",
  "total_results": 15,
  "search_results": [
    {
      "id": 123,
      "title": "Complete Machine Learning Guide",
      "body": "Learn ML from basics to advanced...",
      "tags": ["ml", "python", "ai"],
      "category": "Technology",
      "author": "John Doe",
      "keywords": ["machine learning", "AI", "tutorial"],
      "price": 29.99,
      "purchase_count": 156,
      "view_count": 2540,
      "rating": 4.8,
      "review_count": 42,
      "created_at": "2024-01-15T10:30:00Z",
      "is_verified_creator": true,
      "creator_trust_score": 0.92,
      "content_similarity": 0.89,
      "popularity_score": 0.75,
      "recency_score": 1.0,
      "creator_score": 0.88,
      "personalization_score": 0.65,
      "final_score": 0.83
    },
    // Additional results...
  ],
  "fallback_results": [], // Trending notes if main results are poor
  "ranking_factors": {
    "content_match": "35%",
    "popularity": "25%",
    "recency": "15%",
    "creator_trust": "15%",
    "personalization": "10%"
  },
  "search_metadata": {
    "semantic_search": true,
    "personalized": true,
    "filters_applied": {
      "category": "Technology",
      "min_rating": 4.0,
      "max_price": 50.0
    }
  }
}
```

## Implementation Details

### 1. Edge Function Setup

The Edge Function is implemented in TypeScript and runs on Deno:

```typescript
// Key components:
// - ML model integration with transformers.js
// - Supabase client for database access
// - Error handling and fallbacks
// - Query embedding generation
// - Filtering and post-processing
```

### 2. Database Schema

The PostgreSQL function integrates with the following schema:

```sql
-- Key tables:
-- - notes (with vector embeddings)
-- - search_analytics
-- - user_preferences

-- Key function:
-- - advanced_search_notes
-- - update_trending_scores
```

### 3. ML Pipeline

The function uses a singleton pattern for efficient model loading:

```typescript
class PipelineSingleton {
  static task = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2';
  static instance: Pipeline | null = null;

  static async getInstance(): Promise<Pipeline> {
    // Loads model once and reuses it
  }
}
```

## Deployment

### Prerequisites

- Supabase project with Edge Functions enabled
- PostgreSQL with `pgvector` extension
- Tables created according to schema.sql

### Steps

1. Deploy the Edge Function:
   ```bash
   supabase functions deploy advanced-search
   ```

2. Run the SQL script to create necessary database objects:
   ```sql
   \i supabase/functions/advanced-search/schema.sql
   ```

3. Set up a periodic job to update trending scores:
   ```sql
   SELECT cron.schedule('0 * * * *', 'SELECT update_trending_scores()');
   ```

4. Test the function:
   ```bash
   curl -X POST https://your-project.supabase.co/functions/v1/advanced-search \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-anon-key" \
     -d '{"query":"machine learning"}'
   ```

## Frontend Integration

### Basic Search Component

```tsx
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('advanced-search', {
        body: { query }
      });
      
      if (error) throw error;
      setResults(data.search_results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search for notes..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      
      <div className="results">
        {results.map(result => (
          <div key={result.id} className="result-card">
            <h3>{result.title}</h3>
            <p>{result.body.substring(0, 150)}...</p>
            <div className="meta">
              <span>Relevance: {Math.round(result.final_score * 100)}%</span>
              <span>Rating: {result.rating} ⭐</span>
              <span>Price: ${result.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Advanced Search with Filters

```tsx
function AdvancedSearchComponent() {
  const [filters, setFilters] = useState({
    category: '',
    minRating: 0,
    maxPrice: 999999
  });
  
  // Implementation with filter controls
}
```

## Performance Optimization

- **Vector Indexing**: Using IVFFLAT for efficient vector similarity search
- **Caching**: ML model loaded once and reused
- **Pagination**: Configurable result limits
- **Fallbacks**: Multiple search strategies with graceful degradation

## Monitoring

Monitor search performance through the `search_analytics` table:

```sql
-- Most popular searches
SELECT query, COUNT(*) as count 
FROM search_analytics 
GROUP BY query 
ORDER BY count DESC 
LIMIT 10;

-- Search volume over time
SELECT 
  date_trunc('day', created_at) as day, 
  COUNT(*) as searches
FROM search_analytics
GROUP BY day
ORDER BY day DESC;
```

## Troubleshooting

### Common Issues

1. **Slow Search Performance**
   - Check PostgreSQL vector indexes
   - Verify ML model is properly cached
   - Consider adding result limits

2. **Poor Quality Results**
   - Update embeddings for content
   - Adjust scoring weights
   - Check for data quality issues

3. **Edge Function Errors**
   - Verify Deno runtime and dependencies
   - Check Supabase environment variables
   - Monitor for ML model loading issues

## Future Enhancements

- **Query Understanding**: Intent detection for better matching
- **A/B Testing**: Test different ranking factors and weights
- **Real-time Personalization**: Update user preferences based on behavior
- **Semantic Filtering**: Apply filters based on semantic understanding
- **Multi-language Support**: Extend to multiple languages
