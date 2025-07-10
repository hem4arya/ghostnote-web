# Clone Transparency System - Architecture Documentation

## 📋 Table of Contents
- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Component Flow](#component-flow)
- [Data Flow](#data-flow)
- [API Specifications](#api-specifications)
- [Database Schema](#database-schema)
- [Security & Privacy](#security--privacy)

## 🏗️ System Overview

The Clone Transparency System provides buyers with clear information about content originality through a multi-layered architecture that respects creator privacy while ensuring transparency.

### Core Principles
1. **Transparency First**: Clear information about content similarity
2. **Privacy Respecting**: Original creators can remain anonymous
3. **Performance Optimized**: Cached responses and efficient queries
4. **User-Friendly**: Respectful messaging and clear recommendations

## 🎯 Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │   Edge Function  │    │    Database     │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Note Detail │ │───▶│ │ /note-       │ │───▶│ │ Transparency│ │
│ │    Page     │ │    │ │ transparency │ │    │ │  Function   │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │Transparency │ │    │ │   Response   │ │    │ │  Notes &    │ │
│ │   Badge     │ │◀───│ │   Builder    │ │    │ │ Similarity  │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ │    Data     │ │
└─────────────────┘    └──────────────────┘    │ └─────────────┘ │
                                               └─────────────────┘
```

## 🔄 Component Flow

### 1. Request Initiation
```typescript
// User visits note detail page
/notes/[id] → CloneTransparencyWrapperDev → useTransparencyData hook
```

### 2. API Call Chain
```typescript
// React hook triggers API call
useTransparencyData() → fetchNoteTransparency() → Edge Function
```

### 3. Backend Processing
```typescript
// Edge function processes request
Edge Function → getTransparencyData() → Database RPC call
```

### 4. Response Building
```typescript
// Data processing and response generation
Database Result → Classification Logic → Badge Generation → UI Rendering
```

## 📊 Data Flow

### Input Data
```typescript
interface TransparencyRequest {
  note_id: number;
  user_id?: string; // Optional for public viewing
}
```

### Processing Pipeline
1. **Validation**: Check note_id exists and is valid
2. **Database Query**: Call `get_note_transparency_info()` function
3. **Classification**: Determine originality level based on similarity score
4. **Badge Generation**: Create appropriate badge text and severity
5. **Message Creation**: Generate buyer-friendly recommendations

### Output Data
```typescript
interface TransparencyResponse {
  note_id: number;
  is_clone: boolean;
  originality_score: number; // 0-100
  originality_level: 'Original' | 'Modified' | 'Heavily Inspired' | 'Clone';
  similarity_score?: number;
  original_note?: OriginalNoteInfo;
  transparency_badge: BadgeInfo;
  buyer_message: BuyerMessage;
}
```

## 🔧 API Specifications

### Edge Function Endpoint
```
POST /functions/v1/note-transparency
```

### Request Headers
```
Authorization: Bearer <token> (optional)
Content-Type: application/json
```

### Request Body
```json
{
  "note_id": 123,
  "user_id": "optional-user-id"
}
```

### Response Format
```json
{
  "note_id": 123,
  "is_clone": true,
  "originality_score": 65,
  "originality_level": "Modified",
  "similarity_score": 35,
  "original_note": {
    "id": 456,
    "title": "Original Note Title",
    "creator_id": "creator-uuid",
    "creator_username": "originalauthor",
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
    "description": "This note builds upon existing content with substantial modifications...",
    "recommendation": "This appears to offer meaningful additions..."
  }
}
```

### Error Responses
```json
{
  "error": "note_id is required"
}
```

## 🗄️ Database Schema

### Core Function
```sql
CREATE OR REPLACE FUNCTION get_note_transparency_info(
  p_note_id INTEGER,
  p_requesting_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  is_clone BOOLEAN,
  similarity_score DECIMAL,
  original_note_id INTEGER,
  original_note_title TEXT,
  original_creator_id UUID,
  original_creator_username TEXT,
  original_creator_is_public BOOLEAN,
  original_created_at TIMESTAMP WITH TIME ZONE
)
```

### Public View
```sql
CREATE VIEW public_note_transparency AS
SELECT 
  note_id,
  original_note_id,
  similarity_score,
  CASE 
    WHEN creator_privacy_settings.show_in_transparency = true 
    THEN original_note_title 
    ELSE NULL 
  END as visible_title
FROM note_similarity_data
JOIN privacy_settings ON original_creator_id = user_id;
```

### Indexes
```sql
-- Performance optimization
CREATE INDEX idx_note_similarity_note_id ON note_similarity_data(note_id);
CREATE INDEX idx_note_similarity_original ON note_similarity_data(original_note_id);
```

## 🔒 Security & Privacy

### Privacy Protection
1. **Creator Anonymity**: Original creators can opt for private transparency
2. **Selective Disclosure**: Only public information is shared
3. **User Consent**: Respects creator privacy preferences

### Security Measures
1. **Input Validation**: All inputs validated before processing
2. **SQL Injection Prevention**: Using parameterized queries
3. **Rate Limiting**: Built into Supabase Edge Functions
4. **CORS Protection**: Proper headers for cross-origin requests

### Data Access Control
```typescript
// Privacy-respecting data access
const isPublic = cloneInfo.original_creator_is_public;
const username = isPublic ? cloneInfo.original_creator_username : undefined;
```

## 📈 Performance Considerations

### Caching Strategy
- **Client-side**: 5-minute cache for transparency data
- **Response optimization**: Minimal data transfer
- **Database**: Indexed queries for fast lookups

### Monitoring Points
1. **API Response Time**: Target < 200ms
2. **Cache Hit Rate**: Target > 80%
3. **Error Rate**: Target < 1%
4. **Database Query Performance**: Monitor slow queries

## 🔄 Future Enhancements

### Planned Features
1. **Real-time Updates**: WebSocket notifications for transparency changes
2. **Batch Processing**: Multiple note transparency in single request
3. **Analytics Dashboard**: Creator insights on transparency views
4. **ML Integration**: Improved similarity detection algorithms

### Scalability Considerations
1. **Horizontal Scaling**: Edge function auto-scaling
2. **Database Optimization**: Query performance monitoring
3. **CDN Integration**: Global response caching
4. **Load Balancing**: Multi-region deployment

---

**Last Updated**: July 10, 2025  
**Version**: 1.0.0  
**Maintainer**: GhostNote Development Team
