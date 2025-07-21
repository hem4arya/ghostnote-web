# Navbar Component Documentation

## Overview

The Navbar component is a comprehensive navigation solution for the GhostNote application, implementing a feature-based folder structure for improved modularity and maintainability.

## Architecture

```
src/components/navbar/
├── Navbar.tsx                 # Main navbar component
├── index.ts                   # Feature exports
├── components/                # Sub-components
│   ├── index.ts
│   ├── MobileMenu.tsx
│   ├── UserDropdown.tsx
│   ├── NavbarSearch.tsx
│   └── NavigationButtons.tsx
├── hooks/                     # Custom hooks
│   └── useNavbar.ts
├── utils/                     # Utility functions
│   ├── index.ts
│   └── helpers.ts
├── types/                     # TypeScript types
│   └── index.ts
├── styles/                    # Component styles
│   └── navbar.css
├── ui/                        # Reusable UI components
│   ├── button/
│   └── input/
├── docs/                      # Documentation
│   └── README.md
└── demos/                     # Demo components
```

## Components

### Navbar (Main Component)

The primary navigation component that adapts based on the current route and user authentication status.

**Props:**
- `onLoginClick?: () => void` - Callback for login action
- `onSignUpClick?: () => void` - Callback for signup action
- `user?: User` - Current user object
- `isAuthenticated?: boolean` - Authentication status
- `variant?: NavbarVariant` - Display variant based on current page

**Features:**
- Responsive design (mobile/desktop)
- Context-aware back navigation
- Integrated search functionality
- User authentication state handling
- Route-based customization

### MobileMenu

Mobile-responsive navigation menu with overlay design.

**Props:**
- `isAuthenticated?: boolean` - Show authenticated features
- `onLoginClick?: () => void` - Login callback
- `onSignUpClick?: () => void` - Signup callback
- `onSearchClick?: () => void` - Search activation callback

**Features:**
- Slide-in animation
- Backdrop blur effect
- Context-sensitive menu items
- Authentication state handling

### UserDropdown

User profile dropdown with account management options.

**Props:**
- `user?: User` - User profile data
- `onSignOut?: () => void` - Sign out callback

**Features:**
- Avatar display with fallback
- Premium user indicators
- Account management links
- Sign out functionality

### NavbarSearch

Advanced search component with suggestions and recent searches.

**Props:**
- `isOpen: boolean` - Search overlay state
- `onClose: () => void` - Close callback
- `onSearch: (query: string) => void` - Search callback
- `placeholder?: string` - Input placeholder text
- `suggestions?: SearchSuggestion[]` - Search suggestions
- `recentSearches?: string[]` - Recent search history

**Features:**
- Keyboard navigation (Arrow keys, Enter, Escape)
- Search suggestions with categorization
- Recent search history
- Mobile-responsive overlay
- Debounced search input

### NavigationButtons

Desktop navigation buttons for authenticated and unauthenticated states.

**Props:**
- `isAuthenticated?: boolean` - Authentication status
- `onLoginClick?: () => void` - Login callback
- `onSignUpClick?: () => void` - Signup callback
- `showCreateButton?: boolean` - Show create note button

## Hooks

### useNavbar

Custom hook for navbar state management and navigation logic.

**Returns:**
- `searchState: SearchState` - Search UI state
- `searchInputRef: RefObject<HTMLInputElement>` - Search input reference
- `isHomepage: boolean` - Current page detection
- `handleBack: () => void` - Back navigation handler
- `closeSearch: () => void` - Close search overlay
- `updateSearchQuery: (query: string) => void` - Update search query
- `navigateToSearch: (query: string) => void` - Navigate to search results
- `handleAuth: (mode: AuthMode) => void` - Handle authentication modal

## Types

### Core Types

```typescript
interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  isPremium?: boolean;
  createdAt?: string;
  preferences?: UserPreferences;
}

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'note' | 'recent' | 'trending';
  excerpt?: string;
  timestamp?: string;
  relevance?: number;
}

type NavbarVariant = 'homepage' | 'dashboard' | 'note' | 'auth' | 'default';
```

## Utilities

### Helper Functions

- `getNavStyles(pathname: string)` - Get navigation styles based on route
- `getBackUrl(pathname: string)` - Determine back navigation URL
- `getNavbarVariant(pathname: string)` - Get navbar variant for current route
- `getSearchPlaceholder(pathname: string)` - Get context-appropriate search placeholder
- `debounce<T>(func: T, wait: number)` - Debounce function for search input
- `formatTimestamp(timestamp: string | Date)` - Format timestamps for display
- `truncateText(text: string, maxLength: number)` - Truncate text with ellipsis
- `getInitials(name: string)` - Generate user initials from name

## Styling

The navbar uses a combination of Tailwind CSS classes and custom CSS for advanced styling:

- **Theme Integration**: Fully integrated with the ghost theme variables
- **Animations**: Custom CSS animations for smooth transitions
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Accessibility**: Focus management and keyboard navigation support

### Custom CSS Classes

- `.navbar-container` - Main navbar styling
- `.search-overlay` - Search overlay backdrop
- `.mobile-menu-*` - Mobile menu animations
- `.user-dropdown-*` - User dropdown animations
- `.gradient-text` - Animated gradient text effect
- `.premium-glow` - Premium user badge glow effect

## Usage Examples

### Basic Usage

```typescript
import { Navbar } from '@/components/navbar';

function App() {
  const handleLogin = () => {
    // Handle login logic
  };

  const handleSignUp = () => {
    // Handle signup logic
  };

  return (
    <Navbar
      onLoginClick={handleLogin}
      onSignUpClick={handleSignUp}
      isAuthenticated={user?.id !== undefined}
      user={user}
    />
  );
}
```

### With Custom Variant

```typescript
import { Navbar } from '@/components/navbar';
import { usePathname } from 'next/navigation';
import { getNavbarVariant } from '@/components/navbar/utils';

function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const variant = getNavbarVariant(pathname);

  return (
    <div>
      <Navbar variant={variant} />
      {children}
    </div>
  );
}
```

### Individual Components

```typescript
import { MobileMenu, UserDropdown, NavbarSearch } from '@/components/navbar';

// Use individual components for custom layouts
function CustomNavbar() {
  return (
    <nav>
      <MobileMenu isAuthenticated={true} />
      <UserDropdown user={currentUser} />
      <NavbarSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={handleSearch}
      />
    </nav>
  );
}
```

## Accessibility

The navbar components follow accessibility best practices:

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Logical focus flow and visible focus indicators
- **Semantic HTML**: Proper use of navigation landmarks and headings
- **Color Contrast**: WCAG AA compliant color contrast ratios

## Performance

- **Code Splitting**: Components can be imported individually
- **Lazy Loading**: Search suggestions loaded on demand
- **Debounced Search**: Optimized search input with debouncing
- **Memoization**: Expensive calculations memoized with React hooks
- **Image Optimization**: Next.js Image component for user avatars

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: CSS Grid, Flexbox, backdrop-filter support

## Contributing

When contributing to the navbar component:

1. Follow the established folder structure
2. Add TypeScript types for new props/interfaces
3. Include unit tests for new functionality
4. Update documentation for API changes
5. Test across different screen sizes and browsers
6. Ensure accessibility compliance
