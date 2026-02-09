
import { DISEASES_DB, SYMPTOMS_DB } from '../constants';
import { AnalysisResult, VerdictDiagnosis, Message, EvidenceSource } from '../types';

/**
 * Accumulates all unique symptoms reported across the entire conversation.
 * Prevents duplicate symptoms when aggregating across multiple user messages.
 * 
 * @param messages - Array of all messages in the conversation
 * @returns Array of unique accumulated symptom IDs
 */
export const accumulateAllSymptoms = (messages: Message[]): string[] => {
  const allSymptomIds = new Set<string>();
  
  messages.forEach(msg => {
    if (msg.role === 'user' && msg.extractedSymptoms) {
      msg.extractedSymptoms.forEach(symptomId => {
        allSymptomIds.add(symptomId);
      });
    }
  });
  
  return Array.from(allSymptomIds);
};

/**
 * Parses AI response to extract structured verdicts with confidence scores.
 * Also removes verdict markers from the response for clean display.
 * 
 * @param responseText - The AI response text
 * @returns Object with cleaned content and parsed verdicts
 */
export const extractVerdictsFromResponse = (responseText: string): VerdictDiagnosis[] => {
  const verdicts: VerdictDiagnosis[] = [];
  
  if (!responseText || responseText.trim().length === 0) return verdicts;
  
  // Pattern: "- Disease Name: XX% confidence - reasoning" or ANY LANGUAGE equivalent
  // Matches: "- Nom Maladie: XX% confiance - raison" (French)
  // Matches: "- Nombre Enfermedad: XX% confianza - razón" (Spanish)
  // Language-independent: matches any characters before colon
  const verdictPattern = /^[\s\-]*([^:]+?):\s*(\d+)%\s*(?:[-–]\s*(.+?))?$/gmi;
  
  let match;
  let rank = 1;
  const processedDiseases = new Set<string>(); // Track to avoid duplicates
  
  while ((match = verdictPattern.exec(responseText)) !== null) {
    const disease = match[1].trim();
    const confidence = parseInt(match[2], 10);
    const reasoning = match[3]?.trim() || 'See clinical analysis';
    
    // Validate disease name isn't empty and confidence is in range
    if (disease && disease.length > 2 && confidence >= 0 && confidence <= 100) {
      // Skip if duplicate disease name
      const diseaseKey = disease.toLowerCase();
      if (!processedDiseases.has(diseaseKey)) {
        processedDiseases.add(diseaseKey);
        
        verdicts.push({
          disease,
          confidence,
          reasoning,
          rank: rank++
        });
      }
    }
  }
  
  // Sort by confidence descending to ensure proper ranking
  verdicts.sort((a, b) => b.confidence - a.confidence);
  
  // Re-assign rank based on sorted order
  verdicts.forEach((v, index) => {
    v.rank = index + 1;
  });
  
  // Extract sources from [1] Organization (https://url) - Description format
  // Language-independent: [1] ANY TEXT (https://...) - Description
  const sourcesPattern = /\[(\d+)\]\s*([^\(]+?)\s*\((https?:\/\/[^\)]+)\)\s*[-–]\s*([^\n]+)/g;
  const sources: EvidenceSource[] = [];
  let sourceMatch;
  while ((sourceMatch = sourcesPattern.exec(responseText)) !== null) {
    sources.push({
      organization: sourceMatch[2].trim(),
      url: sourceMatch[3].trim(),
      description: sourceMatch[4].trim()
    });
  }
  
  // Attach sources to all verdicts
  if (sources.length > 0) {
    verdicts.forEach(v => {
      v.sources = sources;
    });
  }
  
  // Return only top 2 verdicts - ignore the rest
  return verdicts.slice(0, 2);
};

/**
 * Cleans the bot response by removing verdict markers and duplicate sections
 * This ensures clean display while verdicts are extracted separately
 */
