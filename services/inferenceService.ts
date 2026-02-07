
import { DISEASES_DB, SYMPTOMS_DB } from '../constants';
import { AnalysisResult } from '../types';

/**
 * Helper to find disease candidates in the local DB based on detected symptoms.
 * This is now used by the AI service to cross-reference or provide fallback structured data.
 */
export const matchLocalDiseases = (foundSymptomIds: string[]): AnalysisResult[] => {
  if (foundSymptomIds.length === 0) return [];

  const results: AnalysisResult[] = DISEASES_DB.map(disease => {
    const matchedSymptoms = disease.symptoms.filter(s => foundSymptomIds.includes(s));
    
    // Weighted scoring logic
    const sensitivity = matchedSymptoms.length / disease.symptoms.length;
    const specificity = foundSymptomIds.length > 0 ? matchedSymptoms.length / foundSymptomIds.length : 0;
    
    const combinedScore = (sensitivity * 0.7) + (specificity * 0.3);

    return {
      disease,
      score: combinedScore,
      matchedSymptoms
    };
  });

  return results
    .filter(res => res.score > 0.15)
    .sort((a, b) => b.score - a.score);
};

/**
 * Returns a list of all local symptom IDs for context injection.
 */
export const getKnownSymptomIds = (): string[] => SYMPTOMS_DB.map(s => s.id);
