# Search Notes Edge Function - Documentation

## Overview

The Search Notes Edge Function provides semantic search capabilities for the GhostNote marketplace using AI-powered vector embeddings. It enables users to find relevant notes based on meaning and context rather than just keyword matching.

## Features

- **Semantic Search**: Uses AI embeddings to understand query meaning
- **Vector Similarity**: Finds content based on conceptual similarity
- **Configurable Parameters**: Adjustable similarity thresholds and result limits
- **Performance Optimized**: Singleton model loading and vector indexing
- **Type Safe**: Comprehensive TypeScript interfaces and error handling

## Technical Implementation

### Architecture

```typescript
// Core components:
// 1. ML Pipeline (Xenova/transformers) for embedding generation
// 2. PostgreSQL with pgvector for similarity search
// 3. Supabase Edge Function for API endpoint
// 4. Singleton pattern for model efficiency
```

### Model Details

- **Model**: `Xenova/all-MiniLM-L6-v2`
- **Embedding Size**: 384 dimensions
- **Similarity Metric**: Cosine similarity
- **Search Index**: IVFFLAT vector index

## API Usage

### Request Format

```typescript
POST /functions/v1/search-notes

{
  "query": "machine learning tutorials",
  "match_threshold": 0.7,    // Optional: similarity threshold (0-1)
  "match_count": 10          // Optional: max results to return
}
```

### Response Format

**Success Response (200):**
```typescript
{
  "query": "machine learning tutorials",
  "notes": [
    {
      "id": 123,
      "title": "Complete Machine Learning Guide",
      "body": "This comprehensive guide covers...",
      "tags": ["ml", "python", "ai"],
      "category": "Technology",
      "author": "John Doe",
      "price": 29.99,
      "rating": 4.8,
      "review_count": 42,
      "created_at": "2024-01-15T10:30:00Z",
      "similarity": 0.89
    }
    // Additional results...
  ],
  "total_results": 5,
  "search_metadata": {
    "match_threshold": 0.7,
    "match_count": 10,
    "embedding_dimensions": 384,
    "semantic_search": true
  }
}
```

**Error Response (400/500):**
```typescript
{
  "error": "Search failed",
  "details": "Specific error message"
}
```

## Database Requirements

### Prerequisites

The function requires a PostgreSQL database with:

1. **Vector Extension**: `pgvector` for similarity search
2. **Notes Table**: With embedding column
3. **Search Function**: `match_notes` for efficient querying

### Database Schema

```sql
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to notes
ALTER TABLE notes ADD COLUMN embedding vector(384);

-- Create vector index for performance
CREATE INDEX idx_notes_embedding ON notes 
USING ivfflat (embedding vector_cosine_ops);

-- Search function
CREATE FUNCTION match_notes(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
) RETURNS TABLE (...);
```

## Use Cases

### 1. Semantic Content Discovery

Find notes based on conceptual similarity:

```typescript
// User searches for "AI tutorials"
// Function finds notes about:
// - "Machine Learning Basics"
// - "Neural Network Introduction" 
// - "Artificial Intelligence Guide"
// Even if they don't contain exact keywords
```

### 2. Related Content Suggestions

Show similar notes to current content:

```typescript
const findSimilarNotes = async (currentNoteId: number) => {
  // Get current note content
  const { data: note } = await supabase
    .from('notes')
    .select('title, body')
    .eq('id', currentNoteId)
    .single();

  // Search for similar content
  const { data } = await supabase.functions.invoke('search-notes', {
    body: { 
      query: `${note.title} ${note.body}`,
      match_count: 5
    }
  });

  return data.notes.filter(n => n.id !== currentNoteId);
};
```

### 3. Smart Search Interface

Enhance search UX with semantic capabilities:

```typescript
const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('search-notes', {
        body: { query, match_threshold: 0.6 }
      });
      setResults(data.notes);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Describe what you're looking for..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      
      <div className="results">
        {results.map(note => (
          <div key={note.id} className="result-card">
            <h3>{note.title}</h3>
            <p>{note.body.substring(0, 150)}...</p>
            <div className="meta">
              <span>Relevance: {Math.round(note.similarity * 100)}%</span>
              <span>Rating: {note.rating} ⭐</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Performance Optimization

### Model Loading Strategy

```typescript
// Singleton pattern ensures model loads once
class PipelineSingleton {
  static instance: Pipeline | null = null;
  
