// React 19 Type Compatibility Utilities
import React from 'react';

/**
 * Type-safe component wrapper for React 19 compatibility
 * Resolves ForwardRefExoticComponent issues with JSX elements
 */
export function createSafeComponent<T>(Component: T): React.ElementType {
  return Component as React.ElementType;
}

/**
 * Safe wrappers for common Lucide icons
 * Prevents React 19 JSX compatibility issues
 */
export const createIconComponent = <T>(IconComponent: T) => {
  return createSafeComponent(IconComponent);
};

/**
 * Safe wrapper for Next.js components
 */
export const createNextComponent = <T>(NextComponent: T) => {
  return createSafeComponent(NextComponent);
};
