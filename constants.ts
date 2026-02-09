
import { Symptom, Disease, TreatmentPlan } from './types';

export const SYMPTOMS_DB: Symptom[] = [
  { id: 'fever', label: 'Fever', keywords: ['fever', 'high temp', 'temperature', 'hot', 'chills', 'feverish'] },
  { id: 'cough', label: 'Cough', keywords: ['cough', 'coughing', 'dry cough', 'wet cough', 'phlegm'] },
  { id: 'sore_throat', label: 'Sore Throat', keywords: ['sore throat', 'throat pain', 'hurts to swallow', 'swollen throat', 'pharyngitis'] },
  { id: 'fatigue', label: 'Fatigue', keywords: ['tired', 'fatigue', 'exhausted', 'no energy', 'weakness', 'sleepy'] },
  { id: 'headache', label: 'Headache', keywords: ['headache', 'head pain', 'migraine', 'throbbing head'] },
  { id: 'nausea', label: 'Nausea', keywords: ['nausea', 'sick to stomach', 'feeling sick', 'queasy', 'queasiness'] },
  { id: 'vomiting', label: 'Vomiting', keywords: ['vomit', 'throwing up', 'puking', 'regurgitation'] },
  { id: 'diarrhea', label: 'Diarrhea', keywords: ['diarrhea', 'loose stools', 'upset stomach', 'watery stool'] },
  { id: 'shortness_of_breath', label: 'Shortness of Breath', keywords: ['shortness of breath', 'hard to breathe', 'breathless', 'dyspnea'] },
  { id: 'muscle_pain', label: 'Muscle Pain', keywords: ['muscle pain', 'body aches', 'myalgia', 'sore muscles'] },
  { id: 'runny_nose', label: 'Runny Nose', keywords: ['runny nose', 'congestion', 'blocked nose', 'sneezing', 'stuffy nose', 'nasal congestion'] },
  { id: 'chest_pain', label: 'Chest Pain', keywords: ['chest pain', 'chest tightness', 'heart hurts', 'angina', 'chest discomfort'] },
  { id: 'abdominal_pain', label: 'Abdominal Pain', keywords: ['stomach ache', 'abdominal pain', 'belly pain', 'cramps', 'stomach pain'] },
  { id: 'loss_of_taste_smell', label: 'Loss of Taste/Smell', keywords: ['cant taste', 'cant smell', 'loss of taste', 'loss of smell', 'anosmia', 'ageusia'] },
  { id: 'joint_pain', label: 'Joint Pain', keywords: ['joint pain', 'arthralgia', 'aching joints', 'joint aches', 'joint swelling'] },
  { id: 'rash', label: 'Rash', keywords: ['rash', 'skin rash', 'hives', 'redness', 'skin irritation', 'bumps on skin'] },
  { id: 'night_sweats', label: 'Night Sweats', keywords: ['night sweats', 'sweating at night', 'drenching sweat'] },
  { id: 'swollen_lymph_nodes', label: 'Swollen Lymph Nodes', keywords: ['swollen lymph nodes', 'lymphadenopathy', 'swollen glands', 'enlarged nodes'] },
  { id: 'sinus_congestion', label: 'Sinus Congestion', keywords: ['sinus congestion', 'sinus pressure', 'sinusitis', 'facial pressure', 'stuffy sinuses'] },
  { id: 'back_pain', label: 'Back Pain', keywords: ['back pain', 'lower back pain', 'upper back pain', 'backache'] },
  { id: 'neck_stiffness', label: 'Neck Stiffness', keywords: ['neck stiffness', 'stiff neck', 'neck pain', 'unable to touch chin to chest'] },
  { id: 'sensitivity_to_light', label: 'Light Sensitivity', keywords: ['light sensitivity', 'photophobia', 'bright lights hurt', 'sensitive to light'] },
  { id: 'dizziness', label: 'Dizziness', keywords: ['dizziness', 'dizzy', 'vertigo', 'lightheaded', 'spinning'] },
  { id: 'palpitations', label: 'Palpitations', keywords: ['palpitations', 'heart racing', 'irregular heartbeat', 'heart pounding', 'racing pulse'] },
  { id: 'constipation', label: 'Constipation', keywords: ['constipation', 'constipated', 'difficulty bowels', 'hard stools'] },
  { id: 'hematuria', label: 'Blood in Urine', keywords: ['blood in urine', 'hematuria', 'red urine', 'bloody urine', 'pink urine'] },
  { id: 'painful_urination', label: 'Painful Urination', keywords: ['painful urination', 'burning urination', 'dysuria', 'pain when urinating'] },
  { id: 'frequent_urination', label: 'Frequent Urination', keywords: ['frequent urination', 'urinating often', 'need to urinate', 'polyuria'] },
  { id: 'weight_loss', label: 'Weight Loss', keywords: ['weight loss', 'losing weight', 'unintended weight loss'] },
  { id: 'itching', label: 'Itching', keywords: ['itching', 'itchy', 'pruritus', 'scratching', 'itchiness'] },
  { id: 'difficulty_swallowing', label: 'Difficulty Swallowing', keywords: ['difficulty swallowing', 'dysphagia', 'hard to swallow', 'pain swallowing'] },
  { id: 'dry_mouth', label: 'Dry Mouth', keywords: ['dry mouth', 'cottonmouth', 'xerostomia', 'dry throat'] },
];

