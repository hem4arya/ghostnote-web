# Feature README Template

Copy this template to any new feature folder and customize it for that specific feature.

## 📁 Feature Structure

```
[feature-name]/
├── components/          # Reusable UI components for this feature
├── hooks/               # Custom React hooks for feature logic
├── utils/               # Utility functions and helpers
├── types/               # TypeScript type definitions (optional)
├── data/                # Mock data or constants (optional)
├── page.tsx            # Main route component (if applicable)
└── README.md           # Feature documentation
```

## 🎯 Purpose

[Describe what this feature does and its main responsibilities]

## 🔧 Key Components

### `page.tsx`
[Describe the main route component if applicable]

### `components/`
[List and describe the main components in this feature]

### `hooks/`
[Describe custom hooks and their purpose]

### `utils/`
[Describe utility functions]

## 🔄 Development Workflow

### Working on this feature:
1. Open this folder (`src/app/[feature-name]/`) in VSCode
2. Ensure the main app is running from root: `npm run dev`
3. Edit files using relative imports within this folder
4. Hot reload will work automatically

### Import patterns:
```typescript
// ✅ Relative imports (within feature)
import { ComponentName } from "./components/ComponentName";
import { useFeatureHook } from "./hooks/useFeatureHook";

// ✅ Absolute imports (external dependencies)
import { Button } from "components/ui/button";
import { utils } from "lib/utils";
```

## 📊 State Management

[Describe how state is managed in this feature]

## 🎨 Styling

- Uses Tailwind CSS with custom theme
- Responsive design patterns
- Consistent with app design system

## 🔗 External Dependencies

[List external components/utilities this feature depends on]

## 🧪 Testing

[Describe testing approach for this feature]

## 📝 Notes

[Any additional notes, considerations, or TODOs]
