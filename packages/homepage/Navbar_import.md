# Navbar Component Documentation

## 📦 How to Import and Use

### Basic Usage

```tsx
import { Navbar } from "@ghostnote/navbar";

function App() {
  return (
    <div>
      <Navbar />
      {/* Your app content */}
    </div>
  );
}
```

### With User Authentication

```tsx
import { Navbar } from "@ghostnote/navbar";

function App() {
  const user = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    image: "https://example.com/avatar.jpg", // optional
  };

  return (
    <div>
      <Navbar
        user={user}
        onLoginClick={() => console.log("Login clicked")}
        onSignUpClick={() => console.log("Signup clicked")}
      />
      {/* Your app content */}
    </div>
  );
}
```

## 🧩 Customization and Overrides

The Navbar component is designed to be fully customizable through the `overrides` prop:

### Custom Logo

```tsx
<Navbar
  overrides={{
    logo: (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg"></div>
        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          DemoApp
        </span>
      </div>
    ),
  }}
/>
```

### Custom Menu Items

```tsx
import { Settings, Help, Star } from "lucide-react";

<Navbar
  overrides={{
    menuItems: [
      {
        label: "Premium Features",
        href: "#premium",
        icon: <Star className="h-4 w-4" />,
      },
      {
        label: "Help Center",
        href: "#help",
        icon: <Help className="h-4 w-4" />,
      },
      {
        label: "Custom Action",
        onClick: () => alert("Custom action clicked!"),
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  }}
/>;
```

### Custom Right-Side Buttons

```tsx
import { Button } from "@ghostnote/ui-components";

<Navbar
  overrides={{
    rightButtons: (
      <Button variant="neon" size="sm">
        Demo Button
      </Button>
    ),
  }}
/>;
```

### Hide Search Functionality

```tsx
<Navbar overrides={{ hideSearch: true }} />
```

### Custom Search Placeholder

```tsx
<Navbar overrides={{ searchPlaceholder: "Search demo content..." }} />
```

### Additional CSS Classes

```tsx
<Navbar overrides={{ className: "border-b-2 border-cyan-500/30" }} />
```

## 🎨 Theme Integration with globals.css

The Navbar automatically respects the GhostNote theme system defined in `globals.css`. Here's how to maintain consistency:

### Color Scheme

The component uses these CSS custom properties:

- `--ghost-dark`: Main background color
- `--ghost-purple`: Primary accent color
- `--ghost-neon`: Hover and focus states
- `--ghost-cyan`: Secondary accent
- `--ghost-gray`: Input backgrounds

### Using Theme Colors in Custom Components

```css
/* In your custom CSS */
.my-custom-element {
  background-color: var(--ghost-dark);
  color: var(--ghost-neon);
}

/* Hover effects consistent with navbar */
.my-custom-element:hover {
  color: var(--ghost-cyan);
}
```

### Typography

The theme uses these fonts:

- **Inter**: Primary UI font (sans-serif)
- **JetBrains Mono**: Code and monospace text
- **Orbitron**: Headers and display text

```css
.my-heading {
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
}

.my-code {
  font-family: "JetBrains Mono", monospace;
}
```

## 🧪 Complete Override Example

Here's a comprehensive example showing all customization options:

