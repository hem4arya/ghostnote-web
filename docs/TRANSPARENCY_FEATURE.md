# Clone Transparency for Buyers

This feature provides buyers with transparency about content originality, helping them make informed purchase decisions on GhostNote.

## Overview

The Clone Transparency system analyzes content similarity and provides clear information about:
- Whether a note is a clone of existing content
- The originality level (Original | Modified | Heavily Inspired | Clone)  
- Link to the original creator (if publicly available)
- Purchase recommendations based on similarity scores

## Components

### 1. CloneTransparencyBadge
The main UI component that displays transparency information to buyers.

```tsx
import { CloneTransparencyBadge } from '@/components/CloneTransparencyBadge';

<CloneTransparencyBadge
  is_clone={true}
  originality_score={65}
  originality_level="Modified"
  similarity_score={35}
  original_note={{
    id: 15,
    title: "Original Guide",
    creator_username: "originalauthor",
    creator_is_public: true
  }}
  transparency_badge={{
    text: "35% Match – View Source",
    severity: "low",
    show_source_link: true
  }}
  buyer_message={{
    title: "Modified Content",
    description: "This note significantly builds upon existing material...",
    recommendation: "Good value with additional insights..."
  }}
  showDetailedInfo={true}
/>
```

### 2. CloneTransparencyWrapper
A wrapper component that fetches transparency data and renders the badge.

```tsx
import { CloneTransparencyWrapper } from '@/components/CloneTransparencyWrapper';

<CloneTransparencyWrapper 
  noteId="123"
  userId="optional-user-id"
  showDetailedInfo={true}
/>
```

### 3. Transparency Utilities
Helper functions for fetching and caching transparency data.

```tsx
import { fetchNoteTransparency, useTransparencyData } from '@/utils/transparency';

// React hook
const { data, loading, error } = useTransparencyData(noteId, userId);

// Direct API call
const transparencyData = await fetchNoteTransparency(noteId, userId);
```

## API Response Structure

The Edge Function `/note-transparency` returns:

```typescript
interface TransparencyData {
  note_id: number;
  is_clone: boolean;
  originality_score: number; // 0-100
  originality_level: 'Original' | 'Modified' | 'Heavily Inspired' | 'Clone';
  similarity_score?: number; // 0-100, only for clones
  original_note?: {
    id: number;
    title: string;
    creator_id: string;
    creator_username?: string;
    creator_is_public: boolean;
    created_at: string;
  };
  transparency_badge: {
    text: string; // e.g., "88% Match – View Source"
    severity: 'none' | 'low' | 'medium' | 'high';
    show_source_link: boolean;
  };
  buyer_message: {
    title: string;
    description: string;
    recommendation: string;
  };
}
```

## Classification Logic

Content is classified based on similarity scores:
- **Original** (90-100%): Created from scratch
- **Modified** (60-89%): Significant modifications to existing content  
- **Heavily Inspired** (30-59%): Draws heavily from existing sources
- **Clone** (0-29%): Very similar to existing content

## Badge Severity Levels

- **None**: Original content (no badge shown)
- **Low**: 10-40% similarity (green/neutral)
- **Medium**: 40-70% similarity (yellow/warning)
- **High**: 70%+ similarity (red/alert)

## User Experience

### For Buyers:
1. **Discovery**: Transparency badges appear on note detail pages
2. **Information**: Clear explanation of originality level and similarity
3. **Source Access**: Links to original creators (when public)
4. **Decision Support**: Recommendations help inform purchase decisions

### User Copy Examples:

**Modified Content (35% similarity):**
```
Title: "Modified Content"
Description: "This note significantly builds upon existing material with substantial modifications and additions."
Recommendation: "Good value with additional insights beyond the original."
Badge: "35% Match – View Source"
```

**High Similarity (85% similarity):**
```
Title: "High Similarity Detected"  
Description: "This note is very similar to existing material with minimal changes."
Recommendation: "We recommend checking the original source which may offer better value."
Badge: "85% Match – View Source"
```

## Integration Points

### Note Detail Page
- Main transparency badge below title
- Compact badge in purchase sidebar
- Detailed information in expandable sections

### Purchase Flow
- Warning messages for high similarity content
- Links to original sources before payment
- Clear originality scoring

## Privacy Considerations

- Original creators can choose to remain private
- Private sources show "Source Private" instead of links
- User preferences respected for transparency display

## Development & Testing

### Demo Page
Visit `/transparency-demo` to see all transparency scenarios in action.

### Mock Data
Use `CloneTransparencyWrapperDev` for development with sample data:

```tsx
import { CloneTransparencyWrapperDev } from '@/components/CloneTransparencyWrapperDev';

<CloneTransparencyWrapperDev noteId="2" showDetailedInfo={true} />
```

### Sample Data
Mock transparency data available in `/src/data/sampleTransparencyData.ts` for testing different scenarios.

## Backend Requirements

1. **Edge Function**: `supabase/functions/note-transparency/index.ts`
2. **Database Function**: `get_note_transparency_info()` 
3. **Public View**: `public_note_transparency` for privacy-respecting lookups
4. **Similarity Engine**: Content analysis system for scoring

## Error Handling

- Graceful degradation when transparency data unavailable
- Loading states during API calls
- No badge shown for original content
- Fallback messages for API errors

## Performance

- Response caching (5 minutes default)
- Lazy loading of detailed information
- Optimized database queries with indexes
- Minimal impact on page load times
