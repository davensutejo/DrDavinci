
import { SYMPTOMS_DB } from '../constants';

/**
 * Normalizes user input by lowercasing and removing special characters.
 */
const normalizeText = (text: string): string => {
  return text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
};

/**
 * Extracts symptom IDs from unstructured text using keyword matching.
 */
export const extractSymptoms = (userInput: string): string[] => {
  const normalizedInput = normalizeText(userInput);
  const foundSymptomIds = new Set<string>();

  SYMPTOMS_DB.forEach(symptom => {
    symptom.keywords.forEach(keyword => {
      // Use word boundaries for more accurate matching
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(normalizedInput)) {
        foundSymptomIds.add(symptom.id);
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
