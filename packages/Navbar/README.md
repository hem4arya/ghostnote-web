# 👻 GhostNote Premium Navbar Package

A comprehensive, feature-rich React navbar component with premium styling, animations, and responsive design. Built specifically for GhostNote with dark theme aesthetics and modern UI patterns.

## ✨ Features

### 🎨 Premium Design

- **Dark theme optimized** with GhostNote branding
- **Gradient animations** and glow effects
- **Glass morphism** with backdrop blur
- **Modern typography** with Inter font family
- **Neon accent colors** (purple, green, cyan)

### 🚀 Advanced Animations

- **Smooth transitions** with cubic-bezier easing
- **Hover effects** with transform animations
- **Loading states** with pulse and shimmer
- **Floating animations** for visual appeal
- **Gradient text** with shifting colors

### 📱 Responsive Design

- **Mobile-first** approach
- **Touch-optimized** interactions
- **Breakpoint-specific** styling
- **Collapsible mobile menu**
- **Adaptive button sizes**

### ♿ Accessibility

- **WCAG 2.1 compliant**
- **Keyboard navigation** support
- **Screen reader** friendly
- **High contrast** mode support
- **Reduced motion** preferences
- **Focus management**

### 🛠️ Technical Excellence

- **TypeScript** with full type safety
- **CSS Modules** for scoped styling
- **Tree-shakeable** exports
- **Zero external dependencies** (except React & Lucide)
- **Performance optimized**

## 📦 Installation

```bash
# Install the package dependencies
npm install react lucide-react

# Import the navbar in your project
import { Navbar } from '@ghostnote/navbar';
```

## 🚀 Quick Start

```tsx
import { Navbar } from "@ghostnote/navbar";
import "@ghostnote/navbar/styles";

function App() {
  return (
    <div>
      <Navbar />
      {/* Your app content */}
    </div>
  );
}
```

## 🎛️ API Reference

### Navbar Props

```tsx
interface NavbarProps {
  /** Custom className for the navbar container */
  className?: string;

  /** Show/hide the search functionality */
  showSearch?: boolean;

  /** Show/hide user authentication buttons */
  showAuth?: boolean;

  /** Custom logo component or text */
  logo?: React.ReactNode;

  /** Navbar variant style */
  variant?: "default" | "minimal" | "premium";

  /** Fixed positioning */
  fixed?: boolean;

  /** Custom navigation items */
  navItems?: NavItem[];

  /** User data for authenticated state */
  user?: User | null;

  /** Callback functions */
  onSearch?: (query: string) => void;
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
  onCreateNote?: () => void;
}
```

### Available Components

```tsx
// Main navbar component
import { Navbar } from "@ghostnote/navbar";

// Individual components
import {
  NavbarSearch,
  UserDropdown,
  Avatar,
  Button,
} from "@ghostnote/navbar/components";

// Hooks
import { useNavbar } from "@ghostnote/navbar/hooks";

// Types
import type { NavbarProps, User, NavItem } from "@ghostnote/navbar/types";
```

## 🎨 Customization

### CSS Variables

Override the default theme by customizing CSS variables:

```css
:root {
  /* Primary colors */
  --ghost-purple: #6b46c1;
  --ghost-neon: #00ff41;
  --ghost-cyan: #00ffff;

  /* Background colors */
  --ghost-black: #0a0a0a;
  --ghost-dark: #1a1a1a;
  --ghost-gray: #2a2a2a;

  /* Animation durations */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
}
```

### Custom Styling

```tsx
// Using CSS Modules
import styles from "./MyNavbar.module.css";

<Navbar className={styles.customNavbar} />;
```

```css
/* MyNavbar.module.css */
.customNavbar {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border-bottom: 1px solid var(--ghost-purple-30);
}
```

### Variant Examples

```tsx
// Default navbar
<Navbar variant="default" />

// Minimal navbar (logo + user only)
<Navbar variant="minimal" showSearch={false} />

// Premium navbar (all features)
<Navbar
  variant="premium"
  showSearch={true}
  showAuth={true}
  fixed={true}
/>
```

## 🎯 Usage Examples

### Basic Implementation

