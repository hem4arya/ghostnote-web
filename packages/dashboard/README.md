# Dashboard Package

Creator dashboard and analytics for the GhostNote platform.

## Overview

This package provides dashboard functionality for content creators including clone detection monitoring, analytics, and account management features.

## Architecture

```
src/
├── components/          # Dashboard UI components
│   ├── CreatorCloneDashboard.tsx  # Main clone detection dashboard
│   ├── DashboardTabs.tsx          # Navigation tabs
│   └── QuickStats.tsx             # Statistics widgets
├── hooks/              # Dashboard hooks
│   └── useDashboard.ts    # Dashboard state management
├── types/              # TypeScript type definitions
│   └── index.ts           # Dashboard types
├── utils/              # Dashboard utilities
│   └── analytics.ts       # Analytics functions
└── index.ts            # Internal exports
```

## Components

### CreatorCloneDashboard
Main dashboard component for content creators.
```tsx
import { CreatorCloneDashboard } from "@ghostnote/dashboard";

<CreatorCloneDashboard userId={currentUser.id} />
```

### DashboardTabs
Navigation component for different dashboard sections.
```tsx
import { DashboardTabs } from "@ghostnote/dashboard";

<DashboardTabs activeTab="analytics" onTabChange={handleTabChange} />
```

### QuickStats
Statistics widget component for key metrics.
```tsx
import { QuickStats } from "@ghostnote/dashboard";

<QuickStats 
  totalNotes={stats.notes}
  totalEarnings={stats.earnings}
  cloneDetections={stats.clones}
/>
```

## Features

- **Clone Detection Dashboard**: Monitor and manage content clones
- **Analytics & Metrics**: Track content performance and earnings
- **Creator Tools**: Content management and optimization tools
- **Real-time Notifications**: Clone alerts and system updates
- **Export Capabilities**: Download reports and analytics data

## Hooks

### useDashboard
Hook for managing dashboard state and data.
```tsx
import { useDashboard } from "@ghostnote/dashboard";

const { 
  stats, 
  cloneAlerts, 
  loading, 
  refreshData 
} = useDashboard(userId);
```

## Types

Dashboard TypeScript types:
- `DashboardStats`: Analytics and metrics data
- `CloneAlert`: Clone detection notifications
- `CreatorMetrics`: Creator-specific statistics
- `DashboardTab`: Navigation tab configuration

## Usage in Other Packages

```tsx
// Import dashboard components
import { CreatorCloneDashboard, QuickStats } from "../../dashboard/src";

function CreatorPage() {
  return (
    <div>
      <QuickStats />
      <CreatorCloneDashboard />
    </div>
  );
}
```

## Integration

### With Transparency Package
- Clone detection alerts
- Transparency scoring
- Content analysis tools

### With Notes Package
- Content management
- Performance analytics
- Revenue tracking

## Development

To extend the dashboard:
1. Add new components in `src/components/`
2. Create analytics functions in `src/utils/analytics.ts`
3. Implement hooks in `src/hooks/`
4. Define types in `src/types/index.ts`
5. Export from `src/index.ts`
6. Update this README

## Dependencies

- React for component logic
- Charts and visualization libraries
- Real-time data connections
- Analytics and metrics APIs