export const DISEASES_DB: Disease[] = [
  {
    name: 'Common Cold',
    symptoms: ['runny_nose', 'sore_throat', 'cough', 'fatigue', 'headache'],
    description: 'A viral infection of the upper respiratory tract. Usually self-limiting within 7-10 days.',
    generalAdvice: 'Rest, fluids, and OTC decongestants. Honey can soothe throat irritation. Most resolve within 10 days.'
  },
  {
    name: 'Influenza (Flu)',
    symptoms: ['fever', 'muscle_pain', 'cough', 'fatigue', 'headache', 'sore_throat'],
    description: 'A contagious viral infection attacking respiratory system. More severe than common cold.',
    generalAdvice: 'Antiviral medications work best within 48 hours. Rest, fluids, and fever management. Seek help if breathing difficulty.'
  },
  {
    name: 'COVID-19',
    symptoms: ['fever', 'shortness_of_breath', 'cough', 'fatigue', 'loss_of_taste_smell', 'headache'],
    description: 'Caused by SARS-CoV-2. Ranges from asymptomatic to severe respiratory illness.',
    generalAdvice: 'Isolation recommended. Monitor oxygen levels. Seek immediate care for difficulty breathing, chest pain, or confusion.'
  },
  {
    name: 'Pneumonia',
    symptoms: ['fever', 'cough', 'shortness_of_breath', 'chest_pain', 'fatigue', 'nausea'],
    description: 'Lung infection causing fluid-filled air sacs. Can be bacterial, viral, or fungal. Serious condition.',
    generalAdvice: 'Requires medical evaluation. May need antibiotics or hospitalization. Avoid self-treatment.'
  },
  {
    name: 'Bronchitis',
    symptoms: ['cough', 'fatigue', 'shortness_of_breath', 'chest_pain', 'sore_throat'],
    description: 'Inflammation of bronchial tubes carrying air to lungs. Often follows upper respiratory infection.',
    generalAdvice: 'Manage with humidity, fluids, and cough suppressants. See doctor if cough persists beyond 3 weeks.'
  },
  {
    name: 'Strep Throat',
    symptoms: ['sore_throat', 'fever', 'fatigue', 'headache', 'nausea', 'swollen_lymph_nodes'],
    description: 'Bacterial throat infection caused by Group A Streptococcus. Highly contagious.',
    generalAdvice: 'Requires antibiotics for proper treatment. Prevents rheumatic fever complications. Rest and throat lozenges.'
  },
  {
    name: 'Sinusitis',
    symptoms: ['sinus_congestion', 'headache', 'sore_throat', 'cough', 'fatigue', 'fever'],
    description: 'Inflammation of sinus cavities. Can be acute or chronic. Often follows cold or allergy.',
    generalAdvice: 'Nasal saline rinses help. Decongestants provide relief. Antibiotics if bacterial. Warm compress on sinuses.'
  },
  {
    name: 'Asthma',
    symptoms: ['shortness_of_breath', 'chest_pain', 'cough', 'wheezing', 'fatigue'],
    description: 'Chronic inflammatory airway disease causing breathing difficulty. Triggered by allergens or activity.',
    generalAdvice: 'Use rescue inhalers for acute episodes. Identify and avoid triggers. Develop action plan with doctor.'
  },
  {
    name: 'Allergies',
    symptoms: ['runny_nose', 'itching', 'rash', 'sore_throat', 'cough', 'headache'],
    description: 'Immune response to harmless substances. Seasonal or environmental triggers.',
    generalAdvice: 'Identify triggers and avoid exposure. Antihistamines and decongestants provide relief. See allergist if severe.'
  },
  {
    name: 'Gastroenteritis (Stomach Flu)',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain', 'fever', 'fatigue'],
    description: 'Viral or bacterial intestinal infection. Highly contagious. Usually self-limited.',
    generalAdvice: 'BRAT diet (bananas, rice, applesauce, toast). Electrolyte replacement crucial. Avoid dairy and heavy foods.'
  },
  {
    name: 'Food Poisoning',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain', 'fever'],
    description: 'Foodborne illness from contaminated food or water. Symptoms appear within hours of consumption.',
    generalAdvice: 'Stay hydrated with electrolyte solutions. Most resolve within 24-48 hours. Seek help if severe or prolonged.'
  },
  {
    name: 'Appendicitis',
    symptoms: ['abdominal_pain', 'nausea', 'vomiting', 'fever', 'fatigue'],
    description: 'Inflammation of appendix. Medical emergency requiring surgery. Pain often starts around navel.',
    generalAdvice: 'Seek immediate medical attention. Do not eat or drink. Untreated can lead to rupture and complications.'
  },
  {
    name: 'Urinary Tract Infection (UTI)',
    symptoms: ['painful_urination', 'frequent_urination', 'abdominal_pain', 'hematuria', 'fever'],
    description: 'Bacterial infection of bladder or urethra. More common in women. Treatable with antibiotics.',
    generalAdvice: 'Drink plenty of water. Take antibiotics as prescribed. Avoid irritants. See doctor for confirmation.'
  },
  {
    name: 'Migraine',
    symptoms: ['headache', 'nausea', 'fatigue', 'sensitivity_to_light', 'dizziness'],
    description: 'Intense neurological headache often one-sided. Can last hours to days. Disabling condition.',
    generalAdvice: 'Rest in dark room. Stay hydrated. Medication works best early. Identify triggers (stress, food, sleep).'
  },
  {
    name: 'Meningitis',
    symptoms: ['fever', 'headache', 'neck_stiffness', 'sensitivity_to_light', 'fatigue', 'rash'],
    description: 'Serious infection of meninges membranes around brain/spinal cord. Medical emergency.',
    generalAdvice: 'Seek emergency care immediately. Do not delay. Can progress rapidly. Requires hospitalization and antibiotics.'
  },
  {
    name: 'Measles',
    symptoms: ['fever', 'rash', 'cough', 'runny_nose', 'sore_throat', 'fatigue'],
    description: 'Highly contagious viral infection. Distinctive red rash appears 3-4 days after fever starts.',
    generalAdvice: 'Isolation essential. Vaccination most effective prevention. Complications possible, especially in children.'
  },
  {
    name: 'Chickenpox',
    symptoms: ['fever', 'rash', 'fatigue', 'headache', 'muscle_pain', 'itching'],
    description: 'Varicella-zoster virus causing characteristic fluid-filled blisters. Highly contagious.',
    generalAdvice: 'Supportive care primary treatment. Calamine lotion and oatmeal baths for itching. Antivirals if severe or older.'
  },
  {
    name: 'Shingles (Herpes Zoster)',
    symptoms: ['rash', 'chest_pain', 'fatigue', 'fever', 'itching', 'headache'],
    description: 'Reactivation of varicella virus in adults. Causes painful rash typically on one side of body.',
    generalAdvice: 'Antiviral medication most effective early. Pain management crucial. Post-herpetic neuralgia possible complication.'
  },
  {
    name: 'Mononucleosis (Mono)',
    symptoms: ['fever', 'sore_throat', 'fatigue', 'swollen_lymph_nodes', 'headache', 'muscle_pain'],
    description: 'Infectious viral disease causing extreme fatigue. Also called kissing disease. EBV infection.',
    generalAdvice: 'Rest critical - recovery takes weeks. Throat lozenges and pain relievers help. Avoid contact sports temporarily.'
  },
  {
    name: 'Lyme Disease',
    symptoms: ['fever', 'fatigue', 'rash', 'joint_pain', 'headache', 'muscle_pain'],
    description: 'Tick-borne bacterial infection. Early treatment prevents serious complications. Rash may be bullseye pattern.',
    generalAdvice: 'Antibiotics effective if started early. Avoid tick-infested areas. Remove ticks promptly and properly.'
  },
  {
    name: 'Whooping Cough (Pertussis)',
    symptoms: ['cough', 'fever', 'runny_nose', 'shortness_of_breath', 'fatigue', 'sore_throat'],
    description: 'Bacterial respiratory infection causing severe coughing fits. Highly contagious. Preventable by vaccine.',
    generalAdvice: 'Antibiotics work in early stage. Vaccination prevents disease. Complications possible, especially in infants.'
  },
  {
    name: 'Tuberculosis (TB)',
    symptoms: ['cough', 'fever', 'night_sweats', 'fatigue', 'weight_loss', 'chest_pain'],
    description: 'Serious bacterial lung infection. Can be latent or active. Spreads through respiratory droplets.',
    generalAdvice: 'Requires months of antibiotic treatment. Isolation may be necessary. Professional monitoring essential.'
  },
  {
    name: 'Arthritis',
    symptoms: ['joint_pain', 'fatigue', 'muscle_pain', 'headache'],
    description: 'Inflammation of joints causing pain, stiffness, and reduced mobility. Multiple types exist.',
    generalAdvice: 'Anti-inflammatory medications help. Physical therapy important. Warm compress reduces pain. See rheumatologist.'
  },
  {
    name: 'Thyroid Disorder (Hyperthyroidism)',
    symptoms: ['fatigue', 'palpitations', 'weight_loss', 'headache', 'dizziness'],
    description: 'Overactive thyroid producing excess hormones. Affects metabolism and energy levels.',
    generalAdvice: 'Requires blood tests for diagnosis. Treatment includes medications or ablation. Regular monitoring necessary.'
  },
  {
    name: 'Hypoglycemia (Low Blood Sugar)',
    symptoms: ['dizziness', 'fatigue', 'headache', 'palpitations', 'muscle_pain'],
    description: 'Blood glucose drops too low. Can occur in diabetics or during fasting. May progress to emergency.',
    generalAdvice: 'Consume fast-acting carbs immediately (juice, candy). Eat balanced meals regularly. Monitor blood sugar if diabetic.'
  },
  {
    name: 'Anxiety/Panic Disorder',
    symptoms: ['palpitations', 'chest_pain', 'shortness_of_breath', 'dizziness', 'fatigue', 'headache'],
    description: 'Psychological condition manifesting as physical symptoms. Can feel like heart attack.',
    generalAdvice: 'Deep breathing and grounding techniques help. Therapy and medication available. Rule out medical causes first.'
  },
  {
    name: 'Celiac Disease',
    symptoms: ['abdominal_pain', 'diarrhea', 'fatigue', 'weight_loss', 'rash'],
    description: 'Autoimmune disorder triggered by gluten. Damages small intestine. Requires lifelong gluten-free diet.',
    generalAdvice: 'Blood tests and biopsy confirm diagnosis. Strict gluten avoidance essential. Vitamin supplementation may be needed.'
  },
];


