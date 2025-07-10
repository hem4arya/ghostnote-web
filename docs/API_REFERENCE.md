# API Reference - Clone Transparency

## 📊 Overview

The Clone Transparency API provides information about content originality and similarity for notes in the GhostNote platform. This API respects creator privacy while giving buyers the transparency they need to make informed decisions.

## 🌐 Base URL
```
https://your-project.supabase.co/functions/v1/
```

## 🔐 Authentication

### Optional Authentication
The API works with both authenticated and anonymous requests:

```typescript
// Authenticated request (provides user-specific data)
headers: {
  'Authorization': 'Bearer <user_jwt_token>',
  'Content-Type': 'application/json'
}

// Anonymous request (public data only)
headers: {
  'Content-Type': 'application/json'
}
```

## 📋 Endpoints

### POST /note-transparency

Retrieves transparency information for a specific note.

#### Request
```typescript
POST /functions/v1/note-transparency
Content-Type: application/json

{
  "note_id": number,        // Required: ID of the note to analyze
  "user_id": string         // Optional: User ID for personalized response
}
```

#### Response Success (200)
```typescript
{
  "note_id": number,
  "is_clone": boolean,
  "originality_score": number,          // 0-100, where 100 is completely original
  "originality_level": string,          // "Original" | "Modified" | "Heavily Inspired" | "Clone"
  "similarity_score": number,           // 0-100, only present if is_clone is true
  "original_note": {                    // Only present if is_clone is true
    "id": number,
    "title": string,
    "creator_id": string,
    "creator_username": string,         // Only if creator_is_public is true
    "creator_is_public": boolean,
    "created_at": string               // ISO 8601 timestamp
  },
  "transparency_badge": {
    "text": string,                     // Display text for the badge
    "severity": string,                // "none" | "low" | "medium" | "high"
    "show_source_link": boolean       // Whether to show link to original
  },
  "buyer_message": {
    "title": string,                  // Message title for buyers
    "description": string,            // Detailed explanation
    "recommendation": string          // Purchase recommendation
  }
}
```

#### Response Error (400)
```typescript
{
  "error": "note_id is required"
}
```

#### Response Error (404)
```typescript
{
  "error": "Note not found"
}
```

#### Response Error (500)
```typescript
{
  "error": "Internal server error message"
}
```

## 📝 Request Examples

### Basic Request (Anonymous)
```bash
curl -X POST https://your-project.supabase.co/functions/v1/note-transparency \
  -H "Content-Type: application/json" \
  -d '{"note_id": 123}'
```

### Authenticated Request
```bash
curl -X POST https://your-project.supabase.co/functions/v1/note-transparency \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"note_id": 123, "user_id": "user-uuid-here"}'
```

### JavaScript/TypeScript Example
```typescript
async function fetchTransparency(noteId: number, userToken?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }
  
  const response = await fetch('/functions/v1/note-transparency', {
    method: 'POST',
    headers,
    body: JSON.stringify({ note_id: noteId })
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}
```

## 📊 Response Examples

### Original Content
```json
{
  "note_id": 123,
  "is_clone": false,
  "originality_score": 100,
  "originality_level": "Original",
  "transparency_badge": {
    "text": "Original Content",
    "severity": "none",
    "show_source_link": false
  },
  "buyer_message": {
    "title": "Original Content",
    "description": "This note contains original content created by the author.",
    "recommendation": "You're purchasing authentic, original work."
  }
}
```

### Modified Content (Low Similarity)
```json
{
  "note_id": 456,
  "is_clone": true,
  "originality_score": 65,
  "originality_level": "Modified",
  "similarity_score": 35,
  "original_note": {
    "id": 789,
    "title": "JavaScript Best Practices Guide",
    "creator_id": "user-123",
    "creator_username": "jsexpert",
    "creator_is_public": true,
    "created_at": "2024-12-15T10:30:00Z"
  },
  "transparency_badge": {
    "text": "35% Match – View Source",
    "severity": "low",
    "show_source_link": true
  },
  "buyer_message": {
    "title": "Modified Content",
    "description": "This note builds upon existing content by jsexpert with substantial modifications and 65% original material.",
    "recommendation": "This appears to offer meaningful additions or a fresh take on the source material."
  }
}
```

### High Similarity Content
```json
{
  "note_id": 789,
  "is_clone": true,
  "originality_score": 15,
  "originality_level": "Clone",
  "similarity_score": 85,
  "original_note": {
    "id": 101,
    "title": "React Hooks Deep Dive",
    "creator_id": "user-456",
    "creator_username": "reactpro",
    "creator_is_public": true,
    "created_at": "2024-11-20T14:15:00Z"
  },
  "transparency_badge": {
    "text": "85% Match – View Source",
    "severity": "high",
    "show_source_link": true
  },
  "buyer_message": {
    "title": "Near-Identical Content",
    "description": "This note is 85% similar to existing content by reactpro. It may contain minimal modifications or additions.",
    "recommendation": "Consider checking the original source before purchasing. This content may be available elsewhere."
  }
}
```

