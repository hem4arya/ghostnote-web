/**
 * Shared UI Components - Centralized exports
 * Re-exports all UI components for easy importing
 */

// Badge
export { Badge, badgeVariants } from './components/badge';
export type { BadgeProps } from './components/badge';

// Button
export { Button, buttonVariants } from './components/button';
export type { ButtonProps } from './components/button';

// Card
export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent
} from './components/card';

// Dialog
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogOverlay
} from './components/dialog';

// Input
export { Input } from './components/input';

// Label
export { Label } from './components/label';

// Progress
export { Progress } from './components/progress';

// Select
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator
} from './components/select';

// Separator
export { Separator } from './components/separator';

// Slider
export { Slider } from './components/slider';

// Switch
export { Switch } from './components/switch';

// Tabs
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from './components/tabs';

// Textarea
export { Textarea } from './components/textarea';

// Tooltip
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from './components/tooltip';