```tsx
import { Navbar } from "@ghostnote/navbar";
import { Star, Bell, Settings, Help, Shield } from "lucide-react";
import { Button } from "@ghostnote/ui-components";

function MyApp() {
  const user = {
    id: "user-123",
    name: "Jane Smith",
    email: "jane@myapp.com",
    image: "/jane-avatar.jpg",
  };

  const handleLogin = () => {
    // Custom login logic
    console.log("Opening custom login modal");
  };

  const handleSignup = () => {
    // Custom signup logic
    window.location.href = "/custom-signup";
  };

  return (
    <div className="min-h-screen bg-ghost-dark">
      <Navbar
        user={user}
        onLoginClick={handleLogin}
        onSignUpClick={handleSignup}
        route="/dashboard" // Current route for back button logic
        overrides={{
          // Custom logo
          logo: (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                MyApp
              </span>
            </div>
          ),

          // Custom search placeholder
          searchPlaceholder: "Search projects, files, and team members...",

          // Additional menu items
          menuItems: [
            {
              label: "Premium Features",
              href: "/premium",
              icon: <Star className="h-4 w-4" />,
            },
            {
              label: "Security Center",
              href: "/security",
              icon: <Shield className="h-4 w-4" />,
            },
            {
              label: "Help & Support",
              href: "/help",
              icon: <Help className="h-4 w-4" />,
            },
            {
              label: "Advanced Settings",
              onClick: () => console.log("Opening advanced settings"),
              icon: <Settings className="h-4 w-4" />,
            },
          ],

          // Additional right-side buttons
          rightButtons: (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>
            </>
          ),

          // Additional CSS classes
          className:
            "border-b-2 border-purple-500/20 bg-gradient-to-r from-gray-900 to-gray-800",
        }}
      />

      {/* Your app content */}
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-white">Welcome to MyApp</h1>
      </main>
    </div>
  );
}

export default MyApp;
```

## 🎯 Best Practices

### 1. Consistent Theming

Always use the CSS custom properties from `globals.css` for colors:

```tsx
// ✅ Good
<div className="bg-ghost-dark border border-ghost-purple/30 text-ghost-neon">

// ❌ Avoid
<div className="bg-gray-900 border border-purple-500 text-green-400">
```

### 2. Responsive Design

The Navbar is fully responsive. When adding custom elements, ensure they work on mobile:

```tsx
// ✅ Good - includes responsive classes
<div className="hidden md:flex lg:space-x-4">
  <Button>Desktop Only</Button>
</div>

// ✅ Good - shows on mobile too
<Button className="md:hidden" size="icon">
  <Menu className="h-4 w-4" />
</Button>
```

### 3. Performance

Keep override components lightweight and avoid heavy computations:

```tsx
// ✅ Good - memoized component
const CustomLogo = React.memo(() => (
  <img src="/logo.png" alt="Logo" className="h-8 w-8" />
));

// ❌ Avoid - creates new component on every render
overrides={{
  logo: <img src="/logo.png" alt="Logo" className="h-8 w-8" />
}}
```

### 4. Accessibility

Ensure custom elements maintain accessibility:

```tsx
// ✅ Good - proper aria labels and keyboard support
<Button
  variant="ghost"
  size="icon"
  aria-label="Notifications"
  onClick={handleNotifications}
>
  <Bell className="h-4 w-4" />
</Button>
```

## 🔧 TypeScript Support

The Navbar component is fully typed. Here are the key interfaces:

```typescript
interface NavbarProps {
  user?: User | null;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  route?: string;
  overrides?: Partial<NavbarOverrides>;
}

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface MenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

interface NavbarOverrides {
  logo: ReactNode;
  menuItems: MenuItem[];
  rightButtons: ReactNode;
  className: string;
  searchPlaceholder: string;
  hideSearch: boolean;
}
```

## 🎨 Animation and Effects

The Navbar includes several built-in animations and effects:

- **Glow effects** on logo and interactive elements
- **Gradient animations** on the logo text
- **Smooth transitions** for all hover states
- **Slide-in animations** for mobile overlays
- **Backdrop blur** for a modern glass effect

These effects automatically respect `prefers-reduced-motion` for accessibility.

## 🌟 Advanced Customization

For more complex customizations, you can:

1. **Fork the component** and modify it directly
2. **Wrap it** in your own component with additional functionality
3. **Extend the CSS** with additional utility classes
4. **Use CSS-in-JS** libraries for dynamic styling

Remember that the component is designed to be as flexible as possible while maintaining the beautiful GhostNote aesthetic!
return (

<div>
<Navbar />
{/_ Your app content _/}
</div>
);
}

````

## 🧩 Component Overview

The GhostNote Navbar is a premium, fully responsive navigation component with:

- ✨ **Beautiful animations** and cyber-themed design
- 🔍 **Advanced search functionality** with mobile/desktop modes
- 👤 **User authentication** with private account setup
- 📱 **Mobile-first responsive design**
- 🎨 **Modular overrides** for complete customization
- 🌙 **Dark theme** with gradient effects and glow states

## 🎯 Basic Implementation

