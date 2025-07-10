# Clone Transparency - Developer Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase CLI
- TypeScript knowledge
- React/Next.js familiarity

### Setup Development Environment

1. **Install Dependencies**
```bash
cd ghostnote-web
npm install
```

2. **Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Database Setup**
```bash
# Run the transparency migration
supabase migration up --file 20250710000004_add_note_transparency.sql
```

4. **Deploy Edge Function**
```bash
# Deploy the transparency function
supabase functions deploy note-transparency
```

## 🔧 Development Workflow

### Running the Project
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

### Testing Transparency Feature

#### Using Mock Data (Recommended for Development)
```typescript
import { CloneTransparencyWrapperDev } from '@/components/CloneTransparencyWrapperDev';

// In your component
<CloneTransparencyWrapperDev 
  noteId="2" // Use IDs 1-5 for different scenarios
  showDetailedInfo={true}
/>
```

#### Available Mock Scenarios
- **noteId="1"**: Original content (no badge shown)
- **noteId="2"**: Modified content (35% similarity, low severity)
- **noteId="3"**: Heavily inspired (60% similarity, medium severity)
- **noteId="4"**: Clone content (85% similarity, high severity)
- **noteId="5"**: Private original creator (70% similarity, no source link)

#### Demo Page
Visit `/transparency-demo` to see all scenarios in action.

### Component Development

#### Creating New Transparency Components
```typescript
// Example: Custom transparency display
import { useTransparencyData } from '@/utils/transparency';

function CustomTransparencyDisplay({ noteId }: { noteId: string }) {
  const { data, loading, error } = useTransparencyData(parseInt(noteId));
  
  if (loading) return <LoadingSpinner />;
  if (error || !data) return null;
  if (!data.is_clone) return null; // Don't show for original content
  
  return (
    <div className="transparency-display">
      <span className={`badge ${data.transparency_badge.severity}`}>
        {data.transparency_badge.text}
      </span>
      {data.transparency_badge.show_source_link && (
        <a href={`/notes/${data.original_note?.id}`}>
          View Original
        </a>
      )}
    </div>
  );
}
```

## 🎨 UI Component Guide

### Core Components

#### CloneTransparencyBadge
Main component for displaying transparency information.

```typescript
interface CloneTransparencyBadgeProps {
  is_clone: boolean;
  originality_score: number;
  originality_level: 'Original' | 'Modified' | 'Heavily Inspired' | 'Clone';
  similarity_score?: number;
  original_note?: OriginalNote;
  transparency_badge: TransparencyBadgeData;
  buyer_message: BuyerMessage;
  className?: string;
  showDetailedInfo?: boolean; // Controls expanded view
}
```

**Usage Examples:**
```typescript
// Compact badge for sidebars
<CloneTransparencyBadge {...transparencyData} showDetailedInfo={false} />

// Detailed view for main content area
<CloneTransparencyBadge {...transparencyData} showDetailedInfo={true} />
```

#### CloneTransparencyWrapper
Production wrapper that fetches real data.

```typescript
<CloneTransparencyWrapper 
  noteId="123"
  userId="optional-user-id"
  showDetailedInfo={true}
  className="custom-styles"
/>
```

### Styling Guidelines

#### CSS Classes
```css
/* Severity-based styling */
.badge-none { /* Original content - not shown */ }
.badge-low { color: #10b981; border-color: #10b981; } /* Green */
.badge-medium { color: #f59e0b; border-color: #f59e0b; } /* Yellow */
.badge-high { color: #ef4444; border-color: #ef4444; } /* Red */

/* GhostNote theme integration */
.transparency-badge {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(127, 90, 240, 0.2);
  backdrop-filter: blur(10px);
}
```

#### Responsive Design
```typescript
// Component adapts to container size
<div className="transparency-container">
  <CloneTransparencyBadge 
    {...data}
    className="w-full lg:w-auto" // Full width on mobile, auto on desktop
  />
</div>
```

## 🔌 API Integration

