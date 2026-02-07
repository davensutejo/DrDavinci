/**
 * UUID utility functions
 * Provides UUID v4 generation with fallback support for environments
 * where crypto.randomUUID is not available (HTTP, older browsers, etc.)
 */

/**
 * Generate a UUID v4
 * Uses crypto.randomUUID if available, falls back to a simple implementation
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback UUID v4 implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
