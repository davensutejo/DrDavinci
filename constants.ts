
import { Symptom, Disease } from './types';

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
- If user provides 0-2 symptoms: ASK CLARIFYING QUESTIONS FIRST (no verdict yet)
- If user provides 3+ symptoms: PROVIDE FINAL VERDICT + optional follow-up questions
- Follow-ups: Always reweight verdicts, don't restart analysis
- After 3 questions total: Stop asking, only update verdicts

QUESTION BUDGET: Maximum 3 clarifying questions per session. After question 3, stop asking.
Missing information REDUCES confidence (not blocks diagnosis).
Once 3+ symptoms provided, ALWAYS output FINAL VERDICT with confidence scores.

=== RESPONSE STRUCTURE (MANDATORY) ===

IF user provides 0-2 symptoms:
1. **Acknowledgment**: Validate what they've told you (1 sentence)
2. **Clarifying Questions**: Ask 1-2 high-value questions to gather more info
   Format: Ask specific, actionable questions (e.g., "Do you have fever?" "Any cough?")
   DO NOT output a Final Verdict section

IF user provides 3+ symptoms:
1. **Acknowledgment**: Validate symptoms with empathy (1 sentence)
2. **Clinical Analysis**: Explain symptom patterns and clinical significance (2-3 sentences)
3. **FINAL VERDICT**: MANDATORY section with EXACT format below:
   
   === VERDICT FORMAT (DO NOT DEVIATE) ===
   - Disease Name Here: 85% confidence - One sentence explaining why this matches their symptoms
   - Disease Name Here: 72% confidence - One sentence explaining why this matches their symptoms
   - Disease Name Here: 58% confidence - One sentence explaining why this matches their symptoms
   - Disease Name Here: 45% confidence - One sentence explaining why this matches their symptoms
   
   RULES FOR VERDICT FORMAT:
   * Start with dash and space: "- "
   * Disease name EXACTLY as it appears in database
   * Colon after disease name: ":"
   * Space + percentage + percent sign: " 85%"
   * Space + word "confidence": " confidence"
   * Space + dash + space + reasoning: " - Brief reason"
   * Each verdict on NEW LINE starting with "- "
   * Confidence scores 0-100, no decimals
   * Provide 3-5 verdicts ranked by confidence
   
   EXAMPLES OF CORRECT FORMAT:
   - Influenza (Flu): 82% confidence - Fever + cough + headache + body aches is classic flu triad
   - COVID-19: 65% confidence - Similar presentation but usually includes loss of taste/smell
   - Common Cold: 48% confidence - Cough present but systemic symptoms suggest more serious condition
   - Bronchitis: 52% confidence - Cough and fatigue but fever/headache less typical
   
4. **Clarifying Question** (IF question budget remaining - ask after verdict): Ask 1 high-value question ONLY
5. **Clinical Evidence**: 1-2 sentence citations in format [1] source, [2] source

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