export const DISCLAIMER = "Disclaimer: Dr. Davinci is a decision-support and educational tool only. This system does NOT provide medical diagnoses, treatment plans, or medication dosages. It does NOT replace professional medical advice from licensed healthcare professionals. In case of emergency, contact your local emergency services immediately.";

export const SYSTEM_INSTRUCTION = `You are Dr. Davinci, a professional, clinical, and empathetic medical decision-support assistant.

Your goal is: Progressive clinical narrowing with evidence-based differential diagnoses.

=== CRITICAL: PROGRESSIVE NARROWING SYSTEM ===
Each conversation follows phases based on symptom count:

PHASE LOGIC:
- If user provides 0-2 symptoms: ASK CLARIFYING QUESTIONS FIRST (no verdict yet) - Never repeat symptoms they already mentioned
- If user provides 3+ symptoms: IMMEDIATELY PROVIDE FINAL VERDICT with high confidence (this is mandatory, do not skip)
- Follow-ups: Always reweight verdicts, don't restart analysis
- After 3 questions total: Stop asking, only update verdicts

⚠️ CRITICAL: NEVER ask about symptoms the user has ALREADY mentioned in this conversation
- If they said "fever and cough", DO NOT ask "Do you have fever or cough?"
- Look at ALL previous messages to see what symptoms were already stated
- Only ask about symptoms they haven't mentioned yet

QUESTION BUDGET: Maximum 3 clarifying questions per session. After question 3, stop asking.
Missing information REDUCES confidence (not blocks diagnosis).
Once 3+ symptoms provided, ALWAYS output FINAL VERDICT with confidence scores immediately (do not delay).

=== EMERGENCY RED FLAGS (STOP ANALYSIS & ALERT) ===
🚨 IF user mentions ANY of these symptoms, IMMEDIATELY output:

🚨 SEEK EMERGENCY CARE IMMEDIATELY 🚨
This condition could be life-threatening. Call emergency services or go to the nearest emergency room immediately.

RED FLAG SYMPTOMS TRIGGERING EMERGENCY ALERT:
- Chest pain, pressure, or tightness
- Severe or sudden shortness of breath
- Loss of consciousness, fainting, or severe dizziness
- Severe headache combined with neck stiffness and fever (possible meningitis)
- Confusion, difficulty speaking, or slurred speech
- Severe abdominal pain
- Uncontrolled bleeding (internal or external)
- Signs of stroke (facial drooping, arm weakness, speech difficulty)
- Severe allergic reaction (difficulty breathing, throat swelling)
- Poisoning or overdose

MODE: Do NOT provide differential diagnosis for red flag symptoms.
MODE: Do NOT complete the normal question/verdict flow.
MODE: ONLY alert the user to seek emergency care immediately.
MODE: Be empathetic but firm - this overrides all other instructions.

=== RESPONSE STRUCTURE (MANDATORY) ===

IF user provides 0-2 symptoms:
1. **Acknowledgment**: Validate what they've told you (1 sentence)
2. **Clarifying Questions**: Ask 1-2 high-value questions to gather more info
   Format: Ask specific, actionable questions (e.g., "Do you have fever?" "Any cough?")
   DO NOT output a Final Verdict section
   DO NOT output sources when in this phase

IF user provides 3+ symptoms:
1. **Acknowledgment**: Validate symptoms with empathy (1 sentence)
2. **Clinical Analysis**: Explain symptom patterns and clinical significance (2-3 sentences)
3. **FINAL VERDICT**: MANDATORY section with EXACT format below:
   
   === VERDICT FORMAT (DO NOT DEVIATE) ===
   Provide EXACTLY 2 top-ranked diagnoses (not 3, not 5 - exactly 2):
   - Disease Name Here: 85% confidence - One sentence explaining why this matches their symptoms
   - Disease Name Here: 65% confidence - One sentence explaining why this matches their symptoms
   
   RULES FOR VERDICT FORMAT:
   * Provide exactly 2 verdicts, ranked by confidence (highest first, then second)
   * Start with dash and space: "- "
   * Disease name EXACTLY as it appears in database
   * Colon after disease name: ":"
   * Space + percentage + percent sign: " 85%"
   * Space + word "confidence": " confidence"
   * Space + dash + space + reasoning: " - Brief reason"
   * Each verdict on NEW LINE starting with "- "
   * Confidence scores 0-100, no decimals
   * DO NOT include more than 2 verdicts
   
   EXAMPLES OF CORRECT FORMAT:
   - Influenza (Flu): 82% confidence - Fever + cough + headache is classic flu presentation
   - COVID-19: 65% confidence - Similar symptoms but respiratory-specific signs less prominent
   
4. **MANDATORY Evidence & Sources**: REQUIRED - Include 2-3 authoritative sources:
   
   [1] WHO - Source about condition symptoms/diagnosis
   [2] CDC - Source about treatment/epidemiology
   [3] Mayo Clinic - Source about differential diagnosis
   
   RULES FOR SOURCES:
   * Format: [1] Organization - Brief description
   * Use authoritative sources: WHO, CDC, NIH, Mayo Clinic, Cleveland Clinic, Johns Hopkins
   * Must be specific to the conditions mentioned in verdicts
   * Sources are MANDATORY - do NOT skip this section
   * These demonstrate grounding in real medical knowledge

5. **Clarifying Question** (IF question budget remaining): Ask 1 high-value question ONLY

=== CONFIDENCE SCORING RULES (0-100) ===
- 85-100%: High confidence (strong symptom match, clear match with disease presentation)
- 65-84%: Moderate confidence (reasonable match, needs confirmation)
- 45-64%: Lower confidence (possible, but requires ruling out other conditions)
- Below 45%: Include only if rare presentation or important teaching point

=== SCORING GUIDANCE ===
For EACH potential diagnosis:
1. Count how many of the disease's key symptoms user has
2. Check for any RED FLAG symptoms present
3. Look for symptom patterns that make this disease more/less likely
4. Compare to disease prevalence
5. Assign confidence:
   - User has 100% of key symptoms + red flags present = 85-95%
   - User has 70-80% of key symptoms = 70-80%
   - User has 40-70% of key symptoms = 50-65%
   - User has <40% of key symptoms = 35-45%

EXAMPLE SCORING:
User: Fever 3 days, cough (dry), headache, muscle pain, no sore throat
Influenza scoring:
- Flu key symptoms: fever, cough, headache, muscle pain, fatigue
- User has: fever ✓, cough ✓, headache ✓, muscle pain ✓, no fatigue mentioned (check)
- Red flags: none mentioned
- Pattern: onset + severity matches flu
- Confidence: 82% (strong match, 4/5 symptoms, systemic pattern)

COVID-19 scoring:
- COVID key symptoms: fever, cough, headache, loss of taste/smell, shortness of breath
- User has: fever ✓, cough ✓, headache ✓, no loss of taste/smell ✗, no SOB ✗
- Red flags: missing respiratory-specific symptoms
- Pattern: could be COVID but respiratory-specific symptoms absent
- Confidence: 65% (reasonable match, 3/5 symptoms, missing distinguishing features)

Common Cold scoring:
- Cold key symptoms: runny nose, sore throat, cough, mild fatigue, no fever usually
- User has: fever ✗, cough ✓, no sore throat/runny nose ✗
- Red flags: fever+muscle pain unusual for cold
- Pattern: presentation too severe
- Confidence: 42% (poor match, 1/5 symptoms, fever argues against)

=== NEXT STEPS & URGENCY INDICATORS ===
After providing verdicts, include actionable next steps based on confidence and severity:

HIGH CONFIDENCE VERDICT (75%+):
"Based on your symptoms, I'm fairly confident this is [Disease]. Schedule an appointment with your primary care doctor within 24-48 hours for confirmation. Recommended treatment: [General guidance]."

MODERATE CONFIDENCE (50-74%):
"Your symptoms suggest [Disease], but [Alternative] is also possible. Consider visiting an urgent care clinic today or tomorrow for proper diagnosis. This helps rule out more serious conditions."

LOW CONFIDENCE (Below 50%):
"Your symptoms don't clearly point to one condition. Multiple conditions could cause this. I recommend seeing a healthcare provider soon for proper evaluation and testing."

IMPORTANCE NOTE: Always remind user:
- This is educational AI support, NOT a replacement for professional medical diagnosis
- Actual diagnosis requires physical examination and/or testing
- If symptoms worsen or new symptoms appear, seek medical attention
- Any uncertainty warrants professional evaluation

=== TREATMENT INFORMATION FOR TOP DIAGNOSIS ===

When providing FINAL VERDICT with 3+ symptoms, include management information for the TOP diagnosis:

Include in a structured format:
1. Recovery Timeline (e.g., "7-10 days" or "2-4 weeks")
2. Home Care (3-5 bullet points on what patient should do)
3. Medications:
   - OTC options with doses (acetaminophen, ibuprofen, lozenges, etc)
   - Prescription options that require doctor consultation
4. Red Flags (when to seek emergency care)
5. Prevention Tips (how to avoid transmission/recurrence)

EXAMPLE FORMAT:
"Management Plan for Influenza:
- Rest: 7-14 days minimum
- Hydration: Drink fluids frequently
- Medications: Acetaminophen for fever, antivirals if within 48 hours
- Red Flags: Difficulty breathing, chest pain, confusion
- Prevention: Annual vaccine, hand hygiene, isolation from others"

The frontend will render this information in a formatted card for readability.

=== CRITICAL RULES ===
- Count symptoms from user input before deciding phase
- IF 0-2 symptoms: NO FINAL VERDICT SECTION AT ALL
- IF 3+ symptoms: MANDATORY FINAL VERDICT section with exact format above
- Never ask diagnostic questions you could answer from provided symptoms
- Reweight probabilities based on new symptoms, never restart analysis
- Use "Associated with..." not "You have..." or "You definitely have..."
- Put FINAL VERDICT content between markers for easy parsing
- After 3 questions asked total: STOP ASKING QUESTIONS, only provide verdicts

Reference Database:
Symptoms: ${JSON.stringify(SYMPTOMS_DB)}
Diseases: ${JSON.stringify(DISEASES_DB)}`;

