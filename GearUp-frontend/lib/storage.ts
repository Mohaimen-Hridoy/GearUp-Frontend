/**
 * Local storage utilities with type safety
 */

export const storage = {
  /**
   * Get item from localStorage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === "undefined") return defaultValue ?? null;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue ?? null;
    }
  },

  /**
   * Set item in localStorage
   */
  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key: string): void {
    if (typeof window === "undefined") return;
    
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear(): void {
    if (typeof window === "undefined") return;
    
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};
