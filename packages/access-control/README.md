# Access Control Package

A comprehensive access control system for managing content permissions, user roles, and resource access within the GhostNote application.

## Overview

This package provides robust access control mechanisms including role-based permissions, content access validation, premium feature gating, and user authorization workflows.

## Architecture

```
src/
├── components/         # Access control UI components
│   └── AccessControl.tsx  # Main access control wrapper
├── hooks/             # Custom hooks for access management
│   └── useContentAccess.ts  # Content access validation hook
├── types/             # TypeScript type definitions
│   └── index.ts       # Access control types
├── utils/             # Access control utilities
│   └── accessControl.ts    # Core access control logic
└── index.ts           # Package exports
```

## Features

- **Role-based Access Control (RBAC)**: User roles and permission management
- **Content Access Validation**: Note access based on user permissions
- **Premium Feature Gating**: Restrict features to premium users
- **Resource Authorization**: Validate access to specific resources
- **Access Control UI**: Components for access management interfaces

## Components

### AccessControl
Main wrapper component for implementing access control across the application.

```tsx
import { AccessControl } from "@ghostnote/access-control";

<AccessControl 
  requiredRole="premium" 
  fallbackComponent={<UpgradePrompt />}
>
  <PremiumFeature />
</AccessControl>
```

## Hooks

### useContentAccess
Hook for validating and managing content access permissions.

```tsx
import { useContentAccess } from "@ghostnote/access-control";

function NoteReader({ noteId }) {
  const { hasAccess, isLoading, accessType } = useContentAccess(noteId);
  
  if (isLoading) return <Loading />;
  if (!hasAccess) return <AccessDenied />;
  
  return <NoteContent />;
}
```

## Types

Core TypeScript interfaces for access control:

- `UserRole`: User permission levels
- `AccessLevel`: Content access types  
- `PermissionCheck`: Access validation results
- `AccessControlProps`: Component prop types

## Utilities

### accessControl
Core utility functions for access validation and permission checks.

```tsx
import { checkAccess, validatePermissions } from "@ghostnote/access-control";

const hasPermission = checkAccess(user, resource, action);
const canAccessNote = validatePermissions(userId, noteId, 'read');
```

## Usage in Other Packages

```tsx
// From other packages in the monorepo
import { AccessControl, useContentAccess } from "../../access-control/src/components/AccessControl";
import { checkAccess } from "../../access-control/src/utils/accessControl";
```

## Development

Key principles:
1. Secure by default - deny access unless explicitly granted
2. Role-based permissions with clear hierarchies
3. Consistent access patterns across features
4. Performance-optimized permission checks
5. Comprehensive audit logging

## Dependencies

- React for component logic
- Custom hooks for state management
- Type-safe permission validation
- Integration with auth package