### Simple Navigation Bar
```typescript
import { Navbar } from '@ghostnote/navbar';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>{/* Your content */}</main>
    </>
  );
}
````

### With User Authentication

```typescript
import { Navbar } from "@ghostnote/navbar";
import { useState } from "react";

export default function Layout() {
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    // Custom login logic
    console.log("Opening custom login modal");
  };

  const handleSignup = () => {
    // Custom signup logic
    window.location.href = "/signup";
  };

  return (
    <Navbar
      user={user}
      onLoginClick={handleLogin}
      onSignUpClick={handleSignup}
    />
  );
}
```

## 🔧 Advanced Customization

### Custom Logo & Branding

```typescript
import { Navbar } from "@ghostnote/navbar";
import { MyLogo } from "./components/MyLogo";

export default function Layout() {
  return (
    <Navbar
      overrides={{
        logo: (
          <div className="flex items-center gap-2">
            <MyLogo className="h-8 w-8" />
            <span className="font-bold text-xl">MyApp</span>
          </div>
        ),
      }}
    />
  );
}
```

### Custom Search Behavior

```typescript
import { Navbar } from "@ghostnote/navbar";
import { useRouter } from "next/navigation";

export default function Layout() {
  const router = useRouter();

  return (
    <Navbar
      overrides={{
        searchPlaceholder: "Search your notes and documents...",
        hideSearch: false, // Set to true to completely hide search
      }}
    />
  );
}
```

### Custom Menu Items & Actions

```typescript
import { Navbar } from "@ghostnote/navbar";
import { Settings, HelpCircle, LogOut } from "lucide-react";

const customMenuItems = [
  {
    label: "Account Settings",
    href: "/settings/account",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    label: "Help Center",
    href: "/help",
    icon: <HelpCircle className="h-4 w-4" />,
  },
  {
    label: "Sign Out",
    onClick: () => {
      // Custom logout logic
      localStorage.clear();
      window.location.href = "/";
    },
    icon: <LogOut className="h-4 w-4" />,
  },
];

export default function Layout() {
  return (
    <Navbar
      user={{ id: "1", name: "John Doe", email: "john@example.com" }}
      overrides={{
        menuItems: customMenuItems,
        rightButtons: (
          <button className="px-3 py-2 bg-primary rounded">Premium</button>
        ),
      }}
    />
  );
}
```

## 🎨 Theme Integration

The Navbar automatically uses the theme defined in `globals.css`. Key CSS variables it respects:

```css
:root {
  --ghost-purple: #6b46c1; /* Primary brand color */
  --ghost-neon: #00ff41; /* Accent/hover color */
  --ghost-cyan: #00ffff; /* Secondary accent */
  --ghost-gray: #2a2a2a; /* Background elements */
  --ghost-dark: #1a1a1a; /* Dark backgrounds */
}
```

### Custom Theme Colors

```typescript
// Override specific colors in your global CSS
:root {
  --primary: 262.1 83.3% 57.8%;        /* Purple theme */
  --secondary: 217.2 32.6% 17.5%;      /* Dark theme */
  --accent: 142.1 76.2% 36.3%;         /* Green accent */
}
```

## 📱 Responsive Behavior

### Desktop (≥768px)

- Full horizontal layout with search bar in center
- All action buttons visible
- Hover effects and animations active
- User dropdown menu available

### Mobile (<768px)

- Condensed layout with collapsible search
- Hamburger menu for additional options
- Touch-optimized button sizes
- Slide-out mobile menu overlay

### Tablet (768px - 1024px)

- Balanced layout between desktop and mobile
- Search bar present but condensed
- Some buttons may be grouped

## 🔍 Search Functionality

### Desktop Search

```typescript
// The search component automatically handles:
// - Focus states with visual feedback
// - Keyboard shortcuts (Ctrl/Cmd + K)
// - Search submission on Enter
// - Clear functionality on Escape

const handleSearch = (query: string) => {
  // Custom search handling
  router.push(`/search?q=${encodeURIComponent(query)}`);
};

<Navbar onSearch={handleSearch} />;
```

### Mobile Search

- Toggleable search overlay
- Full-screen search experience
- Auto-focus when opened
- Swipe/tap to close

## 🚀 Performance Optimization

### Code Splitting

```typescript
// Lazy load the navbar for better initial page load
import { lazy, Suspense } from "react";

