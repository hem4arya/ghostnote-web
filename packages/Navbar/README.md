# Navbar

A shared, fully isolated Navbar component for the GhostNote application.

## Features

- **Dynamic Behavior**: Adapts based on user authentication status and current route
- **Fully Responsive**: Desktop and mobile-optimized layouts
- **Feature-level Overrides**: Customizable through props without modifying the shared code
- **Self-contained**: All styles, logic, and assets isolated within the package

## Installation

This package is part of the GhostNote monorepo and should be installed from the workspace root:

```bash
pnpm install
```

## Usage

```tsx
import { Navbar } from "@ghostnote/navbar";

// Basic usage
<Navbar
  user={currentUser}
  onLoginClick={handleLogin}
/>

// With overrides
<Navbar
  user={currentUser}
  onLoginClick={handleLogin}
  onSignUpClick={handleSignup}
  route="/dashboard"
  overrides={{
    logo: <CustomLogo />,
    menuItems: [
      { label: 'Custom Action', onClick: () => console.log('Custom action') }
    ],
    rightButtons: <ExtraButton />,
    searchPlaceholder: "Search in dashboard...",
    className: "custom-navbar"
  }}
/>
```

## API Reference

### `NavbarProps`

| Prop             | Type                       | Description                                          |
| ---------------- | -------------------------- | ---------------------------------------------------- |
| `user`           | `User \| null`             | The current user, if authenticated                   |
| `onLoginClick`   | `() => void`               | Callback when login button is clicked                |
| `onSignUpClick?` | `() => void`               | Callback when signup button is clicked               |
| `route?`         | `string`                   | Current route, will be auto-detected if not provided |
| `overrides?`     | `Partial<NavbarOverrides>` | Override specific parts of the navbar                |

### `NavbarOverrides`

| Property            | Type         | Description                                     |
| ------------------- | ------------ | ----------------------------------------------- |
| `logo`              | `ReactNode`  | Custom logo component                           |
| `menuItems`         | `MenuItem[]` | Additional menu items to show in user dropdown  |
| `rightButtons`      | `ReactNode`  | Additional buttons to show on right side        |
| `className`         | `string`     | Additional CSS classes for the navbar container |
| `searchPlaceholder` | `string`     | Custom search placeholder                       |
| `hideSearch`        | `boolean`    | Hide search functionality                       |

## Development

Run the package in development mode:

```bash
pnpm dev
```

Build the package:

```bash
pnpm build
```

## Structure

- `src/components/` - React components
  - `Navbar.tsx` - Main Navbar component
  - `Navbar.module.css` - Scoped CSS styles
  - `Avatar.tsx` - User avatar component
  - `NavbarSearch.tsx` - Search input component
  - `UserDropdown.tsx` - User dropdown menu
- `src/hooks/` - Custom React hooks
  - `useNavbar.ts` - Navbar logic and state management
- `src/utils/` - Utility functions
  - `helpers.ts` - Helper functions (classname merging, etc)
- `src/types/` - TypeScript type definitions
  - `index.ts` - Type exports
- `src/assets/` - Static assets
  - `logo.svg` - Default logo
