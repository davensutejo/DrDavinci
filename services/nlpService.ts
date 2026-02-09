
import { SYMPTOMS_DB } from '../constants';

/**
 * Normalizes user input by lowercasing and removing special characters
 * while preserving word separation.
 */
const normalizeText = (text: string): string => {
  return text.toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ") // Replace punctuation with space
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();
};

/**
 * Extracts symptom IDs from unstructured text using keyword matching.
 * Uses multiple matching strategies for robustness:
 * 1. Exact word boundary matching (primary)
 * 2. Partial phrase matching for compound keywords
 * 3. Common abbreviations and variations
 */
export const extractSymptoms = (userInput: string): string[] => {
  const normalizedInput = normalizeText(userInput);
  const foundSymptomIds = new Set<string>();

  SYMPTOMS_DB.forEach(symptom => {
    symptom.keywords.forEach(keyword => {
      const normalizedKeyword = normalizeText(keyword);
      
      // Strategy 1: Exact word boundary match (highest priority)
      const wordBoundaryRegex = new RegExp(`\\b${normalizedKeyword}\\b`, 'i');
      if (wordBoundaryRegex.test(normalizedInput)) {
        foundSymptomIds.add(symptom.id);
        return;
      }
      
      // Strategy 2: Phrase contains keyword (for multi-word symptoms)
      if (normalizedInput.includes(normalizedKeyword)) {
        foundSymptomIds.add(symptom.id);
        return;
      }
      
      // Strategy 3: Check for partial match (only if keyword is 3+ chars)
      // This handles typos and colloquial speech
      if (normalizedKeyword.length >= 3) {
        // Check if input contains significant portion of keyword
        const inputWords = normalizedInput.split(' ');
        const keywordWords = normalizedKeyword.split(' ');
        
        // If all keyword words appear (in any order), it's a match
        const allKeywordWordsFound = keywordWords.every(kw => 
          inputWords.some(iw => iw.includes(kw) || kw.includes(iw))
        );
        
        if (allKeywordWordsFound && keywordWords.length > 1) {
          foundSymptomIds.add(symptom.id);
          return;
        }
      }
    });
  });

  return Array.from(foundSymptomIds);
};

/**
 * Maps symptom IDs back to their display labels for UI feedback.
 */
export const getSymptomLabels = (ids: string[]): string[] => {
  return ids.map(id => SYMPTOMS_DB.find(s => s.id === id)?.label || id);
};
