# Generate Embedding Edge Function - Documentation

## Overview

The Generate Embedding Edge Function is a utility service that converts text into high-dimensional vector embeddings using AI models. These embeddings are essential for semantic search, content similarity, and other AI-powered features in the GhostNote marketplace.

## Features

- **Text-to-Vector Conversion**: Transforms any text into 384-dimensional embeddings
- **Singleton Model Loading**: Efficient model caching for better performance
- **Error Handling**: Comprehensive error handling and validation
- **Input Validation**: Ensures text input is valid and non-empty
- **Response Metadata**: Includes embedding dimensions and text confirmation

## Technical Implementation

### Machine Learning Model

- **Model**: `Xenova/all-MiniLM-L6-v2`
- **Type**: Sentence transformer for semantic embeddings
- **Dimensions**: 384-dimensional vectors
- **Normalization**: L2 normalized with mean pooling

### Architecture

```typescript
// Singleton pattern for efficient model loading
class PipelineSingleton {
  static async getInstance(): Promise<Pipeline> {
    // Loads model once and reuses for all requests
  }
}
```

## API Usage

### Request Format

```typescript
POST /functions/v1/generate-embedding

{
  "text": "Your text content to convert into embeddings"
}
```

### Response Format

**Success Response (200):**
```typescript
{
  "embedding": [0.1234, -0.5678, 0.9012, ...], // 384-dimensional array
  "text": "Your text content to convert into...",     // Truncated echo (max 100 chars)
  "dimensions": 384                               // Vector dimensions
}
```

**Error Response (400/500):**
```typescript
{
  "error": "Error description",
  "details": "Additional error details"
}
```

### Input Validation

The function validates:
- Text parameter is present
- Text is a non-empty string
- Text contains non-whitespace characters

## Use Cases

### 1. Search Index Generation

Generate embeddings for content to enable semantic search:

```typescript
// Generate embedding for a note
const { data } = await supabase.functions.invoke('generate-embedding', {
  body: { text: noteContent }
});

// Store in database with vector column
await supabase
  .from('notes')
  .update({ embedding: data.embedding })
  .eq('id', noteId);
```

### 2. Content Similarity

Compare content similarity using cosine similarity:

```typescript
const similarity = (a: number[], b: number[]) => {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};
```

### 3. Batch Processing

Process multiple texts efficiently:

```typescript
const generateEmbeddings = async (texts: string[]) => {
  const embeddings = [];
  for (const text of texts) {
    const { data } = await supabase.functions.invoke('generate-embedding', {
      body: { text }
    });
    embeddings.push(data.embedding);
  }
  return embeddings;
};
```

## Performance Characteristics

### Response Times
- **First Request**: ~2-3 seconds (model loading)
- **Subsequent Requests**: ~100-300ms (cached model)
- **Text Length Impact**: Minimal for typical content

### Resource Usage
- **Memory**: ~200MB for model caching
- **CPU**: Moderate during embedding generation
- **Network**: CDN model download on first load

### Optimization Tips
- Keep the function warm with periodic calls
- Batch similar requests when possible
- Cache embeddings in your database

## Error Handling

### Common Errors

1. **Empty Text Input**
   ```json
   {
     "error": "Text parameter is required and must be a non-empty string"
   }
   ```

2. **Model Loading Failure**
   ```json
   {
     "error": "Failed to generate embedding",
     "details": "ML pipeline initialization failed"
   }
   ```

3. **Invalid Request Format**
   ```json
   {
     "error": "Failed to generate embedding",
     "details": "Invalid JSON in request body"
   }
   ```

### Error Recovery

The function implements several error recovery mechanisms:
- Graceful handling of model loading failures
- Input validation with clear error messages
- Proper HTTP status codes for different error types

## Integration Examples

### React Hook

```typescript
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const useEmbedding = () => {
  const [loading, setLoading] = useState(false);
  const supabase = createClient(url, key);

  const generateEmbedding = async (text: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-embedding', {
        body: { text }
      });
      
      if (error) throw error;
      return data.embedding;
    } catch (err) {
      console.error('Embedding generation failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateEmbedding, loading };
};
```

### Node.js Script

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function processContentEmbeddings() {
  const { data: notes } = await supabase
    .from('notes')
    .select('id, title, body')
    .is('embedding', null);

  for (const note of notes) {
    const content = `${note.title} ${note.body}`;
    
    const { data: embeddingData } = await supabase.functions.invoke('generate-embedding', {
      body: { text: content }
    });

    await supabase
      .from('notes')
      .update({ embedding: embeddingData.embedding })
      .eq('id', note.id);

    console.log(`Processed note ${note.id}`);
  }
}
```

## Deployment

### Deploy Function

```bash
supabase functions deploy generate-embedding
```

### Test Deployment

```bash
# Test with sample text
curl -X POST https://your-project.supabase.co/functions/v1/generate-embedding \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-anon-key" \
  -d '{"text":"Hello world"}'
```

### Environment Setup

No additional environment variables required. The function uses:
- Supabase runtime environment
- CDN-hosted ML model
- Automatic CORS handling

## Monitoring and Debugging

### Performance Monitoring

Monitor function performance through Supabase dashboard:
- Execution time per request
- Memory usage patterns
- Error rates and types

### Debug Logging

The function logs important events:
- Model loading success/failure
- Request validation errors
- Embedding generation metrics

### Health Checks

Implement periodic health checks:

```typescript
const healthCheck = async () => {
  try {
    const { data } = await supabase.functions.invoke('generate-embedding', {
      body: { text: 'health check' }
    });
    return data.embedding.length === 384;
  } catch {
    return false;
  }
};
```

## Security Considerations

- **Input Sanitization**: Text input is validated but not sanitized
- **Rate Limiting**: Consider implementing rate limiting for production
- **Authentication**: Uses Supabase authentication automatically
- **CORS**: Properly configured for browser requests

## Future Enhancements

- **Batch Processing**: Support multiple texts in single request
- **Model Selection**: Allow different embedding models
- **Caching Layer**: Redis cache for frequently requested embeddings
- **Compression**: Optional embedding compression for storage efficiency