const Navbar = lazy(() => import("@ghostnote/navbar"));

export default function Layout() {
  return (
    <Suspense fallback={<div className="h-16 bg-background" />}>
      <Navbar />
    </Suspense>
  );
}
```

### CSS Optimization

The component uses CSS Modules for optimal performance:

- Scoped styles prevent conflicts
- Tree-shaking removes unused styles
- Critical CSS is inlined
- Animations use hardware acceleration

## 🔐 Authentication Integration

### Private Account Setup

The component includes a built-in private account creation modal:

```typescript
// Automatically triggered when no onLoginClick is provided
<Navbar /> // Shows private account setup on login click

// Custom login integration
<Navbar
  onLoginClick={() => {
    // Your custom auth logic
    openAuthModal('login');
  }}
/>
```

### User State Management

```typescript
import { useState, useEffect } from "react";
import { Navbar } from "@ghostnote/navbar";

export default function Layout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing authentication
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetchUser(token).then(setUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  return (
    <Navbar
      user={user}
      onLoginClick={() => setShowAuthModal(true)}
      overrides={{
        menuItems: [
          {
            label: "Sign Out",
            onClick: handleLogout,
            icon: <LogOut className="h-4 w-4" />,
          },
        ],
      }}
    />
  );
}
```

## 📚 API Reference

### NavbarProps

```typescript
interface NavbarProps {
  user?: User | null; // Current authenticated user
  onLoginClick?: () => void; // Login button handler
  onSignUpClick?: () => void; // Signup button handler
  route?: string; // Current route (auto-detected)
  overrides?: Partial<NavbarOverrides>; // Customization options
}
```

### NavbarOverrides

```typescript
interface NavbarOverrides {
  logo?: ReactNode; // Custom logo component
  menuItems?: MenuItem[]; // Additional menu items
  rightButtons?: ReactNode; // Custom right-side buttons
  className?: string; // Additional CSS classes
  searchPlaceholder?: string; // Custom search placeholder
  hideSearch?: boolean; // Hide search functionality
}
```

### User

```typescript
interface User {
  id: string; // Unique user identifier
  name: string; // Display name
  email: string; // User email
  image?: string; // Profile image URL (optional)
}
```

### MenuItem

```typescript
interface MenuItem {
  label: string; // Menu item text
  href?: string; // Navigation link (optional)
  onClick?: () => void; // Click handler (optional)
  icon?: ReactNode; // Icon component (optional)
}
```

## 🧪 Example Implementations

### E-commerce Site

```typescript
<Navbar
  user={currentUser}
  overrides={{
    rightButtons: (
      <>
        <CartButton itemCount={cartItems.length} />
        <WishlistButton />
      </>
    ),
    searchPlaceholder: "Search products...",
    menuItems: [
      { label: "Orders", href: "/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Account", href: "/account" },
    ],
  }}
/>
```

### Documentation Site

```typescript
<Navbar
  overrides={{
    logo: <DocsLogo />,
    hideSearch: false,
    searchPlaceholder: "Search documentation...",
    rightButtons: <ThemeToggle />,
  }}
/>
```

### SaaS Dashboard

```typescript
<Navbar
  user={user}
  overrides={{
    rightButtons: (
      <>
        <NotificationBell />
        <UpgradeButton />
      </>
    ),
    menuItems: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Projects", href: "/projects" },
      { label: "Settings", href: "/settings" },
      { label: "Billing", href: "/billing" },
    ],
  }}
/>
```

## 🛠️ Troubleshooting

### Common Issues

1. **Styles not loading**: Ensure `globals.css` is imported in your app
2. **TypeScript errors**: Make sure you have the correct type definitions
3. **Search not working**: Verify your search handler is properly set up
4. **Mobile menu not opening**: Check for CSS conflicts with z-index

### Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- High contrast mode support
- Screen reader compatible

---

_Built with ❤️ for the GhostNote ecosystem. Need help? Check our [documentation](https://ghostnote.dev/docs) or [open an issue](https://github.com/ghostnote/issues)._
