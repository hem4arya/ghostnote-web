# Component Reference - Clone Transparency

## 📋 Component Index

| Component | Purpose | Location | Status |
|-----------|---------|----------|--------|
| `CloneTransparencyBadge` | Main UI display component | `/src/components/` | ✅ Stable |
| `CloneTransparencyWrapper` | Production data wrapper | `/src/components/` | ✅ Stable |
| `CloneTransparencyWrapperDev` | Development mock wrapper | `/src/components/` | ✅ Stable |

## 🎨 CloneTransparencyBadge

Main component for displaying clone transparency information to buyers.

### Props Interface
```typescript
interface CloneTransparencyBadgeProps {
  is_clone: boolean;
  originality_score: number;
  originality_level: 'Original' | 'Modified' | 'Heavily Inspired' | 'Clone';
  similarity_score?: number;
  original_note?: {
    id: number;
    title: string;
    creator_id: string;
    creator_username?: string;
    creator_is_public: boolean;
    created_at: string;
  };
  transparency_badge: {
    text: string;
    severity: 'none' | 'low' | 'medium' | 'high';
    show_source_link: boolean;
  };
  buyer_message: {
    title: string;
    description: string;
    recommendation: string;
  };
  className?: string;
  showDetailedInfo?: boolean;
}
```

### Usage Examples

#### Basic Badge Display
```typescript
import { CloneTransparencyBadge } from '@/components/CloneTransparencyBadge';

function NotePage({ transparencyData }) {
  return (
    <div>
      <h1>Note Title</h1>
      <CloneTransparencyBadge
        is_clone={transparencyData.is_clone}
        originality_score={transparencyData.originality_score}
        originality_level={transparencyData.originality_level}
        similarity_score={transparencyData.similarity_score}
        original_note={transparencyData.original_note}
        transparency_badge={transparencyData.transparency_badge}
        buyer_message={transparencyData.buyer_message}
        showDetailedInfo={false} // Compact view
      />
    </div>
  );
}
```

#### Detailed Information View
```typescript
<CloneTransparencyBadge
  {...transparencyData}
  showDetailedInfo={true} // Shows expanded card with full details
  className="my-4"
/>
```

#### Sidebar Compact View
```typescript
<CloneTransparencyBadge
  {...transparencyData}
  showDetailedInfo={false}
  className="w-full text-sm"
/>
```

### Visual States

#### Severity Levels
- **`none`**: Original content (typically not displayed)
- **`low`**: 10-40% similarity (green, minimal warning)
- **`medium`**: 40-70% similarity (yellow, moderate warning)
- **`high`**: 70%+ similarity (red, strong warning)

#### Display Variants
```typescript
// Compact badge
showDetailedInfo={false}
// Result: Small badge with similarity percentage

// Detailed card
showDetailedInfo={true}
// Result: Expandable card with full transparency info
```

### Styling Classes
```css
/* Applied automatically based on severity */
.badge-low {
  background: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
  color: #10b981;
}

.badge-medium {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
  color: #f59e0b;
}

.badge-high {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #ef4444;
}
```

## 🔄 CloneTransparencyWrapper

Production wrapper component that fetches real transparency data from the API.

### Props Interface
```typescript
interface CloneTransparencyWrapperProps {
  noteId: string;
  userId?: string;
  className?: string;
  showDetailedInfo?: boolean;
}
```

### Implementation
```typescript
import { CloneTransparencyWrapper } from '@/components/CloneTransparencyWrapper';

function ProductionNotePage({ noteId, currentUserId }) {
  return (
    <div>
      <CloneTransparencyWrapper
        noteId={noteId}
        userId={currentUserId}
        showDetailedInfo={true}
        className="mb-6"
      />
    </div>
  );
}
```

### Loading States
```typescript
// Loading indicator
<div className="flex items-center gap-2 text-sm text-gray-400">
  <Loader2 className="h-4 w-4 animate-spin" />
  <span>Checking content transparency...</span>
</div>

// Error state
// Returns null (no UI) if error occurs

// No data state  
// Returns null (no UI) if note is original content
```

### API Integration
- Uses `useTransparencyData` hook from `/utils/transparency.ts`
- Automatically handles caching (5-minute cache)
- Graceful error handling (fails silently)

## 🧪 CloneTransparencyWrapperDev

Development wrapper with mock data for testing and demonstration.

### Props Interface
```typescript
interface CloneTransparencyWrapperDevProps {
  noteId: string;
  userId?: string;
  className?: string;
  showDetailedInfo?: boolean;
}
```

### Mock Data Scenarios
```typescript
// Available test scenarios
const mockScenarios = {
  '1': 'Original content (no badge)',
  '2': 'Modified content (35% similarity)',
  '3': 'Heavily inspired (60% similarity)', 
  '4': 'Clone content (85% similarity)',
  '5': 'Private original creator (70% similarity)'
};
```

