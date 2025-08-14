# Design Document

## Overview

This design document outlines the redesign of the authentication form system to provide distinct user experiences for sign-in and sign-up flows, improve the private account creation interface, and enhance visual consistency. The solution will transform the current single-form approach into a comprehensive authentication system with proper form differentiation, real-time validation, and improved user experience.

## Architecture

### Component Structure

```
AuthForm (Main Container)
├── SignInForm (Sign-in specific form)
├── SignUpForm (Sign-up specific form)  
├── SocialAuthButtons (GitHub, Google, Private Account)
├── FormToggle (Switch between sign-in/sign-up)
└── ValidationProvider (Real-time validation context)

PrivateAccountSetup (Separate Dialog)
├── PrivateAccountForm (Email, password, confirm password)
├── PasswordVisibilityToggle (Eye icon functionality)
└── PasswordMatchValidator (Real-time password matching)
```

### State Management

The authentication forms will use local React state with the following structure:

```typescript
interface AuthState {
  mode: 'sign_in' | 'sign_up';
  formData: {
    email: string;
    password: string;
    confirmPassword?: string; // Only for sign-up
  };
  validation: {
    emailValid: boolean;
    passwordValid: boolean;
    passwordsMatch?: boolean; // Only for sign-up
  };
  showPassword: boolean;
  showConfirmPassword?: boolean; // Only for sign-up
  loading: boolean;
  errors: Record<string, string>;
}
```

## Components and Interfaces

### AuthForm Component

**Purpose:** Main authentication dialog that switches between sign-in and sign-up modes

**Props:**
```typescript
interface AuthFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  view?: 'sign_in' | 'sign_up';
  onOpenPrivateAccount?: () => void;
}
```

**Key Features:**
- Dynamic title and description based on mode
- Form mode switching with data clearing
- Integration with social authentication
- Responsive design with consistent styling

### SignInForm Component

**Purpose:** Dedicated sign-in form with email and password fields

**Fields:**
- Email (with email validation)
- Password (with visibility toggle)

**Validation:**
- Real-time email format validation
- Required field validation
- Authentication error handling

### SignUpForm Component

**Purpose:** Dedicated sign-up form with additional confirmation field

**Fields:**
- Email (with email validation)
- Password (with visibility toggle)
- Confirm Password (with visibility toggle and matching validation)

**Validation:**
- Real-time email format validation
- Password strength indicators
- Real-time password matching validation
- Required field validation

### SocialAuthButtons Component

**Purpose:** Social authentication options with improved iconography

**Buttons:**
1. **GitHub** - Uses existing GitHub icon from lucide-react
2. **Google** - Uses proper Google icon (replacing Chrome icon)
3. **Private Account** - Uses Shield or UserPlus icon for privacy indication

**Design:**
- Consistent circular button design
- Hover effects with scale and opacity changes
- Proper ARIA labels for accessibility
- Visual grouping with "Or continue with" separator

### PrivateAccountSetup Component

**Purpose:** Enhanced private account creation dialog

**Features:**
- Dedicated dialog with clear privacy messaging
- Email, password, and confirm password fields
- Real-time password matching validation
- Password visibility toggles for both password fields
- Loading states during account creation
- Success/error feedback

### FormToggle Component

**Purpose:** Navigation between sign-in and sign-up modes

**Implementation:**
- Context-aware text ("Don't have an account? Sign up" vs "Already have an account? Sign in")
- Smooth transition between modes
- Form data clearing on mode switch
- Consistent styling with hover effects
-Transparent glass effect in background
-Purple 90% green 10%

## Data Models

### Form Validation Schema

```typescript
interface ValidationRules {
  email: {
    required: true;
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    message: string;
  };
  password: {
    required: true;
    minLength: 8;
    message: string;
  };
  confirmPassword: {
    required: true; // Only for sign-up
    mustMatch: 'password';
    message: string;
  };
}
```

### Authentication Response Types

```typescript
interface AuthResponse {
  success: boolean;
  user?: User;
  error?: {
    code: string;
    message: string;
    field?: string;
  };
}
```

## Error Handling

### Validation Errors

**Real-time Validation:**
- Email format validation on blur
- Password matching validation on keystroke (debounced)
- Visual indicators (red borders, error messages)
- Field-specific error messages

