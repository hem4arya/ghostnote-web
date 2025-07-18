/**
 * GhostNote Premium Navbar Package
 * A comprehensive React navbar component with premium styling and animations
 */

// Export all components and utilities from this package
export * from "./src/components";
export * from "./src/hooks";
export * from "./src/types";
export * from "./src/utils";

// Main Components for direct import
export { default as Avatar } from "./src/components/Avatar";
export { default as Navbar } from "./src/components/Navbar";
export { default as NavbarSearch } from "./src/components/NavbarSearch";
export { default as PrivateAccountSetup } from "./src/components/PrivateAccountSetup";
export { default as UserDropdown } from "./src/components/UserDropdown";

// UI Components
export { default as Button } from "./src/components/ui/Button";
export { default as Input } from "./src/components/ui/Input";
export { default as Label } from "./src/components/ui/Label";

// Hooks
export { default as useExample } from "./src/hooks/useExample";
export { default as useNavbar } from "./src/hooks/useNavbar";

// Default export for convenience
export { default } from "./src/components/Navbar";
