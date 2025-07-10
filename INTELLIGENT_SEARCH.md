# GhostNote Intelligent Search System

## Overview

The GhostNote Intelligent Search System is a sophisticated AI-powered search engine that allows users to find notes using natural language queries. Instead of simple keyword matching, it understands the intent and meaning behind search queries.

## Features

### 1. Natural Language Understanding
- **Intent Recognition**: Understands queries like "motivational notes for breakup" or "dark writing prompts"
- **Semantic Mapping**: Maps synonyms and related terms (e.g., "inspiration" ≈ "motivation")
- **Context Awareness**: Considers the relationship between words and concepts

### 2. Smart Search Results
- **Similarity Scoring**: Each result includes a relevance percentage
- **Ranked Results**: Results are ordered by semantic similarity and relevance
- **Category Filtering**: Users can filter by note categories
- **Hybrid Matching**: Combines exact matches with semantic similarity

### 3. Enhanced User Experience
- **Real-time Search**: Debounced search with instant results
- **Recent Searches**: Remembers user's search history
- **Trending Searches**: Shows popular search queries
- **Smart Suggestions**: Provides query suggestions based on available content

## Implementation Architecture

### Frontend Components

1. **SmartSearch.tsx** - Main search dropdown component integrated into the navbar
2. **SearchPage.tsx** - Dedicated search page with advanced filters and results
3. **Navbar.tsx** - Updated navigation with intelligent search integration

### Backend Infrastructure (Supabase)

1. **Database Schema** (`supabase/migrations/20250710120000_intelligent_search.sql`)
   - `notes` table with vector embedding storage
   - `match_notes` function for similarity search
   - pgvector extension for vector operations

2. **Edge Functions**
   - `generate-embedding` - Converts text to vector embeddings
   - `search-notes` - Performs intelligent search using embeddings

### Search Algorithm

The search system uses a multi-layered approach:

1. **Keyword Expansion**: Maps search terms to semantic alternatives
2. **Scoring System**:
   - Exact phrase match: +100 points
   - Title match: +75 points
   - Category match: +50 points
   - Keyword match: +15 points each
   - Author match: +25 points

3. **Semantic Mapping**: Pre-defined relationships between concepts:
   ```javascript
   const semanticMap = {
     'motivation': ['motivational', 'inspiration', 'encouragement', 'uplift'],
     'breakup': ['relationship', 'love', 'heart', 'emotional'],
     'dark': ['gothic', 'noir', 'mysterious', 'shadow'],
     // ... more mappings
   };
   ```

## How to Use

### Basic Search
1. Type a natural language query in the search bar
2. Results appear instantly with relevance scores
3. Click on any result to view the full note

### Advanced Search
1. Visit `/search` for the dedicated search page
2. Use category filters to narrow results
3. Browse recent and trending searches
4. View detailed similarity scores for each result

### Example Queries
- "motivational notes for breakup"
- "dark writing prompts"
- "React performance optimization"
- "startup pitch deck template"
- "AI machine learning basics"

## Deployment Instructions

### Prerequisites
- Supabase project with pgvector extension enabled
- Next.js application setup
- Environment variables configured

### Backend Setup

1. **Enable pgvector in Supabase**:
   ```sql
   create extension if not exists vector;
   ```

2. **Run the migration**:
   ```bash
   supabase db push
   ```

3. **Deploy Edge Functions**:
   ```bash
   supabase functions deploy generate-embedding
   supabase functions deploy search-notes
   ```

### Frontend Integration

1. **Install dependencies** (if not already installed):
   ```bash
   npm install @supabase/supabase-js lucide-react
   ```

2. **Environment Variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Component Usage**:
   ```jsx
   import SmartSearch from '@/components/SmartSearch';
   
   // In your component
   <SmartSearch 
     query={searchQuery}
     isOpen={isDropdownOpen}
     onClose={() => setIsDropdownOpen(false)}
   />
   ```

## Future Enhancements

### Vector Search (Production Ready)
For production deployment, the system can be enhanced with:

1. **Real Vector Embeddings**: Replace simulation with actual AI model embeddings
2. **Advanced NLP**: Use transformer models for better semantic understanding
3. **User Personalization**: Learn from user behavior to improve results
4. **Search Analytics**: Track popular queries and optimize content

### AI Model Integration
```javascript
// Example with OpenAI embeddings
const response = await openai.embeddings.create({
  model: "text-embedding-ada-002",
  input: searchQuery,
});
const embedding = response.data[0].embedding;
```

### Performance Optimizations
- Implement search result caching
- Add pagination for large result sets
- Optimize database queries with proper indexing
- Use CDN for faster response times

## Technical Notes

### Search Performance
- Current implementation uses in-memory semantic mapping
- Designed to handle up to 10,000 notes efficiently
- Results are limited to top 10 for optimal UX

### Fallback Strategy
- If AI search fails, falls back to traditional keyword search
- Graceful error handling with user-friendly messages
- Offline search capability using cached data

### Security Considerations
- All searches are client-side processed
- No sensitive data in search logs
- Rate limiting on Edge Functions
- CORS headers properly configured

## Testing

### Manual Testing Scenarios
1. Search with exact note titles
2. Search with partial keywords
3. Search with semantic queries
4. Test category filtering
5. Verify recent searches persistence

