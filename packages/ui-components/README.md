# UI Components Package

A comprehensive collection of reusable UI components built with Radix UI primitives and styled with Tailwind CSS.

## Overview

This package provides a set of accessible, customizable components that form the foundation of the GhostNote application's user interface. All components are built using Radix UI for accessibility and behavior, with custom styling using Tailwind CSS and class-variance-authority for consistent design system implementation.

## Architecture

```
src/
├── components/          # All UI components
│   ├── badge.tsx       # Status indicators and labels
│   ├── button.tsx      # Interactive buttons with variants
│   ├── card.tsx        # Content containers
│   ├── dialog.tsx      # Modal dialogs
│   ├── input.tsx       # Form input fields
│   ├── label.tsx       # Form labels
│   ├── progress.tsx    # Progress indicators
│   ├── select.tsx      # Dropdown selections
│   ├── separator.tsx   # Visual dividers
│   ├── slider.tsx      # Range sliders
│   ├── switch.tsx      # Toggle switches
│   ├── tabs.tsx        # Tab navigation
│   ├── textarea.tsx    # Multi-line text input
│   └── tooltip.tsx     # Hover tooltips
├── lib/
│   └── utils.ts        # Utility functions (cn helper)
└── index.ts            # Package exports
```

## Components

### Core Components

#### Button
Interactive button component with multiple variants and sizes.
```tsx
import { Button } from "@ghostnote/ui-components";

<Button variant="default" size="md">Click me</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="outline" size="lg">Outline</Button>
```

**Variants:** `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Sizes:** `sm`, `md`, `lg`, `icon`

#### Input
Form input component with built-in styling and focus states.
```tsx
import { Input } from "@ghostnote/ui-components";

<Input type="text" placeholder="Enter text..." />
<Input type="email" placeholder="Email address" />
```

#### Card
Container component for organizing content with header, content, and footer sections.
```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@ghostnote/ui-components";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### Form Components

#### Label
Accessible form labels with proper association.
```tsx
import { Label } from "@ghostnote/ui-components";

<Label htmlFor="email">Email Address</Label>
```

#### Textarea
Multi-line text input component.
```tsx
import { Textarea } from "@ghostnote/ui-components";

<Textarea placeholder="Enter your message..." />
```

#### Select
Dropdown selection component with keyboard navigation.
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ghostnote/ui-components";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### Switch
Toggle switch component for boolean values.
```tsx
import { Switch } from "@ghostnote/ui-components";

<Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
```

#### Slider
Range slider component for numeric values.
```tsx
import { Slider } from "@ghostnote/ui-components";

<Slider value={[value]} onValueChange={setValue} max={100} step={1} />
```

### Layout & Navigation

#### Tabs
Tab navigation component with keyboard support.
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ghostnote/ui-components";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

#### Separator
Visual divider component for content sections.
```tsx
import { Separator } from "@ghostnote/ui-components";

<Separator orientation="horizontal" />
<Separator orientation="vertical" />
```

### Feedback Components

#### Badge
Status indicators and labels with variant styling.
```tsx
import { Badge } from "@ghostnote/ui-components";

<Badge variant="default">New</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Draft</Badge>
```

**Variants:** `default`, `secondary`, `destructive`, `outline`

#### Progress
Progress indicator for loading states and completion tracking.
```tsx
import { Progress } from "@ghostnote/ui-components";

<Progress value={progress} max={100} />
```

#### Tooltip
Hover tooltips for additional information.
```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ghostnote/ui-components";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      <p>Tooltip content</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Modal Components

#### Dialog
Modal dialog component for overlays and confirmations.
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@ghostnote/ui-components";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content goes here.</p>
  </DialogContent>
</Dialog>
```

## Utilities

### cn Function
Utility function for conditional class name merging using clsx and tailwind-merge.
```tsx
import { cn } from "@ghostnote/ui-components";

const className = cn(
  "base-classes",
  condition && "conditional-classes",
  variant === "primary" && "primary-classes"
);
```

## Design System

### Color Variants
- **Default:** Primary brand colors
- **Secondary:** Muted colors for secondary actions
- **Destructive:** Red colors for dangerous actions
- **Outline:** Border-only styling for subtle actions
- **Ghost:** Minimal styling for text-like buttons
- **Link:** Link-style appearance

### Size Scale
- **sm:** Small components for compact layouts
- **md:** Default medium size for most use cases
- **lg:** Large components for emphasis
- **icon:** Square sizing for icon-only buttons

## Dependencies

- **@radix-ui/react-*:** Accessible component primitives
- **class-variance-authority:** Type-safe variant styling
- **clsx:** Conditional class name utility
- **tailwind-merge:** Tailwind class conflict resolution
- **lucide-react:** Icon components

## Usage in Other Packages

Import components using relative paths:
```tsx
// From other packages in the monorepo
import { Button } from "../../ui-components/src/components/button";
import { Input } from "../../ui-components/src/components/input";
import { Card } from "../../ui-components/src/components/card";
```

Or use the package export:
```tsx
// If properly configured in tsconfig paths
import { Button, Input, Card } from "@ghostnote/ui-components";
```

## Development

To add new components:
1. Create component file in `src/components/`
2. Follow Radix UI pattern for accessibility
3. Use `class-variance-authority` for variants
4. Export from `src/index.ts`
5. Update this README with component documentation

## Accessibility

All components are built with accessibility in mind:
- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance
