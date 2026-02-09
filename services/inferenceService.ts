
import { DISEASES_DB, SYMPTOMS_DB } from '../constants';
import { AnalysisResult } from '../types';

/**
 * Helper to find disease candidates in the local DB based on detected symptoms.
 * This is now used by the AI service to cross-reference or provide fallback structured data.
 * 
 * Scoring Methodology:
 * - Sensitivity: Matches disease required symptoms / total disease symptoms (70% weight)
 * - Specificity: Matched symptoms / user symptoms (30% weight)
 * - Filters diseases < 0.15 combined score (weak matches)
 * - Returns top matches ranked by score
 */
export const matchLocalDiseases = (foundSymptomIds: string[]): AnalysisResult[] => {
  if (foundSymptomIds.length === 0) return [];

  const results: AnalysisResult[] = DISEASES_DB.map(disease => {
    const matchedSymptoms = disease.symptoms.filter(s => foundSymptomIds.includes(s));
    
    // Weighted scoring logic
    // Sensitivity: How many of the disease's symptoms are present?
    const sensitivity = disease.symptoms.length > 0 
      ? matchedSymptoms.length / disease.symptoms.length 
      : 0;
    
    // Specificity: Of the user's symptoms, how many match this disease?
    const specificity = foundSymptomIds.length > 0 
      ? matchedSymptoms.length / foundSymptomIds.length 
      : 0;
    
    // Weighted combination: Sensitivity heavily prioritized (70%)
    // Over-matching prevention: Specificity acts as tiebreaker (30%)
    const combinedScore = (sensitivity * 0.7) + (specificity * 0.3);

    return {
      disease,
      score: combinedScore,
      matchedSymptoms
    };
  });

  // Filter out weak matches (< 0.15 score threshold)
  const filtered = results.filter(res => res.score > 0.15);
  
  // Sort by score descending (highest confidence first)
  const sorted = filtered.sort((a, b) => b.score - a.score);
  
  // Return top 10 matches to avoid overwhelming results
  return sorted.slice(0, 10);
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
 * Analyzes linguistic indicators to assess certainty level.
 * 
 * Confidence Scale:
 * 0.9 - Very high confidence (highly likely, very likely, consistent with)
 * 0.75 - High confidence (likely, suggest, probable, typical)
 * 0.6 - Moderate confidence (possible, may indicate, could be)
 * 0.45 - Low confidence (consider, evaluate, rule out, investigate)
 * 0.5 - Neutral/unknown confidence (default fallback)
 * 
 * @param geminiResponse - The text response from Gemini
 * @returns Confidence score (0-1) based on response content
 */
export const extractAIConfidence = (geminiResponse: string): number => {
  if (!geminiResponse || geminiResponse.trim().length === 0) return 0.5;
  
  const responseLower = geminiResponse.toLowerCase();
  
  // High confidence indicators (0.9)
  if (responseLower.includes('highly likely') || 
      responseLower.includes('very likely') ||
      responseLower.includes('strongly suggest') ||
      responseLower.includes('consistent with') ||
      responseLower.includes('definitive') ||
      responseLower.includes('certainly') ||
      responseLower.includes('almost certainly')) {
    return 0.9;
  }
  
  // Medium-high confidence (0.75)
  if (responseLower.includes('likely') || 
      responseLower.includes('suggest') ||
      responseLower.includes('probable') ||
      responseLower.includes('typical of') ||
      responseLower.includes('strongly associated') ||
      responseLower.includes('most common') ||
      responseLower.includes('most probable')) {
    return 0.75;
  }
  
  // Moderate confidence (0.6)
  if (responseLower.includes('possible') || 
      responseLower.includes('may indicate') ||
      responseLower.includes('could be') ||
      responseLower.includes('might suggest') ||
      responseLower.includes('appears to') ||
      responseLower.includes('compatible with')) {
    return 0.6;
  }
  
  // Lower confidence - needs investigation (0.45)
  if (responseLower.includes('consider') || 
      responseLower.includes('evaluate') ||
      responseLower.includes('rule out') ||
      responseLower.includes('should investigate') ||
      responseLower.includes('warrants testing') ||
      responseLower.includes('further evaluation') ||
      responseLower.includes('less likely')) {
    return 0.45;
  }

  // Negative indicators lower confidence
  if (responseLower.includes('unlikely') ||
      responseLower.includes('not consistent') ||
      responseLower.includes('does not match') ||
      responseLower.includes('inconsistent with')) {
    return 0.35;
  }
  
  // Default to neutral if no clear indicators
  return 0.5;
};

/**
 * Returns a list of all local symptom IDs for context injection.
 */
export const getKnownSymptomIds = (): string[] => SYMPTOMS_DB.map(s => s.id);

/**
 * Calculates disease prioritization score for better ranking.
 * Factors in number of matched symptoms and their clinical significance.
 * 
 * @param matchedCount - Number of symptoms matched
 * @param totalDiseaseSymptoms - Total symptoms for disease
 * @param totalUserSymptoms - Total symptoms user mentioned
 * @returns Priority factor (0-1) for ranking
 */
export const calculatePriority = (
  matchedCount: number, 
  totalDiseaseSymptoms: number,
  totalUserSymptoms: number
): number => {
  // Prioritize diseases with more matched symptoms
  const completenessRatio = totalDiseaseSymptoms > 0 
    ? matchedCount / totalDiseaseSymptoms 
    : 0;
  
  // Penalize diseases that don't match well with user input
  const focusRatio = totalUserSymptoms > 0 
    ? matchedCount / totalUserSymptoms 
    : 0;
  
  // Combined priority (60% completeness, 40% focus)
  return (completenessRatio * 0.6) + (focusRatio * 0.4);
};

/**
 * Scores severity based on symptom keywords.
 * Identifies emergency red flags from symptom names.
 * 
 * Severity Levels:
 * 0 = Low severity (common cold-like)
 * 1 = Medium severity (requires evaluation)
 * 2 = High severity (medical attention needed)
 * 
 * @param foundSymptomIds - Array of symptom IDs
 * @returns Severity score (0-2)
 */
export const estimateSeverity = (foundSymptomIds: string[]): number => {
  const severityKeywords = {
    critical: ['chest_pain', 'shortness_of_breath', 'difficulty_swallowing', 'neck_stiffness'],
    moderate: ['fever', 'vomiting', 'hematuria', 'sensitivity_to_light', 'palpitations'],
    mild: ['runny_nose', 'itching', 'dry_mouth', 'fatigue']
  };
  
  const hasCritical = foundSymptomIds.some(id => severityKeywords.critical.includes(id));
  const hasModerate = foundSymptomIds.some(id => severityKeywords.moderate.includes(id));
  
  if (hasCritical) return 2;
  if (hasModerate) return 1;
  return 0;
};

/**
 * Generates a summary of symptom distribution for diagnostic insights.
 */
export const analyzeSymptomsPattern = (foundSymptomIds: string[]) => {
  const categories = {
    respiratory: ['cough', 'shortness_of_breath', 'sore_throat', 'runny_nose'],
    gastrointestinal: ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain', 'constipation'],
    systemic: ['fever', 'fatigue', 'muscle_pain', 'joint_pain', 'weight_loss', 'night_sweats'],
    neurological: ['headache', 'dizziness', 'neck_stiffness', 'sensitivity_to_light'],
    dermatological: ['rash', 'itching']
  };
  
  const matched = {
    respiratory: foundSymptomIds.filter(id => categories.respiratory.includes(id)).length,
    gastrointestinal: foundSymptomIds.filter(id => categories.gastrointestinal.includes(id)).length,
    systemic: foundSymptomIds.filter(id => categories.systemic.includes(id)).length,
    neurological: foundSymptomIds.filter(id => categories.neurological.includes(id)).length,
    dermatological: foundSymptomIds.filter(id => categories.dermatological.includes(id)).length
  };
  
  return {
    dominantCategory: Object.entries(matched).reduce((a, b) => b[1] > a[1] ? b : a)[0],
    matchCounts: matched
  };
};