### Example Test Queries
- "React" → Should find React-related notes
- "motivation breakup" → Should find emotional/relationship content
- "AI learning" → Should find AI/ML category notes
- "dark gothic" → Should find creative writing prompts

## Advanced Search Ranking Algorithm

The intelligent search system implements a sophisticated multi-factor ranking algorithm that weighs different aspects to determine the relevance and quality of search results. This algorithm ensures that users find the most relevant, high-quality, and personalized content.

### Scoring Function & Weights

The final score for each note is calculated using the following weighted formula:

```
Final Score = (Content Match × 35%) + (Popularity × 25%) + (Recency × 15%) + (Creator Trust × 15%) + (Personalization × 10%)
```

#### 1. Content Match (35% weight)
- **Semantic Similarity**: Uses vector embeddings to understand meaning beyond keywords
- **Exact Phrase Match**: +100 points for exact query matches
- **Title Match**: +75 points for matches in note titles
- **Category Match**: +50 points for category alignment
- **Keyword Match**: +15 points per matching keyword
- **Author Match**: +25 points for author name matches

#### 2. Popularity Score (25% weight)
Combines multiple engagement metrics:
- **Purchase Count (50%)**: Logarithmic scale to prevent outliers (max at 100 purchases)
- **Rating Score (30%)**: Weighted by review count (rating/5.0 × min(1.0, reviews/10))
- **View Count (20%)**: Logarithmic scale (max at 1000 views)

#### 3. Recency Score (15% weight)
Time-based scoring to promote fresh content:
- **≤ 7 days**: 1.0 (Very fresh)
- **≤ 30 days**: 0.8 (Fresh) 
- **≤ 90 days**: 0.6 (Recent)
- **≤ 180 days**: 0.4 (Older)
- **> 180 days**: 0.2 (Old)

#### 4. Creator Trust Score (15% weight)
Based on creator reputation and verification:
- **Verified Creators**: 20% boost to trust score
- **Trust Score Range**: 0.0 to 1.0 based on creator history
- **Factors**: Past note quality, user reviews, account verification

#### 5. Personalization Score (10% weight)
Tailored to individual user preferences:
- **Purchase History**: 1.0 weight for purchased similar notes
- **Liked Content**: 0.8 weight for liked similar content
- **View History**: 0.3 weight for viewed similar content
- **Category Preferences**: Based on user's interaction patterns

### Fallback System

When search results are insufficient or low quality, the system provides trending notes:

**Triggers**:
- Less than 3 search results found
- Top result has final score < 0.4

**Fallback Response**:
- Shows top 5 trending notes based on `trending_score`
- Clearly labeled as "Trending Notes" to set user expectations
- Maintains search context for refinement suggestions

### Storage & Updates in Supabase

#### Database Schema Extensions
```sql
-- New ranking columns added to notes table
ALTER TABLE notes ADD COLUMN purchase_count INTEGER DEFAULT 0;
ALTER TABLE notes ADD COLUMN view_count INTEGER DEFAULT 0;
ALTER TABLE notes ADD COLUMN creator_trust_score DECIMAL(3,2) DEFAULT 0.5;
ALTER TABLE notes ADD COLUMN is_verified_creator BOOLEAN DEFAULT FALSE;
ALTER TABLE notes ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE notes ADD COLUMN review_count INTEGER DEFAULT 0;
ALTER TABLE notes ADD COLUMN trending_score DECIMAL(5,2) DEFAULT 0.0;
```

#### Analytics Tables
```sql
-- Track user interactions for personalization
CREATE TABLE user_interactions (
  user_id UUID,
  note_id BIGINT,
  interaction_type TEXT, -- 'view', 'purchase', 'like', 'share'
  created_at TIMESTAMP
);

-- Track search queries and performance
CREATE TABLE search_analytics (
  query TEXT,
  user_id UUID,
  results_count INTEGER,
  clicked_note_id BIGINT,
  created_at TIMESTAMP
);
```

### Adaptive Scoring Over Time

#### Real-time Updates
1. **View Count**: Incremented on note page visits
2. **Purchase Count**: Updated on successful transactions
3. **Rating Updates**: Recalculated when new reviews are added
4. **Interaction Tracking**: Logged for personalization improvements

#### Batch Updates (Recommended Schedule)
- **Trending Scores**: Updated hourly based on recent activity
- **Creator Trust Scores**: Recalculated daily based on user feedback
- **Popularity Decay**: Weekly adjustment to prevent stale high-performers
- **Seasonal Adjustments**: Monthly updates for topic relevance

#### Performance Optimizations
- **Indexed Columns**: All ranking factors have database indexes
- **Cached Calculations**: Popular queries cached for 15 minutes
- **Background Processing**: Heavy calculations run asynchronously
- **Lightweight Functions**: Optimized for Supabase Edge Functions

### Implementation Files

- **Edge Function**: `supabase/functions/advanced-search/index.ts`
- **Database Migration**: `supabase/migrations/20250710130000_advanced_ranking.sql`
- **Frontend Component**: `src/components/AdvancedSmartSearch.tsx`
- **SQL Functions**: `calculate_popularity_factor()`, `calculate_recency_factor()`, `advanced_search_notes()`
