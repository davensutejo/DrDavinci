
import { DISEASES_DB, SYMPTOMS_DB } from '../constants';
import { AnalysisResult } from '../types';

/**
 * Helper to find disease candidates in the local DB based on detected symptoms.
 * This is now used by the AI service to cross-reference or provide fallback structured data.
 */
export const matchLocalDiseases = (foundSymptomIds: string[]): AnalysisResult[] => {
  console.log('\n' + '='.repeat(80));
  console.log('🔬 LOCAL INFERENCE ENGINE - DISEASE SCORING');
  console.log('='.repeat(80));
  console.log(`📋 Input Symptoms: ${foundSymptomIds.length} detected`);
  
  if (foundSymptomIds.length === 0) {
    console.log('⚠️ No symptoms detected - returning empty results');
    console.log('='.repeat(80) + '\n');
    return [];
  }

  const results: AnalysisResult[] = DISEASES_DB.map(disease => {
    const matchedSymptoms = disease.symptoms.filter(s => foundSymptomIds.includes(s));
    
    // Weighted scoring logic
    const sensitivity = matchedSymptoms.length / disease.symptoms.length;
    const specificity = foundSymptomIds.length > 0 ? matchedSymptoms.length / foundSymptomIds.length : 0;
    
    const combinedScore = (sensitivity * 0.7) + (specificity * 0.3);
    
    console.log(`\n  🏥 ${disease.name}`);
    console.log(`     Sensitivity (70%): ${matchedSymptoms.length}/${disease.symptoms.length} = ${(sensitivity * 100).toFixed(1)}% → ${(sensitivity * 0.7).toFixed(3)}`);
    console.log(`     Specificity (30%): ${matchedSymptoms.length}/${foundSymptomIds.length} = ${(specificity * 100).toFixed(1)}% → ${(specificity * 0.3).toFixed(3)}`);
    console.log(`     ✅ Score: ${combinedScore.toFixed(3)}`);

    return {
      disease,
      score: combinedScore,
      matchedSymptoms
    };
  });

  const filtered = results.filter(res => res.score > 0.15);
  const sorted = filtered.sort((a, b) => b.score - a.score);
  
  console.log('\n' + '-'.repeat(80));
  console.log('📊 RANKING RESULTS (Score > 0.15):');
  console.log('-'.repeat(80));
  sorted.forEach((result, idx) => {
    const medals = ['🥇', '🥈', '🥉'];
    const medal = medals[idx] || '  ';
    console.log(`${medal} #${idx + 1}: ${result.disease.name} → ${result.score.toFixed(3)}`);
  });
  
  if (sorted.length > 0) {
    console.log('\n' + '✨'.repeat(40));
    console.log('🎯 FINAL VERDICT (TOP DIAGNOSIS):');
    console.log('✨'.repeat(40));
    console.log(`🏆 ${sorted[0].disease.name.toUpperCase()}`);
    console.log(`   Confidence Score: ${sorted[0].score.toFixed(3)} (${(sorted[0].score * 100).toFixed(1)}%)`);
    console.log('✨'.repeat(40));
  } else {
    console.log('\n⚠️  No diseases matched above threshold');
  }
  
  console.log('='.repeat(80) + '\n');

  return sorted;
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
  console.log('\n' + '='.repeat(80));
  console.log('⚙️  SCORE BLENDING (LOCAL + AI)');
  console.log('='.repeat(80));
  
  const localWeight = 1 - aiWeight;
  const localComponent = localScore * localWeight;
  const aiComponent = aiConfidence * aiWeight;
  const blendedScore = Math.min(1, Math.max(0, localComponent + aiComponent));
  
  console.log(`📊 Local Score: ${localScore.toFixed(3)} × ${(localWeight * 100).toFixed(0)}% = ${localComponent.toFixed(3)}`);
  console.log(`🤖 AI Confidence: ${aiConfidence.toFixed(3)} × ${(aiWeight * 100).toFixed(0)}% = ${aiComponent.toFixed(3)}`);
  console.log(`\n   Formula: (${localScore.toFixed(3)} × ${localWeight.toFixed(1)}) + (${aiConfidence.toFixed(3)} × ${aiWeight.toFixed(1)})`);
  console.log(`   = ${localComponent.toFixed(3)} + ${aiComponent.toFixed(3)}`);
  console.log(`   = ${blendedScore.toFixed(3)}`);
  
  const improvement = ((blendedScore - localScore) / localScore * 100).toFixed(1);
  console.log(`\n✅ Final Blended Score: ${blendedScore.toFixed(3)} (${(blendedScore * 100).toFixed(1)}%)`);
  console.log(`   Change from local: ${improvement}%`);
  console.log('='.repeat(80) + '\n');
  
  return blendedScore;
};

/**
 * Extracts confidence score from Gemini response text.
 * Looks for confidence indicators in the AI response.
 * 
 * @param geminiResponse - The text response from Gemini
 * @returns Confidence score (0-1) based on response content
 */
export const extractAIConfidence = (geminiResponse: string): number => {
  console.log('\n' + '='.repeat(80));
  console.log('🤖 AI CONFIDENCE EXTRACTION (GEMINI GROUNDING)');
  console.log('='.repeat(80));
  
  if (!geminiResponse) {
    console.log('⚠️  No response provided - using default 0.5');
    console.log('='.repeat(80) + '\n');
    return 0.5;
  }
  
  const responseLower = geminiResponse.toLowerCase();
  let confidence = 0.5;
  let reason = 'No clear indicators found';
  
  // High confidence indicators
  if (responseLower.includes('highly likely') || 
      responseLower.includes('very likely') ||
      responseLower.includes('strongly suggest') ||
      responseLower.includes('consistent with')) {
    confidence = 0.9;
    reason = 'High confidence: "highly likely", "very likely", "strongly suggest", or "consistent with"';
  }
  // Medium-high confidence
  else if (responseLower.includes('likely') || 
      responseLower.includes('suggest') ||
      responseLower.includes('probable') ||
      responseLower.includes('typical of')) {
    confidence = 0.75;
    reason = 'Medium-high confidence: "likely", "suggest", "probable", or "typical of"';
  }
  // Medium confidence
  else if (responseLower.includes('possible') || 
      responseLower.includes('may indicate') ||
      responseLower.includes('could be')) {
    confidence = 0.6;
    reason = 'Medium confidence: "possible", "may indicate", or "could be"';
  }
  // Lower confidence (needs more investigation)
  else if (responseLower.includes('consider') || 
      responseLower.includes('evaluate') ||
      responseLower.includes('rule out')) {
    confidence = 0.45;
    reason = 'Low confidence: "consider", "evaluate", or "rule out"';
  }
  
  console.log(`📝 Detected: ${reason}`);
  console.log(`✅ Confidence Level: ${confidence} (${(confidence * 100).toFixed(1)}%)`);
  console.log('='.repeat(80) + '\n');
  
  return confidence;
};

/**
 * Returns a list of all local symptom IDs for context injection.
 */
export const getKnownSymptomIds = (): string[] => SYMPTOMS_DB.map(s => s.id);