export const TREATMENT_DATABASE: TreatmentPlan[] = [
  {
    disease: 'Common Cold',
    severity: 'mild',
    homecare: [
      'Rest for 7-10 days',
      'Stay hydrated (water, warm tea, broth)',
      'Use humidifier to ease congestion',
      'Gargle with salt water for sore throat',
      'Avoid smoking and secondhand smoke'
    ],
    medications: {
      otc: [
        'Acetaminophen or ibuprofen for fever/pain',
        'Decongestants (pseudoephedrine) for congestion',
        'Honey to soothe throat (especially for cough)',
        'Vitamin C supplements'
      ]
    },
    seekCareIf: [
      'Fever lasts more than 10 days',
      'Cough persists beyond 3 weeks',
      'Shortness of breath develops',
      'Symptoms worsen dramatically'
    ],
    preventionTips: [
      'Wash hands frequently (20+ seconds)',
      'Avoid touching face',
      'Stay home while symptomatic',
      'Clean frequently-touched surfaces'
    ],
    recoveryTime: '7-10 days'
  },

  {
    disease: 'Influenza (Flu)',
    severity: 'moderate',
    homecare: [
      'Rest - critical for recovery (7-14 days)',
      'Hydration - drink fluids frequently',
      'Isolate from others for 5-7 days',
      'Use saline nasal drops for congestion',
      'Place cool compress on forehead for headache'
    ],
    medications: {
      otc: [
        'Acetaminophen or ibuprofen for fever/aches',
        'Cough suppressants (dextromethorphan)',
        'Decongestants for nasal congestion'
      ],
      prescription: [
        'Antiviral medications (oseltamivir, zanamivir)',
        '⚠️ MUST START WITHIN 48 HOURS OF SYMPTOM ONSET'
      ]
    },
    seekCareIf: [
      'Difficulty breathing or shortness of breath',
      'Persistent chest pain or pressure',
      'Confusion or difficulty remaining alert',
      'Severe or persistent vomiting',
      'Fever returns after 3+ days of improvement'
    ],
    preventionTips: [
      'Annual flu vaccine (most important)',
      'Avoid close contact with sick people',
      'Cover coughs/sneezes with elbow',
      'Wash hands frequently',
      'Clean surfaces daily'
    ],
    recoveryTime: '7-14 days (fatigue may linger 3-4 weeks)'
  },

  {
    disease: 'COVID-19',
    severity: 'moderate',
    homecare: [
      'Isolation: Stay home for 5-10 days',
      'Monitor oxygen levels if possible (keep >94%)',
      'Stay hydrated - drink electrolyte solutions',
      'Rest - avoid strenuous activity',
      'Monitor symptoms closely for worsening'
    ],
    medications: {
      otc: [
        'Acetaminophen or ibuprofen for fever/aches',
        'Cough drops or throat lozenges',
        'Saline nasal spray'
      ],
      prescription: [
        'Antiviral treatments (Paxlovid) if eligible',
        'Requires prescription - consult doctor asap'
      ]
    },
    seekCareIf: [
      'Trouble breathing or shortness of breath',
      'Persistent chest pain or pressure',
      'Confusion or inability to stay awake',
      'Bluish lips or face',
      'Severe abdominal pain',
      'Loss of consciousness'
    ],
    preventionTips: [
      'Get vaccinated (and boosters)',
      'Improve ventilation in home',
      'Wear N95 masks around vulnerable people',
      'Test before gathering with others',
      'Isolate if positive'
    ],
    recoveryTime: '2-4 weeks (some experience long COVID)'
  },

  {
    disease: 'Strep Throat',
    severity: 'moderate',
    homecare: [
      'Rest and avoid strenuous activity',
      'Gargle with warm salt water 3-4x daily',
      'Use throat lozenges or throat spray',
      'Drink warm liquids (tea with honey, warm broth)',
      'Apply warm compress to neck'
    ],
    medications: {
      otc: [
        'Ibuprofen or acetaminophen for pain/fever',
        'Throat lozenges with benzocaine'
      ],
      prescription: [
        'Antibiotics (penicillin or amoxicillin)',
        '⚠️ MUST COMPLETE FULL COURSE (7-10 days)',
        'Prevents complications like rheumatic fever'
      ]
    },
    seekCareIf: [
      'Difficulty swallowing saliva',
      'Severe throat pain unrelieved by medication',
      'Fever >103°F (39.4°C)',
      'Rash develops (could be scarlet fever)',
      'Swelling affects breathing'
    ],
    preventionTips: [
      'Do NOT share utensils, cups, toothbrushes',
      'Wash hands frequently',
      'Cover mouth when coughing/sneezing',
      'Stay home for 24 hours after antibiotic start'
    ],
    recoveryTime: '3-7 days with antibiotics'
  },

  {
    disease: 'Sinusitis',
    severity: 'mild',
    homecare: [
      'Nasal saline rinses 2-3x daily (neti pot)',
      'Use humidifier or breathe steam from hot shower',
      'Elevate head with extra pillows',
      'Drink warm fluids',
      'Apply warm compress to sinuses (cheeks/forehead)',
      'Avoid irritants (smoke, perfume, air pollution)'
    ],
    medications: {
      otc: [
        'Saline nasal spray or drops',
        'Decongestants (pseudoephedrine) - short term only',
        'Acetaminophen or ibuprofen for pain',
        'Expectorants (guaifenesin) to loosen mucus'
      ],
      prescription: [
        'Nasal corticosteroid spray (fluticasone)',
        'Antibiotics if bacterial (amoxicillin-clavulanate)'
      ]
    },
    seekCareIf: [
      'Fever >101.5°F (38.6°C)',
      'Severe headache with stiff neck',
      'Swelling around eyes',
      'Vision changes',
      'Symptoms worsen after 7 days'
    ],
    preventionTips: [
      'Avoid allergens and irritants',
      'Use saline rinses during cold season',
      'Stay hydrated',
      'Treat allergies promptly',
      'Avoid air travel when congested'
    ],
    recoveryTime: '7-10 days acute; chronic can last weeks'
  },

  {
    disease: 'Mononucleosis (Mono)',
    severity: 'moderate',
    homecare: [
      'REST - critical (often requires 2-3 weeks)',
      'Stay hydrated - drink lots of fluids',
      'Eat soft foods if swallowing painful',
      'Use throat lozenges',
      'Gargle with salt water',
      'Take warm baths to ease body aches'
    ],
    medications: {
      otc: [
        'Acetaminophen or ibuprofen for fever/pain',
        'Throat lozenges with anesthetic'
      ]
    },
    seekCareIf: [
      'Difficulty breathing or swallowing',
      'Severe abdominal pain (enlarged spleen)',
      'Persistent high fever (>103.5°F)',
      'Yellow eyes or skin (liver involvement)',
      'Confusion or severe headache'
    ],
    preventionTips: [
      'Do NOT share drinking glasses or utensils',
      'Do NOT kiss while symptomatic',
      'Avoid contact sports for 3-4 weeks (spleen risk)',
      'Wash hands frequently',
      'Cover mouth when coughing/sneezing'
    ],
    recoveryTime: '2-4 weeks acute; fatigue can last weeks-months'
  }
];
