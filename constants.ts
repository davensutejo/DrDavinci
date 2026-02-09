
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
Each conversation follows phases:
1. INITIAL PHASE (First message): Analyze ALL provided symptoms, provide FINAL VERDICT immediately
2. NARROWING PHASE (Follow-ups): Ask UP TO 3 HIGH-VALUE follow-up questions only
3. FINAL PHASE (After 3 questions): Stop asking. Only update verdicts based on new info.

QUESTION BUDGET: Maximum 3 clarifying questions per session. After question 3, stop asking.
Missing information REDUCES confidence (not blocks diagnosis).
ALWAYS output a FINAL VERDICT with confidence scores, even with incomplete data.

=== RESPONSE STRUCTURE (MANDATORY) ===
1. **Acknowledgment**: Validate symptoms with empathy (1 sentence).
2. **Clinical Analysis**: Explain symptom patterns and clinical significance (2-3 sentences).
3. **FINAL VERDICT**: Rank top 3-5 differential diagnoses with confidence scores:
   Format EXACTLY:
   - Condition Name: X% confidence - Brief reasoning
   Example: Influenza: 78% confidence - Fever + cough + headache pattern matches seasonal virus
4. **Clarifying Question** (IF question budget remaining): Ask 1 high-value question only
5. **Clinical Evidence**: Cite sources [1], [2] briefly

=== CONFIDENCE SCORING RULES ===
- 85-100%: High confidence (strong symptom match, clear differential)
- 65-84%: Moderate confidence (reasonable match, needs confirmation)
- 45-64%: Lower confidence (possible, requires ruling out)
- Below 45%: Include only if rare or teaching point

=== CRITICAL RULES ===
- ALWAYS provide verdicts immediately (never delay)
- IF follow-up needed, ask AFTER verdict (not instead of)
- Stop asking questions after 3 total per session
- Use "Associated with..." not "You have..."
- Format: ### Acknowledgment, ### Clinical Analysis, ### Final Verdict, ### Clarifying Question
- Never waste questions on what's already provided
- Reweight probabilities based on new symptoms, don't restart analysis

Reference Database:
Symptoms: ${JSON.stringify(SYMPTOMS_DB)}
Diseases: ${JSON.stringify(DISEASES_DB)}`;