### Development Usage
```typescript
import { CloneTransparencyWrapperDev } from '@/components/CloneTransparencyWrapperDev';

function DevelopmentNotePage() {
  return (
    <div>
      {/* Test different scenarios */}
      <CloneTransparencyWrapperDev noteId="2" showDetailedInfo={true} />
      <CloneTransparencyWrapperDev noteId="4" showDetailedInfo={false} />
    </div>
  );
}
```

### Mock API Simulation
- Simulates 300ms network delay
- Uses data from `/src/data/sampleTransparencyData.ts`
- Perfect for UI development and testing

## 🎯 Integration Patterns

### Note Detail Page Integration
```typescript
// src/app/notes/[id]/page.tsx
function NoteDetailPage({ params }) {
  const noteId = params.id;
  
  return (
    <div>
      <h1>Note Title</h1>
      
      {/* Main transparency badge */}
      <div className="mb-6">
        <CloneTransparencyWrapperDev 
          noteId={noteId} 
          showDetailedInfo={true} 
        />
      </div>
      
      {/* Note content */}
      <div className="prose">
        {/* Note content here */}
      </div>
      
      {/* Sidebar */}
      <aside className="lg:col-span-1">
        {/* Purchase info */}
        
        {/* Compact transparency info */}
        <CloneTransparencyWrapperDev 
          noteId={noteId}
          showDetailedInfo={false}
          className="w-full mb-4"
        />
      </aside>
    </div>
  );
}
```

### Dashboard Integration
```typescript
// For note cards in dashboard
function NoteCard({ note }) {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      
      {/* Small transparency indicator */}
      <CloneTransparencyWrapperDev
        noteId={note.id}
        showDetailedInfo={false}
        className="text-xs mt-2"
      />
    </div>
  );
}
```

### Search Results Integration
```typescript
// In search results
function SearchResultItem({ note }) {
  return (
    <div className="search-result">
      <h4>{note.title}</h4>
      <p>{note.preview}</p>
      
      {/* Transparency badge for search results */}
      <CloneTransparencyWrapperDev
        noteId={note.id}
        showDetailedInfo={false}
        className="mt-2"
      />
    </div>
  );
}
```

## 🔧 Customization

### Custom Styling
```typescript
// Custom CSS classes
<CloneTransparencyBadge
  {...transparencyData}
  className="custom-transparency-badge border-2 p-4"
/>

// Tailwind utility classes
<CloneTransparencyBadge
  {...transparencyData}
  className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-3"
/>
```

### Custom Badge Text
```typescript
// Override badge text in the data
const customTransparencyData = {
  ...transparencyData,
  transparency_badge: {
    ...transparencyData.transparency_badge,
    text: "Custom Badge Text"
  }
};
```

### Conditional Rendering
```typescript
function ConditionalTransparency({ noteId, userType }) {
  // Only show for premium users
  if (userType !== 'premium') return null;
  
  return (
    <CloneTransparencyWrapperDev
      noteId={noteId}
      showDetailedInfo={true}
    />
  );
}
```

## 📱 Responsive Behavior

### Mobile Optimization
```typescript
<CloneTransparencyBadge
  {...transparencyData}
  className="w-full sm:w-auto text-sm sm:text-base"
  showDetailedInfo={false} // Compact on mobile
/>
```

### Breakpoint-Specific Display
```typescript
<div className="transparency-container">
  {/* Desktop: detailed view */}
  <div className="hidden lg:block">
    <CloneTransparencyBadge {...transparencyData} showDetailedInfo={true} />
  </div>
  
  {/* Mobile: compact view */}
  <div className="lg:hidden">
    <CloneTransparencyBadge {...transparencyData} showDetailedInfo={false} />
  </div>
</div>
```

## 🧪 Testing Components

### Unit Tests
```typescript
import { render, screen } from '@testing-library/react';
import { CloneTransparencyBadge } from '@/components/CloneTransparencyBadge';

const mockTransparencyData = {
  is_clone: true,
  originality_score: 65,
  originality_level: 'Modified',
  similarity_score: 35,
  transparency_badge: {
    text: '35% Match – View Source',
    severity: 'low',
    show_source_link: true
  },
  buyer_message: {
    title: 'Modified Content',
    description: 'Test description',
    recommendation: 'Test recommendation'
  }
};

test('renders transparency badge correctly', () => {
  render(<CloneTransparencyBadge {...mockTransparencyData} />);
  expect(screen.getByText('35% Match – View Source')).toBeInTheDocument();
});
```

### Integration Tests
```typescript
import { CloneTransparencyWrapperDev } from '@/components/CloneTransparencyWrapperDev';

test('wrapper component loads mock data', async () => {
  render(<CloneTransparencyWrapperDev noteId="2" />);
  
  await waitFor(() => {
    expect(screen.getByText(/Match/)).toBeInTheDocument();
  });
});
```

---

**Last Updated**: July 10, 2025  
**Component Version**: 1.0.0  
**Compatibility**: React 18+, Next.js 13+
