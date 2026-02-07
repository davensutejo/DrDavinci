
/**
 * storageService.ts
 * Provides low-level utility for hashing and local storage persistence.
 */

export const storageService = {
  /**
   * Hashes a string using SHA-256 via the Web Crypto API.
   * Falls back to a simple hash if crypto.subtle is not available.
   * This is an asynchronous operation.
   */
  async hashString(str: string): Promise<string> {
    // Try to use Web Crypto API if available
    if (crypto?.subtle?.digest) {
      try {
        const msgUint8 = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (error) {
        console.warn('Web Crypto API failed, using fallback hash:', error);
      }
    }
    
    // Fallback: simple hash function (not cryptographically secure, but works for demo)
    // This is sufficient for local development/demo purposes
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  },

  /**
   * Safely retrieves and parses a JSON item from localStorage.
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error(`Error parsing localStorage key "${key}":`, e);
      return null;
    }
  },

  /**
   * Safely stringifies and saves an item to localStorage.
   */
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving to localStorage key "${key}":`, e);
    }
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
};
