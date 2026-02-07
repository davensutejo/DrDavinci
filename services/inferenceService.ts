
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
 * Blends local inference score with AI grounding confidence.
 * Returns an adjusted score based on both local matching and external validation.
 * 
 * @param localScore - Score from local symptom matching (0-1)
 * @param aiConfidence - Confidence score from Gemini grounding (0-1)
 * @param aiWeight - Weight for AI confidence in the blend (0-1), default 0.4
 * @returns Blended score accounting for both local and AI validation
 */
export const blendScoresWithAI = (
  localScore: number,
  aiConfidence: number = 0.5,
  aiWeight: number = 0.4
): number => {
  // Local score has 60% weight, AI confidence has 40% weight
  const blendedScore = (localScore * (1 - aiWeight)) + (aiConfidence * aiWeight);
  // Ensure score stays between 0 and 1
  return Math.min(1, Math.max(0, blendedScore));
};

/**
 * Extracts confidence score from Gemini response text.
 * Looks for confidence indicators in the AI response.
 * 
 * @param geminiResponse - The text response from Gemini
 * @returns Confidence score (0-1) based on response content
 */
export const extractAIConfidence = (geminiResponse: string): number => {
  if (!geminiResponse) return 0.5;
  
  const responseLower = geminiResponse.toLowerCase();
  
  // High confidence indicators
  if (responseLower.includes('highly likely') || 
      responseLower.includes('very likely') ||
      responseLower.includes('strongly suggest') ||
      responseLower.includes('consistent with')) {
    return 0.9;
  }
  
  // Medium-high confidence
  if (responseLower.includes('likely') || 
      responseLower.includes('suggest') ||
      responseLower.includes('probable') ||
      responseLower.includes('typical of')) {
    return 0.75;
  }
  
  // Medium confidence
  if (responseLower.includes('possible') || 
      responseLower.includes('may indicate') ||
      responseLower.includes('could be')) {
    return 0.6;
  }
  
  // Lower confidence (needs more investigation)
  if (responseLower.includes('consider') || 
      responseLower.includes('evaluate') ||
      responseLower.includes('rule out')) {
    return 0.45;
  }
  
  // Default to neutral if no clear indicators
  return 0.5;
};

/**
 * Returns a list of all local symptom IDs for context injection.
 */
export const getKnownSymptomIds = (): string[] => SYMPTOMS_DB.map(s => s.id);