**Error Display Strategy:**
- Inline errors below each field
- Non-intrusive styling that doesn't break layout
- Clear, actionable error messages
- Error clearing on successful validation

### Authentication Errors

**Error Categories:**
1. **Network Errors** - Connection issues, timeouts
2. **Validation Errors** - Invalid credentials, weak passwords
3. **Account Errors** - Account already exists, account not found
4. **OAuth Errors** - Social login failures

**Error Handling:**
- Global error display at form level
- Specific field highlighting for field-related errors
- Retry mechanisms for network errors
- Clear error messages with suggested actions

## Testing Strategy

### Unit Testing

**Component Testing:**
- Form rendering in different modes
- Validation logic testing
- State management testing
- Event handler testing

**Validation Testing:**
- Email format validation
- Password matching validation
- Required field validation
- Error message display

### Integration Testing

**Authentication Flow Testing:**
- Sign-in flow with valid/invalid credentials
- Sign-up flow with password matching
- Social authentication flows
- Private account creation flow

**User Experience Testing:**
- Form mode switching
- Password visibility toggling
- Real-time validation feedback
- Loading states and error handling

### Accessibility Testing

**ARIA Compliance:**
- Proper form labels and descriptions
- Error message associations
- Focus management
- Screen reader compatibility

**Keyboard Navigation:**
- Tab order through form elements
- Enter key submission
- Escape key dialog closing
- Arrow key navigation where applicable

## Visual Design Specifications

### Form Layout

**Desktop Layout:**
- Single column form with 400px max width
- 24px spacing between form elements
- 16px padding around form content
- Centered dialog with backdrop blur

**Mobile Layout:**
- Full-width form with 16px side margins
- Responsive font sizes
- Touch-friendly button sizes (44px minimum)
- Optimized keyboard handling

### Color Scheme

**Form Elements:**
- Input backgrounds: `bg-muted/30` with `border-border/50`
- Button primary: `bg-primary` with hover states
- Error states: Red border and text
- Success states: Green border and text

**Social Buttons:**
- Consistent circular design with `bg-primary`
- Hover effects with `hover:bg-primary/80`
- Icon colors: White for contrast

### Typography

**Form Labels:**
- Font size: `text-sm`
- Font weight: `font-medium`
- Color: `text-foreground`

**Error Messages:**
- Font size: `text-xs`
- Color: `text-destructive`
- Positioning: Below respective fields

### Icons and Imagery

**Password Visibility Icons:**
- Eye icon for showing password
- EyeOff icon for hiding password
- Positioned at right edge of input fields

**Social Authentication Icons:**
- GitHub: Existing lucide-react Github icon
- Google: Replace Chrome icon with proper Google icon (consider using react-icons or custom SVG)
- Private Account: Shield or UserPlus icon from lucide-react

**Icon Specifications:**
- Size: 16px (h-4 w-4) for input icons, 24px (h-6 w-6) for social buttons
- Color: Consistent with design system
- Hover states: Slight opacity or color changes

## Implementation Considerations

### Performance Optimizations

**Form Validation:**
- Debounced validation for password matching (300ms delay)
- Memoized validation functions
- Efficient re-rendering with React.memo where appropriate

**State Management:**
- Local state for form data to avoid unnecessary re-renders
- Context for shared validation logic
- Optimistic UI updates for better perceived performance

### Accessibility Features

**Form Accessibility:**
- Proper form labels and ARIA attributes
- Error message associations with aria-describedby
- Focus management for modal dialogs
- High contrast mode support

**Keyboard Support:**
- Tab navigation through all interactive elements
- Enter key for form submission
- Escape key for dialog closing
- Space/Enter for button activation

### Browser Compatibility

**Supported Features:**
- CSS Grid and Flexbox for layouts
- CSS custom properties for theming
- Modern JavaScript features (ES2020+)
- Progressive enhancement for older browsers

### Security Considerations

**Input Validation:**
- Client-side validation for UX, server-side for security
- XSS prevention through proper input sanitization
- CSRF protection for form submissions
- Secure password handling (no logging, proper clearing)

**OAuth Security:**
- Proper redirect URI validation
- State parameter for CSRF protection
- Secure token handling
- Privacy-compliant social login flows