  static async getInstance(): Promise<Pipeline> {
    // Model cached after first load
    // Subsequent requests ~100x faster
  }
}
```

### Database Optimization

```sql
-- Vector index configuration
CREATE INDEX CONCURRENTLY idx_notes_embedding 
ON notes USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Query optimization
EXPLAIN ANALYZE 
SELECT * FROM match_notes('[...]'::vector, 0.7, 10);
```

### Performance Metrics

- **Cold Start**: ~2-3 seconds (first request with model loading)
- **Warm Requests**: ~200-500ms (cached model)
- **Vector Search**: ~10-50ms (with proper indexing)
- **Memory Usage**: ~200MB (model cache)

## Error Handling

### Input Validation

```typescript
// Validates query parameter
if (!query || typeof query !== 'string' || query.trim().length === 0) {
  return badRequest('Query parameter is required');
}
```

### ML Pipeline Errors

```typescript
// Graceful handling of model loading failures
try {
  const extractor = await PipelineSingleton.getInstance();
  // Generate embedding
} catch (error) {
  console.error('ML pipeline failed:', error);
  throw new Error('Embedding generation failed');
}
```

### Database Errors

```typescript
// Handle database connection and query errors
const { data: notes, error } = await supabaseClient.rpc('match_notes', {
  query_embedding: embedding,
  match_threshold,
  match_count
});

if (error) {
  console.error('Database search error:', error);
  throw error;
}
```

## Security Considerations

### Authentication

```typescript
// Uses Supabase authentication automatically
const supabaseClient = createClient(url, key, {
  global: { 
    headers: { Authorization: req.headers.get('Authorization') || '' }
  }
});
```

### Row Level Security

```sql
-- Ensure users can only search public notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public notes are searchable" ON notes
  FOR SELECT USING (is_public = true);
```

### Rate Limiting

Consider implementing rate limiting for production:

```typescript
// Example rate limiting middleware
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};
```

## Deployment

### Deploy Function

```bash
# Deploy to Supabase
supabase functions deploy search-notes
```

### Setup Database

```bash
# Run schema setup
psql -f supabase/functions/search-notes/schema.sql
```

### Test Deployment

```bash
# Test with sample query
curl -X POST https://your-project.supabase.co/functions/v1/search-notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-anon-key" \
  -d '{"query":"machine learning"}'
```

## Monitoring

### Key Metrics

Monitor these metrics for optimal performance:

1. **Response Time**: Track search latency
2. **Success Rate**: Monitor error rates
3. **Usage Patterns**: Analyze popular queries
4. **Resource Usage**: Memory and CPU utilization

### Logging

```typescript
// Function logs important events
console.log('Search query:', query);
console.log('Results found:', notes.length);
console.error('Search error:', error);
```

### Analytics

Track search analytics for insights:

```sql
-- Popular search terms
SELECT query, COUNT(*) as frequency
FROM search_logs
GROUP BY query
ORDER BY frequency DESC;

-- Search performance over time
SELECT date_trunc('hour', created_at), AVG(response_time_ms)
FROM search_logs
GROUP BY 1
ORDER BY 1 DESC;
```

## Troubleshooting

### Common Issues

1. **No Results Found**
   - Check embedding generation
   - Verify database has indexed content
   - Lower match_threshold value

2. **Slow Performance**
   - Ensure vector index is created
   - Check model caching is working
   - Monitor database query performance

3. **Model Loading Errors**
   - Verify CDN accessibility
   - Check network connectivity
   - Monitor function memory limits

### Debug Tools

```typescript
// Enable debug logging
const DEBUG = true;

if (DEBUG) {
  console.log('Embedding dimensions:', embedding.length);
  console.log('Search parameters:', { match_threshold, match_count });
  console.log('Database results:', notes.length);
}
```

## Future Enhancements

- **Multi-language Support**: Support for multiple languages
- **Query Expansion**: Automatic query enhancement
- **Result Ranking**: Advanced ranking algorithms
- **Caching Layer**: Redis cache for popular queries
- **Hybrid Search**: Combine semantic and keyword search
