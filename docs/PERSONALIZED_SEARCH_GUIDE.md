# Personalized Search Integration Guide

This document explains how to use the new personalized search functionality in GhostNote.

## Overview

The personalized search system provides:
- **Semantic Search**: Vector-based similarity matching
- **Behavioral Recommendations**: Based on user's interaction history
- **Collaborative Filtering**: Based on similar users' preferences  
- **Fallback Content**: Popular/trending notes for new users

## Components

### 1. IntelligentSearch.tsx (Enhanced)

The main search component now includes:
- User authentication detection
- Personalized search for logged-in users
- Fallback to basic search for anonymous users
- Result filtering by source (semantic, behavioral, collaborative)
- Enhanced UI with result type indicators

**Usage:**
```tsx
import IntelligentSearch from '@/components/IntelligentSearch';

// Basic usage (same as before)
<IntelligentSearch />

// With custom placeholder
<IntelligentSearch 
  placeholder="Search personalized notes..."
  className="my-custom-class"
/>
```

### 2. PersonalizedRecommendations.tsx (New)

A dedicated component for showing personalized recommendations:

**Usage:**
```tsx
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations';

// Basic recommendations carousel
<PersonalizedRecommendations />

// Customized recommendations
<PersonalizedRecommendations 
  limit={9}
  showHeader={false}
  className="mb-8"
/>
```

## Backend Edge Functions

### personalized-search

**Endpoint:** `/functions/v1/personalized-search`

**Request Body:**
```json
{
  "user_id": "uuid",
  "query": "search terms",
  "include_behavioral": true,
  "include_collaborative": true,
  "limit": 10
}
```

**Response:**
```json
{
  "semantic_results": [...],
  "behavioral_results": [...],
  "collaborative_results": [...],
  "fallback_results": [...],
  "metadata": {
    "user_id": "uuid",
    "has_behavioral_data": true,
    "total_results": 25,
    "search_time_ms": 120
  }
}
```

## Database Schema

The personalized search uses these tables:
- `user_behavior`: Tracks user interactions (views, purchases, etc.)
- `user_preferences`: Stores user preference weights
- `user_interaction_summary`: Aggregated user behavior metrics
- `user_similarity`: Precomputed user similarity scores
- `note_popularity_metrics`: Note performance metrics

## Features

### For Authenticated Users
- **Behavioral Scoring**: Notes are scored based on user's past interactions
- **Collaborative Filtering**: Recommendations based on similar users
- **Personalized Ranking**: Results reranked using user preferences
- **Interaction Tracking**: Search behavior is stored for future improvements

### For Anonymous Users
- **Basic Semantic Search**: Vector similarity matching
- **Popular Fallbacks**: Trending and popular notes
- **Sign-up Prompts**: Encouragement to create account for personalization

### Search Result Types

1. **Semantic Results** (🌟)
   - Vector similarity matching
   - Available for all users
   - Based on query content

2. **Behavioral Results** (👤 For You)
   - Based on user's interaction history
   - Considers views, purchases, time spent
   - Only for authenticated users with history

3. **Collaborative Results** (📈 Trending)
   - Based on similar users' preferences
   - Uses collaborative filtering algorithms
   - Requires sufficient user base

4. **Fallback Content** (💡 Popular)
   - Popular and trending notes
   - Used for new/anonymous users
   - Helps with cold start problem

## Implementation Examples

### Dashboard with Recommendations
```tsx
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations';
import IntelligentSearch from '@/components/IntelligentSearch';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <IntelligentSearch />
      <PersonalizedRecommendations 
        limit={6}
        showHeader={true}
      />
    </div>
  );
}
```

### Homepage with Search
```tsx
import IntelligentSearch from '@/components/IntelligentSearch';

export default function HomePage() {
  return (
    <div className="hero-section">
      <h1>Find Your Perfect Note</h1>
      <IntelligentSearch 
        placeholder="What are you looking for today?"
        className="max-w-3xl mx-auto"
      />
    </div>
  );
}
```

## User Behavior Tracking

The system automatically tracks:
- **Search queries** and click-through rates
- **Note views** and time spent reading
- **Purchases** and download patterns
- **User preferences** (explicit and implicit)

## Performance Considerations

- **Caching**: Results are cached for performance
- **Fallbacks**: Multiple fallback layers for robustness
- **Rate Limiting**: Prevents abuse of ML-powered features
- **Progressive Enhancement**: Works for all users, enhanced for authenticated

## Future Enhancements

1. **Real-time Learning**: Update preferences in real-time
2. **A/B Testing**: Test different recommendation algorithms
3. **Content-Based Filtering**: Enhanced content analysis
4. **Social Features**: Friend recommendations and sharing
5. **Feedback Loop**: Explicit user feedback on recommendations

## Testing

Use the test scripts in `/test_scripts/` to verify functionality:
- `test_personalized_search.js`: Test personalized search endpoint
- `test_collaborative_filtering.js`: Test recommendation algorithms
- `test_behavioral_scoring.js`: Test user behavior integration

## Migration Notes

- Existing search functionality remains unchanged
- New features are additive and backwards compatible
- No breaking changes to existing components
- Database migrations are optional but recommended for full functionality
