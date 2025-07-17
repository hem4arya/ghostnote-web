/**
 * Utility function to merge classNames
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Utility to check if we're in a browser environment
 */
export const isBrowser = typeof window !== "undefined";

/**
 * Example async utility
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
