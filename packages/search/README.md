# 🔍 Search Feature

This folder contains all search functionality for GhostNote, including AI-powered semantic search, hybrid search, and premium search experiences.

## 📁 Structure

```
search/
├── components/                    # Search UI components
│   ├── AdvancedSmartSearch.tsx   # AI semantic search with natural language
│   ├── HybridSmartSearch.tsx     # Combined keyword + semantic search
│   ├── PremiumSearchExperience.tsx # Premium user search features
│   ├── SmartSearch.tsx           # Basic smart search component
│   ├── IntelligentSearch.tsx     # AI-powered intelligent search
│   └── IntelligentSearchFixed.tsx # Enhanced intelligent search
├── hooks/                        # Search-related React hooks
├── utils/                        # Search utility functions
├── types/                        # TypeScript type definitions
│   └── index.ts                  # Search types and interfaces
├── index.ts                      # Main exports for the search feature
├── tsconfig.json                 # Feature-specific TypeScript config
├── search.code-workspace         # VSCode workspace for search development
└── README.md                     # This file
```

## 🎯 Search Components

### **AdvancedSmartSearch** (`./components/AdvancedSmartSearch.tsx`)
- **Purpose**: AI-powered semantic search with natural language understanding
- **Features**: 
  - Understands context and meaning, not just keywords
  - Advanced filters (category, date, author)
  - Real-time suggestions
  - Search analytics
- **Use Case**: Main search experience for complex queries

### **HybridSmartSearch** (`./components/HybridSmartSearch.tsx`)
- **Purpose**: Combines keyword and semantic search for best results
- **Features**:
  - Dual search algorithms
  - Weighted result scoring
  - Fallback mechanisms
  - Performance optimized
- **Use Case**: Most comprehensive search results

### **PremiumSearchExperience** (`./components/PremiumSearchExperience.tsx`)
- **Purpose**: Enhanced search features for premium users
- **Features**:
  - Advanced filters
  - Priority search results
  - Personalized recommendations
  - Search history
- **Use Case**: Premium user features

### **SmartSearch** (`./components/SmartSearch.tsx`)
- **Purpose**: Basic intelligent search component
- **Features**:
  - Quick search
  - Auto-complete
  - Simple filters
- **Use Case**: Lightweight search interface

## 🌍 Global UI Component

The main search UI component remains in the root for easy access:
```
📁 src/components/SmartSearchDropdown.tsx  ← Main search UI (navbar, etc.)
```

## 🔧 Development Workflow

### **Working on Search Features**

1. **Open Search Workspace**:
   ```bash
   cd src/features/search
   code search.code-workspace
   ```

2. **Start Development Server** (from project root):
   ```bash
   npm run dev
   ```

3. **Work on Search Components**:
   - Edit files in `src/features/search/`
   - Test at various pages that use search
   - See changes with hot-reload

### **Import Strategy**

#### ✅ **Using Search Components in Other Features**:
```typescript
// Import from search feature
import { AdvancedSmartSearch, HybridSmartSearch } from '@/features/search';

// Or import specific components
import { AdvancedSmartSearch } from '@/features/search/components/AdvancedSmartSearch';
```

#### ✅ **Within Search Feature** (relative imports):
```typescript
// Local imports within search feature
import { SearchState } from './types';
import { searchUtils } from './utils/searchHelpers';
import { useSearch } from './hooks/useSearch';
```

#### ✅ **Global Dependencies** (absolute imports):
```typescript
// Global components and utilities
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
```

## 🔌 Backend Integration

Search backend functions are located in:
```
supabase/functions/
├── advanced-search/      # AI semantic search backend
├── hybrid-search/        # Hybrid search implementation  
├── search-notes/         # Basic note search
├── personalized-search/  # User-specific search
└── generate-embedding/   # Search embeddings
```

## 🎨 Usage Examples

### **Adding Search to a Page**:
```tsx
// In any page or component
import { AdvancedSmartSearch } from '@/features/search';

export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      <AdvancedSmartSearch 
        onSearch={(query) => console.log('Searching:', query)}
        showFilters={true}
        enablePremiumFeatures={true}
      />
    </div>
  );
}
```

### **Using the Global Search UI**:
```tsx
// Already integrated in Navbar
import { SmartSearchDropdown } from '@/components/SmartSearchDropdown';

// This is the main search interface users see
```

## 🔍 Search Capabilities

- ✅ **Semantic Search** - Understands meaning and context
- ✅ **Keyword Search** - Traditional text matching
- ✅ **Hybrid Search** - Best of both approaches
- ✅ **AI-Powered** - Uses machine learning and embeddings
- ✅ **Personalized** - Tailored to user preferences
- ✅ **Premium Features** - Enhanced search for paid users
- ✅ **Real-time** - Instant search results
- ✅ **Advanced Filters** - Category, date, author, tags
- ✅ **Auto-complete** - Search suggestions
- ✅ **Analytics** - Search performance tracking

## 🚀 Development Tips

### **Adding New Search Features**:
1. Create component in `./components/`
2. Add types to `./types/index.ts`
3. Export from `./index.ts`
4. Use relative imports within feature
5. Test with the workspace

### **Modifying Existing Search**:
1. Open `search.code-workspace`
2. Edit relevant component files
3. Update types if needed
4. Test across different use cases

### **Backend Changes**:
1. Edit Supabase functions in workspace
2. Deploy with `supabase functions deploy`
3. Test with frontend components

## 🎯 Quick Reference

**Main Search Component**: `AdvancedSmartSearch` - Use this for most search needs  
**Global Search UI**: `SmartSearchDropdown` - Already in navbar  
**Premium Search**: `PremiumSearchExperience` - For premium users  
**Hybrid Search**: `HybridSmartSearch` - Best comprehensive results  

**Workspace**: `search.code-workspace` - Open this to work on search  
**Backend**: `supabase/functions/*-search/` - Search backend functions