export const cleanBotResponse = (text: string): string => {
  // Remove [FINAL VERDICT] and [/FINAL VERDICT] markers
  let cleaned = text.replace(/\[\s*FINAL\s+VERDICT\s*\]/gi, '').replace(/\[\s*\/FINAL\s+VERDICT\s*\]/gi, '');
  
  // Remove [CLINICAL ASSESSMENT] markers
  cleaned = cleaned.replace(/\[\s*CLINICAL\s+ASSESSMENT\s*\]/gi, '').replace(/\[\s*\/CLINICAL\s+ASSESSMENT\s*\]/gi, '');
  
  // Remove lines that are ONLY verdict listings (format: - Disease: XX% confidence - reason)
  // But keep narrative text that might have this format
  const lines = cleaned.split('\n');
  const processedLines = lines.filter((line, index, arr) => {
    const trimmed = line.trim();
    
    // Check if line is a verdict listing
    const isVerdictLine = /^[\s\-]*([\w\s\(\),&\.]+?):\s*(\d+)%\s*(?:confidence)?/i.test(trimmed);
    
    // Keep it only if there's surrounding context (not in verdict section)
    if (isVerdictLine) {
      // Check if previous and next lines are also verdicts
      const prevIsVerdict = index > 0 && /^[\s\-]*([\w\s\(\),&\.]+?):\s*(\d+)%/i.test(arr[index - 1].trim());
      const nextIsVerdict = index < arr.length - 1 && /^[\s\-]*([\w\s\(\),&\.]+?):\s*(\d+)%/i.test(arr[index + 1].trim());
      
      // Only remove if surrounded by other verdicts (indicates verdict listing block)
      if (prevIsVerdict && nextIsVerdict) {
        return false;
      }
    }
    
    return true;
  });
  
  cleaned = processedLines.join('\n');
  
  // Remove multiple consecutive blank lines
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return cleaned.trim();
};

/**
 * Calculates confidence score based on symptom matching against disease database.
 * Uses Bayesian-inspired scoring combining sensitivity and specificity.
 * 
 * @param disease - Disease name to match
 * @param foundSymptomIds - Array of detected symptom IDs
 * @returns Confidence score 0-100
 */
export const calculateDiseaseConfidence = (disease: string, foundSymptomIds: string[]): number => {
  if (foundSymptomIds.length === 0) return 25; // No symptoms = very low confidence
  
  const diseaseRecord = DISEASES_DB.find(d => d.name.toLowerCase() === disease.toLowerCase());
  if (!diseaseRecord) return 20; // Unknown disease = very low confidence
  
  const matchedSymptoms = diseaseRecord.symptoms.filter(s => foundSymptomIds.includes(s));
  const matchCount = matchedSymptoms.length;
  const totalDiseaseSymptoms = diseaseRecord.symptoms.length;
  
  // Sensitivity: What percentage of disease symptoms are present?
  const sensitivity = totalDiseaseSymptoms > 0 ? matchCount / totalDiseaseSymptoms : 0;
  
  // Specificity: What percentage of user symptoms match this disease?
  const specificity = foundSymptomIds.length > 0 ? matchCount / foundSymptomIds.length : 0;
  
  // Combined score: 70% sensitivity, 30% specificity
  const baseScore = (sensitivity * 0.7 + specificity * 0.3);
  
  // Convert to 0-100 scale
  let confidencePercent = Math.round(baseScore * 100);
  
  // Adjust for symptom coverage
  // If we have many symptoms and most match, increase confidence
  if (matchCount >= 3 && sensitivity > 0.6) {
    confidencePercent = Math.min(100, confidencePercent + 10);
  }
  
  // If we have few symptoms and partial match, reduce confidence
  if (matchCount <= 1 && foundSymptomIds.length <= 2) {
    confidencePercent = Math.max(20, confidencePercent - 15);
  }
  
  // Ensure within bounds
  return Math.max(5, Math.min(95, confidencePercent));
};

/**
 * Generates formatted verdict string for display.
 * Creates a visual representation of confidence level.
 * 
 * @param diagnosis - Disease name
 * @param confidence - Confidence 0-100
 * @param reasoning - Brief explanation
 * @returns Formatted verdict string with visual indicator
 */
export const formatVerdictDisplay = (
  diagnosis: string,
  confidence: number,
  reasoning: string
): string => {
  const bars = Math.round(confidence / 10);
  const emptyBars = 10 - bars;
  const bar = '█'.repeat(bars) + '░'.repeat(emptyBars);
  
  return `${diagnosis} | ${confidence}% | [${bar}]\n${reasoning}`;
};

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