### Production API Calls
```typescript
import { fetchNoteTransparency } from '@/utils/transparency';

// Fetch transparency data
const transparencyData = await fetchNoteTransparency(noteId, userId);

// Using React hook
const { data, loading, error } = useTransparencyData(noteId, userId);
```

### Error Handling
```typescript
try {
  const data = await fetchNoteTransparency(noteId);
  // Handle success
} catch (error) {
  // Handle error gracefully
  console.error('Transparency fetch failed:', error);
  // Component should not break, just not show transparency info
}
```

### Caching Strategy
```typescript
// Cache configuration in utils/transparency.ts
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache key format
const cacheKey = `transparency_${noteId}_${userId || 'anonymous'}`;
```

## 🧪 Testing

### Unit Tests
```typescript
// Example test for transparency utilities
import { getOriginalityDescription, getPurchaseWarning } from '@/utils/transparency';

describe('Transparency Utils', () => {
  test('getOriginalityDescription returns correct description', () => {
    expect(getOriginalityDescription('Modified')).toContain('significantly builds upon');
  });
  
  test('getPurchaseWarning returns null for original content', () => {
    const originalData = { is_clone: false, similarity_score: 0 };
    expect(getPurchaseWarning(originalData)).toBeNull();
  });
});
```

### Component Tests
```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import { CloneTransparencyBadge } from '@/components/CloneTransparencyBadge';

test('renders high similarity warning', () => {
  const props = {
    is_clone: true,
    similarity_score: 85,
    transparency_badge: { 
      text: '85% Match – View Source', 
      severity: 'high',
      show_source_link: true 
    },
    // ... other required props
  };
  
  render(<CloneTransparencyBadge {...props} />);
  expect(screen.getByText('85% Match – View Source')).toBeInTheDocument();
});
```

### Integration Tests
```typescript
// Test full transparency flow
test('transparency wrapper loads and displays data', async () => {
  render(<CloneTransparencyWrapperDev noteId="2" />);
  
  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.queryByText('Checking content transparency...')).not.toBeInTheDocument();
  });
  
  // Check that badge is displayed
  expect(screen.getByText(/% Match/)).toBeInTheDocument();
});
```

## 🔍 Debugging

### Common Issues

#### 1. Badge Not Appearing
```typescript
// Check if note is actually a clone
console.log('Transparency data:', data);
if (!data?.is_clone) {
  console.log('Note is original - no badge should appear');
}
```

#### 2. API Errors
```typescript
// Check network requests in browser dev tools
// Verify environment variables
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

#### 3. Styling Issues
```typescript
// Check className application
<CloneTransparencyBadge 
  {...data}
  className="debug-border" // Add visible border for debugging
/>
```

### Debug Tools

#### Development Console
```typescript
// Enable debug logging
localStorage.setItem('transparency_debug', 'true');

// In utils/transparency.ts
const DEBUG = localStorage.getItem('transparency_debug') === 'true';
if (DEBUG) console.log('Transparency debug:', data);
```

#### React DevTools
- Install React DevTools browser extension
- Check component props and state
- Verify hook behavior

## 📦 Deployment

### Production Checklist
- [ ] Environment variables set
- [ ] Database migration applied
- [ ] Edge function deployed
- [ ] SSL certificates valid
- [ ] CORS configured correctly

### Environment Setup
```bash
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Monitoring
```typescript
// Add monitoring to production components
useEffect(() => {
  if (error) {
    // Send to monitoring service
    analytics.track('transparency_error', { noteId, error: error.message });
  }
}, [error]);
```

## 🔄 Maintenance

### Regular Updates
1. **Monitor API performance** - Check response times weekly
2. **Review cache hit rates** - Optimize if below 80%
3. **Update mock data** - Keep test scenarios current
4. **Security updates** - Keep dependencies updated

### Code Quality
```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run all tests
npm run test:all
```

---

**Last Updated**: July 10, 2025  
**Version**: 1.0.0  
**Next Review**: July 17, 2025
