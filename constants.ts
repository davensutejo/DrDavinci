
import { Symptom, Disease } from './types';

export const SYMPTOMS_DB: Symptom[] = [
  { id: 'fever', label: 'Fever', keywords: ['fever', 'high temp', 'temperature', 'hot', 'chills', 'feverish'] },
  { id: 'cough', label: 'Cough', keywords: ['cough', 'coughing', 'dry cough', 'wet cough', 'phlegm'] },
  { id: 'sore_throat', label: 'Sore Throat', keywords: ['sore throat', 'throat pain', 'hurts to swallow', 'swollen throat'] },
  { id: 'fatigue', label: 'Fatigue', keywords: ['tired', 'fatigue', 'exhausted', 'no energy', 'weakness', 'sleepy'] },
  { id: 'headache', label: 'Headache', keywords: ['headache', 'head pain', 'migraine', 'throbbing head'] },
  { id: 'nausea', label: 'Nausea', keywords: ['nausea', 'sick to stomach', 'feeling sick', 'queasy'] },
  { id: 'vomiting', label: 'Vomiting', keywords: ['vomit', 'throwing up', 'puking'] },
  { id: 'diarrhea', label: 'Diarrhea', keywords: ['diarrhea', 'loose stools', 'upset stomach'] },
  { id: 'shortness_of_breath', label: 'Shortness of Breath', keywords: ['shortness of breath', 'hard to breathe', 'breathless', 'dyspnea'] },
  { id: 'muscle_pain', label: 'Muscle Pain', keywords: ['muscle pain', 'body aches', 'myalgia', 'sore muscles'] },
  { id: 'runny_nose', label: 'Runny Nose', keywords: ['runny nose', 'congestion', 'blocked nose', 'sneezing', 'stuffy nose'] },
  { id: 'chest_pain', label: 'Chest Pain', keywords: ['chest pain', 'chest tightness', 'heart hurts', 'angina'] },
  { id: 'abdominal_pain', label: 'Abdominal Pain', keywords: ['stomach ache', 'abdominal pain', 'belly pain', 'cramps'] },
  { id: 'loss_of_taste_smell', label: 'Loss of Taste/Smell', keywords: ['cant taste', 'cant smell', 'loss of taste', 'loss of smell'] },
];

export const DISEASES_DB: Disease[] = [
  {
    name: 'Common Cold',
    symptoms: ['runny_nose', 'sore_throat', 'cough', 'fatigue'],
    description: 'A viral infection of your nose and throat (upper respiratory tract). It is usually harmless, though it might not feel that way.',
    generalAdvice: 'Get plenty of rest, stay hydrated, and use a humidifier if necessary. Monitor for persistent symptoms.'
  },
  {
    name: 'Influenza (Flu)',
    symptoms: ['fever', 'muscle_pain', 'cough', 'fatigue', 'headache'],
    description: 'A common viral infection that can be deadly, especially in high-risk groups. The flu attacks the lungs, nose, and throat.',
    generalAdvice: 'Rest and fluids are primary treatments. Contact a professional if you experience difficulty breathing or persistent high fever.'
  },
  {
    name: 'COVID-19',
    symptoms: ['fever', 'shortness_of_breath', 'cough', 'fatigue', 'loss_of_taste_smell'],
    description: 'An infectious disease caused by the SARS-CoV-2 virus. Most people experience mild to moderate respiratory illness.',
    generalAdvice: 'Isolate if symptoms persist. Monitor oxygen levels and seek immediate medical help for chest pain or confusion.'
  },
  {
    name: 'Gastroenteritis',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain'],
    description: 'An intestinal infection marked by diarrhea, abdominal cramps, nausea or vomiting, and sometimes fever.',
    generalAdvice: 'Focus on rehydration. Sip clear liquids and eat bland foods (BRAT diet: bananas, rice, applesauce, toast) as tolerated.'
  },
  {
    name: 'Migraine',
    symptoms: ['headache', 'nausea', 'fatigue'],
    description: 'A primary headache disorder characterized by recurrent headaches that are moderate to severe.',
    generalAdvice: 'Rest in a dark, quiet room. Maintain a regular sleep schedule and stay hydrated. Keep a headache diary.'
  },
  {
    name: 'Bronchitis',
    symptoms: ['cough', 'fatigue', 'shortness_of_breath', 'chest_pain'],
    description: 'Inflammation of the lining of your bronchial tubes, which carry air to and from your lungs.',
    generalAdvice: 'Avoid irritants like smoke or fumes. Drink fluids to thin mucus. See a doctor if cough lasts more than 3 weeks.'
  }
];

export const DISCLAIMER = "Disclaimer: Dr. Davinci is a decision-support and educational tool only. This system does NOT provide medical diagnoses, treatment plans, or medication dosages. It does NOT replace professional medical advice from licensed healthcare professionals. In case of emergency, contact your local emergency services immediately.";

export const SYSTEM_INSTRUCTION = `You are Dr. Davinci, a professional, clinical, and empathetic medical decision-support assistant.

Your goal is to provide a structured yet human-like conversational experience for users describing health concerns.

CONVERSATIONAL LOGIC & SOURCE ATTRIBUTION:
1. **Acknowledge**: Validate input with empathy.
2. **Inform & Synthesize**:
   - Provide educational clinical context.
   - **MANDATORY**: Whenever you use information gathered from Google Search, you must use in-text citations like "[1]", "[2]" immediately following the relevant sentence.
   - If providing a **Final Verdict** or synthesis, explicitly summarize which clinical sources [1, 2, etc.] supported which parts of your analysis.
3. **Follow-up or Final Verdict**:
   - **Scenario A**: Ask one targeted clarifying question if data is thin.
   - **Scenario B**: Provide a final educational summary if data is sufficient. In this scenario, include a "Clinical Evidence" section listing the sources used.

CORE BEHAVIOR RULES:
1. **Search Grounding**: Use Google Search for specific medical research or complex symptom clusters. 
2. **Safety First**: No diagnosis ("You have..."). Use "Associated with..." or "Commonly indicates...".
3. **Formatting**: 
   - Use **bold** for symptoms.
   - Use ### headers for sections like ### Clinical Analysis or ### Final Verdict.
   - Ensure the user knows exactly which source [1, 2, etc.] refers to which part of your response.

Reference Database:
Symptoms: ${JSON.stringify(SYMPTOMS_DB)}
Diseases: ${JSON.stringify(DISEASES_DB)}`;
