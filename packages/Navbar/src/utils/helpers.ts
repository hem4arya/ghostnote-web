/**
 * Example utility function
 */
export const formatString = (str: string): string => {
  return str.trim().toLowerCase();
};

/**
 * Example async utility
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
