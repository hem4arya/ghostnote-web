import { ReactNode } from "react";

/**
 * User information interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

/**
 * Menu item for dropdown menus and navigation
 */
export interface MenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

/**
 * Main Navbar component props
 */
export interface NavbarProps {
  /**
   * The current user, if authenticated
   */
  user: User | null;

  /**
   * Callback when login button is clicked
   */
  onLoginClick: () => void;

  /**
   * Callback when signup button is clicked
   */
  onSignUpClick?: () => void;

  /**
   * Current route, will be auto-detected if not provided
   * Used for determining when to show back button vs. logo
   */
  route?: string;

  /**
   * Override specific parts of the navbar
   */
  overrides?: Partial<NavbarOverrides>;
}

/**
 * Navbar customization options
 */
export interface NavbarOverrides {
  /**
   * Custom logo component
   */
  logo: ReactNode;

  /**
   * Additional menu items to show in user dropdown
   */
  menuItems: MenuItem[];

  /**
   * Additional buttons to show on right side
   */
  rightButtons: ReactNode;

  /**
   * Additional CSS classes for the navbar container
   */
  className: string;

  /**
   * Custom search placeholder
   */
  searchPlaceholder: string;

  /**
   * Hide search functionality
   */
  hideSearch: boolean;
}

/**
 * User dropdown menu component props
 */
export interface UserDropdownProps {
  user: User;
  menuItems?: MenuItem[];
}

/**
 * Avatar component props
 */
export interface AvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

/**
 * Search input component props
 */
export interface NavbarSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}
