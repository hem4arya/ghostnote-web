export interface NavbarProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  user?: User;
  isAuthenticated?: boolean;
  variant?: NavbarVariant;
}

export interface SearchState {
  isOpen: boolean;
  query: string;
}

export type AuthMode = 'login' | 'signup';

export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  isPremium?: boolean;
  createdAt?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  searchHistory?: string[];
  recentlyViewed?: string[];
}

export type NavbarVariant = 'homepage' | 'dashboard' | 'note' | 'auth' | 'default';

export interface SearchSuggestion {
  id: string;
  title: string;
  type: 'note' | 'recent' | 'trending';
  excerpt?: string;
  timestamp?: string;
  relevance?: number;
}

export interface NavbarSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
}

export interface MobileMenuProps {
  isAuthenticated?: boolean;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  onSearchClick?: () => void;
}

export interface UserDropdownProps {
  user?: User;
  onSignOut?: () => void;
}

export interface NavigationButtonsProps {
  isAuthenticated?: boolean;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  showCreateButton?: boolean;
}

export interface NavbarState {
  isSearchOpen: boolean;
  searchQuery: string;
  isUserMenuOpen: boolean;
  isMobileMenuOpen: boolean;
}

export interface NavbarActions {
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  toggleUserMenu: () => void;
  toggleMobileMenu: () => void;
  navigateToSearch: (query: string) => void;
  handleAuth: (mode: AuthMode) => void;
}
// Re-export auth types
export * from './auth';