```tsx
import React from "react";
import { Navbar } from "@ghostnote/navbar";

export default function App() {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const handleLogin = () => {
    // Handle login logic
  };

  return (
    <Navbar
      onSearch={handleSearch}
      onLogin={handleLogin}
      showSearch={true}
      showAuth={true}
    />
  );
}
```

### With Custom Navigation Items

```tsx
const navItems = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Notes", href: "/notes", icon: "FileText" },
  { label: "Archive", href: "/archive", icon: "Archive" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];

<Navbar navItems={navItems} />;
```

### With User Authentication

```tsx
const user = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://avatar.url",
};

<Navbar
  user={user}
  onLogout={() => setUser(null)}
  onCreateNote={() => router.push("/create")}
/>;
```

### Custom Logo

```tsx
<Navbar
  logo={
    <div className="flex items-center space-x-2">
      <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
      <span className="font-bold text-xl">MyApp</span>
    </div>
  }
/>
```

## 🎬 Animation Classes

The package includes utility classes for animations:

```tsx
// Apply animations directly
<div className="fade-in pulse glow-purple">Animated content</div>

// Available animation classes:
// - fade-in, fade-out
// - slide-in-down, slide-in-up, slide-in-left, slide-in-right
// - scale-in, scale-out
// - pulse, float, glow, shimmer
// - bounce, heartbeat, rotate
```

## 🎨 Color Palette

```css
/* GhostNote Brand Colors */
--ghost-black: #0a0a0a    /* Primary background */
--ghost-dark: #1a1a1a     /* Secondary background */
--ghost-gray: #2a2a2a     /* Tertiary background */
--ghost-purple: #6b46c1   /* Primary accent */
--ghost-neon: #00ff41     /* Success/highlight */
--ghost-cyan: #00ffff     /* Info/link */
--ghost-red: #ff073a      /* Error/danger */
--ghost-white: #ffffff    /* Primary text */
--ghost-light: #e5e7eb    /* Secondary text */
--ghost-muted: #6b7280    /* Muted text */
```

## 📱 Responsive Breakpoints

```css
/* Mobile first approach */
@media (max-width: 640px) {
  /* Mobile */
}
@media (min-width: 641px) {
  /* Tablet+ */
}
@media (min-width: 768px) {
  /* Desktop */
}
@media (min-width: 1024px) {
  /* Large desktop */
}
@media (min-width: 1280px) {
  /* XL desktop */
}
```

## ⚡ Performance

- **Lazy loading** for user dropdown
- **Memoized components** to prevent unnecessary re-renders
- **Optimized animations** with transform/opacity
- **Tree-shaking** support for minimal bundle size
- **CSS variables** for runtime theming

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run visual regression tests
npm run test:visual
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## 📁 File Structure

```
src/
├── components/
│   ├── Avatar.tsx           # User avatar component
│   ├── Button.tsx           # Premium button component
│   ├── Navbar.tsx           # Main navbar component
│   ├── NavbarSearch.tsx     # Search functionality
│   ├── UserDropdown.tsx     # User menu dropdown
│   └── ui/                  # Base UI components
├── hooks/
│   ├── useNavbar.ts         # Navbar state management
│   └── useExample.ts        # Example hook
├── styles/
│   ├── global.css           # Global styles & variables
│   └── Navbar.module.css    # Component-specific styles
├── types/
│   └── index.ts             # TypeScript definitions
├── utils/
│   └── helpers.ts           # Utility functions
└── index.ts                 # Package exports
```

## 🔧 Build Configuration

The package includes optimized build configurations:

- **TypeScript compilation** with declaration files
- **CSS Modules** processing
- **PostCSS** with autoprefixer
- **Bundle optimization** for tree-shaking
- **ESM/CJS** dual package support

## 🚀 Deployment

```bash
# Build the package
npm run build

# Publish to npm (if configured)
npm publish

# Or link locally for development
npm link
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🎉 Credits

Built with ❤️ for GhostNote by the development team.

- **Icons**: Lucide React
- **Typography**: Inter font family
- **Design**: GhostNote design system
- **Inspiration**: Modern dashboard UIs

---

_Make your navigation experience ghostly smooth! 👻_