### Private Original Creator
```json
{
  "note_id": 999,
  "is_clone": true,
  "originality_score": 30,
  "originality_level": "Heavily Inspired",
  "similarity_score": 70,
  "original_note": {
    "id": 555,
    "title": "Advanced TypeScript Patterns",
    "creator_id": "private-user",
    "creator_is_public": false,
    "created_at": "2024-10-10T09:00:00Z"
  },
  "transparency_badge": {
    "text": "70% Match – Source Private",
    "severity": "medium",
    "show_source_link": false
  },
  "buyer_message": {
    "title": "Heavily Inspired Content",
    "description": "This note draws significantly from existing content, with 30% original additions or modifications. The original creator prefers to remain private.",
    "recommendation": "This may offer a different perspective or additional insights on familiar material."
  }
}
```

## 🏷️ Classification Logic

### Originality Levels
The API classifies content based on similarity scores:

| Similarity Score | Originality Level | Originality Score | Description |
|------------------|-------------------|-------------------|-------------|
| 0-49% | Original | 51-100% | Mostly original content |
| 50-69% | Modified | 31-50% | Significant modifications |
| 70-89% | Heavily Inspired | 11-30% | Heavy inspiration from source |
| 90-100% | Clone | 0-10% | Near-identical content |

### Badge Severity Mapping
| Similarity Score | Severity | Badge Color | User Action |
|------------------|----------|-------------|-------------|
| 0-49% | `low` | Green | Minimal concern |
| 50-69% | `medium` | Yellow | Moderate awareness |
| 70-100% | `high` | Red | Strong caution |

## 🔧 Rate Limiting

### Limits
- **Anonymous requests**: 60 requests per minute per IP
- **Authenticated requests**: 120 requests per minute per user
- **Burst limit**: 10 requests per second

### Headers
The API returns rate limit information in response headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1641024000
```

## 💾 Caching

### Response Caching
- **Cache Duration**: 5 minutes for transparency data
- **Cache Key**: Based on `note_id` and `user_id`
- **Cache Headers**: Standard HTTP cache headers included

### Client-Side Caching Recommendation
```typescript
// Recommended caching strategy
const cacheKey = `transparency_${noteId}_${userId || 'anonymous'}`;
const cachedData = localStorage.getItem(cacheKey);

if (cachedData) {
  const { data, timestamp } = JSON.parse(cachedData);
  if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 minutes
    return data;
  }
}
```

## 🔒 Privacy & Security

### Data Privacy
- **Creator Privacy**: Respects creator privacy settings
- **Selective Disclosure**: Only shows public information
- **Anonymous Browsing**: Supports anonymous requests

### Security Features
- **Input Validation**: All inputs validated
- **SQL Injection Protection**: Parameterized queries only
- **CORS Protection**: Appropriate CORS headers
- **Rate Limiting**: Prevents abuse

## 🐛 Error Handling

### Error Response Format
```typescript
{
  "error": string,          // Human-readable error message
  "code"?: string,          // Error code for programmatic handling
  "details"?: object        // Additional error details
}
```

### Common Error Codes
| Status | Error Message | Cause | Solution |
|--------|---------------|-------|----------|
| 400 | "note_id is required" | Missing note_id | Include note_id in request |
| 404 | "Note not found" | Invalid note_id | Verify note exists |
| 429 | "Rate limit exceeded" | Too many requests | Implement backoff |
| 500 | "Internal server error" | Server issue | Retry or contact support |

### Recommended Error Handling
```typescript
try {
  const data = await fetchTransparency(noteId);
  return data;
} catch (error) {
  if (error.status === 404) {
    // Note doesn't exist, handle gracefully
    return null;
  }
  if (error.status === 429) {
    // Rate limited, implement backoff
    await new Promise(resolve => setTimeout(resolve, 60000));
    return fetchTransparency(noteId);
  }
  // Log error but don't break user experience
  console.error('Transparency API error:', error);
  return null;
}
```

## 🧪 Testing

### Test Environment
```
https://your-test-project.supabase.co/functions/v1/note-transparency
```

### Mock Data
Use these test note IDs for different scenarios:
- `note_id: 1` → Original content
- `note_id: 2` → Modified content (35% similarity)
- `note_id: 3` → Heavily inspired (60% similarity)
- `note_id: 4` → Clone content (85% similarity)
- `note_id: 5` → Private original creator

---

**API Version**: 1.0.0  
**Last Updated**: July 10, 2025  
**Status**: Production Ready
