// Main navbar feature exports
export { default as Navbar } from './Navbar';
export { default } from './Navbar';

// Components
export { MobileMenu, UserDropdown, NavbarSearch, NavigationButtons, AuthButton, PrivateAccountSetup } from './components';

// Hooks
export { useNavbar } from './hooks/useNavbar';
export { useAuth } from './hooks/useAuth';

// Types
export type { 
  NavbarProps, 
  SearchState, 
  AuthMode, 
  User,
  UserPreferences,
  NavbarVariant,
  SearchSuggestion,
  NavbarSearchProps,
  MobileMenuProps,
  UserDropdownProps,
  NavigationButtonsProps,
  NavbarState,
  NavbarActions
} from './types';

// Utils
export * from './utils';

// UI Components (re-export for convenience)
export { Button } from './ui/button';
export { Input } from './ui/input';
