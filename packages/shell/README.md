# Shell Package

This package contains the shared shell components for the GhostNote application.

## 📁 Structure

```
shell/
├── src/
│   ├── Navbar.tsx              # Main navigation component
│   ├── Footer.tsx              # Footer component
│   └── index.ts                # Local exports
├── index.ts                    # Package exports
├── package.json                # Package configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🎯 Components

### `Navbar.tsx`
- Main navigation with search, auth buttons, and responsive design
- Dynamic back/home button based on current page
- Search functionality with keyboard shortcuts
- Auth modal integration via custom events

### `Footer.tsx`
- Simple footer with copyright and branding
- Responsive design
- Consistent styling with app theme

## 🔧 Usage

### From other packages:
```typescript
import { Navbar, Footer } from '@ghostnote/shell';
// or
import Navbar from '../../shell/src/Navbar';
import Footer from '../../shell/src/Footer';
```

### Props:
```typescript
// Navbar
interface NavbarProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

// Footer - no props required
```

## 🎨 Dependencies

- **UI Components**: Uses `../../ui-components/src/components/*`
- **Icons**: `lucide-react` for all icons
- **Navigation**: Next.js `Link`, `useRouter`, `usePathname`
- **Images**: Next.js `Image` component

## 🏗️ Architecture

- **Clean imports**: Uses relative paths to ui-components
- **Event-driven**: Auth integration via custom events
- **Responsive**: Mobile-first design approach
- **Type-safe**: Full TypeScript coverage

## 🔗 Integration

The shell components are designed to be used across all features:
- Homepage uses both Navbar and Footer
- Note pages use Navbar for navigation
- Dashboard pages use Navbar for consistency

## 📝 Notes

- Navbar handles both homepage and sub-page states
- Search functionality can be extended per feature needs
- Auth events allow loose coupling with auth modals
- Footer is minimal but consistent across all pages
