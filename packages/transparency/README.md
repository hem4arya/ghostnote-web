# Transparency Package

Content transparency and clone detection for the GhostNote platform.

## Overview

This package provides transparency features including clone detection, content analysis, transparency scoring, and clone prevention systems to protect original content and maintain platform integrity.

## Architecture

```
src/
├── components/          # Transparency UI components
│   ├── Alerts.tsx              # Transparency alert components
│   ├── CloneAlerts.tsx         # Clone detection alerts
│   ├── CloneTransparencyBadge.tsx # Transparency scoring badge
│   ├── CloneTransparencyWrapper.tsx # Content transparency wrapper
│   ├── CloneTransparencyWrapperDev.tsx # Development wrapper
│   ├── CloneWarningModal.tsx   # Clone warning modal
│   └── TransparencyUI.tsx      # Main transparency interface
├── hooks/              # Transparency hooks
│   ├── useCloneDetection.ts    # Clone detection logic
│   └── useTransparency.ts      # Transparency scoring
├── types/              # TypeScript type definitions
│   └── index.ts               # Transparency types
├── utils/              # Transparency utilities
│   └── transparencyHelpers.ts # Helper functions
└── index.ts            # Package exports
```

## Components

### CloneTransparencyWrapper
Main wrapper component for content transparency features.
```tsx
import { CloneTransparencyWrapper } from "@ghostnote/transparency";

<CloneTransparencyWrapper contentId="note-123" authorId="user-456">
  <NoteContent />
</CloneTransparencyWrapper>
```

### CloneTransparencyWrapperDev
Development version with enhanced debugging features.
```tsx
import { CloneTransparencyWrapperDev } from "@ghostnote/transparency";

<CloneTransparencyWrapperDev 
  contentId="note-123"
  debugMode={true}
  showMetrics={true}
>
  <NoteContent />
</CloneTransparencyWrapperDev>
```

### CloneTransparencyBadge
Badge component displaying transparency score.
```tsx
import { CloneTransparencyBadge } from "@ghostnote/transparency";

<CloneTransparencyBadge 
  score={transparencyScore}
  level="high"
  showDetails={true}
/>
```

### CloneAlerts
Alert system for clone detection notifications.
```tsx
import { CloneAlerts } from "@ghostnote/transparency";

<CloneAlerts 
  userId={currentUser.id}
  onCloneDetected={handleCloneAlert}
  autoRefresh={true}
/>
```

### CloneWarningModal
Modal for displaying clone warnings and actions.
```tsx
import { CloneWarningModal } from "@ghostnote/transparency";

<CloneWarningModal
  isOpen={showWarning}
  cloneData={detectedClone}
  onAction={handleCloneAction}
  onClose={handleClose}
/>
```

### TransparencyUI
Main transparency dashboard interface.
```tsx
import { TransparencyUI } from "@ghostnote/transparency";

<TransparencyUI 
  contentId={noteId}
  authorId={authorId}
  showHistory={true}
/>
```

## Features

- **Clone Detection**: AI-powered content similarity detection
- **Transparency Scoring**: Content originality scoring system
- **Real-time Monitoring**: Continuous clone detection monitoring
- **Alert System**: Notifications for clone detection events
- **Action Management**: Tools for handling detected clones
- **Analytics Dashboard**: Transparency metrics and insights
- **Historical Tracking**: Timeline of transparency events

## Hooks

### useCloneDetection
Hook for managing clone detection state and operations.
```tsx
import { useCloneDetection } from "@ghostnote/transparency";

const { 
  clones, 
  detecting, 
  scanForClones, 
  reportClone,
  dismissClone 
} = useCloneDetection(contentId);
```

### useTransparency
Hook for transparency scoring and metrics.
```tsx
import { useTransparency } from "@ghostnote/transparency";

const { 
  score, 
  level, 
  metrics, 
  updateScore,
  getHistory 
} = useTransparency(contentId);
```

## Types

Transparency TypeScript types:
- `TransparencyScore`: Scoring system data
- `CloneDetection`: Clone detection results
- `TransparencyEvent`: Transparency timeline events
- `CloneAction`: Actions taken on detected clones
- `TransparencyMetrics`: Analytics and metrics data

## Clone Detection Algorithms

- **Simhash Fingerprinting**: Fast similarity detection
- **Content Analysis**: Deep content structure comparison
- **Semantic Similarity**: AI-powered meaning comparison
- **Threshold Management**: Configurable similarity thresholds
- **False Positive Reduction**: Advanced filtering algorithms

## Usage in Other Packages

```tsx
// Import transparency components
import { CloneTransparencyWrapper, CloneAlerts } from "../../transparency/src";

function ProtectedNote({ noteId, authorId }: { noteId: string, authorId: string }) {
  return (
    <CloneTransparencyWrapper contentId={noteId} authorId={authorId}>
      <NoteContent />
      <CloneAlerts userId={authorId} />
    </CloneTransparencyWrapper>
  );
}
```

## Integration

### With Notes Package
- Note content protection
- Author clone monitoring
- Content integrity validation

### With Dashboard Package
- Creator transparency dashboard
- Clone detection analytics
- Performance metrics

### With Auth Package
- User-specific transparency settings
- Author verification
- Permission-based access

## Development

To extend transparency features:
1. Add new components in `src/components/`
2. Implement detection algorithms in `src/utils/transparencyHelpers.ts`
3. Create hooks in `src/hooks/`
4. Define types in `src/types/index.ts`
5. Export from `index.ts`
6. Update this README

## Dependencies

- React for component logic
- AI/ML services for clone detection
- Real-time monitoring systems
- Analytics and metrics APIs
