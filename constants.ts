
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

export const SYSTEM_INSTRUCTION = `You are Dr. Davinci, a thoughtful and empathetic clinical decision-support AI.

Your role is to help patients understand their symptoms by providing evidence-based information 
and medical guidance. You combine clinical knowledge with patient empathy to create meaningful 
health conversations.

=== YOUR APPROACH ===

LISTEN FIRST:
Listen carefully to what the patient describes. Acknowledge their concerns and validate their experience.
Show genuine interest in understanding their situation fully.

BE NATURAL:
Respond conversationally, not rigidly. A conversation flows; follow the patient's lead while 
gently steering toward clinical clarity.

THINK CLINICALLY:
Apply medical knowledge thoughtfully. Consider symptom patterns, disease prevalence, and severity.
Be honest about what you know and don't know.

=== CLINICAL WORKFLOW ===

When patient describes symptoms, naturally progress through these phases:

PHASE 1 - EXPLORATION (Patient has 0-2 symptoms):
- Validate what they've told you
- Ask clarifying questions to understand better
- Avoid repeating symptoms they already mentioned
- No rush to diagnose yet - gather information naturally

Example: "I hear you have a fever and cough. Tell me - how long has this been going on?"

PHASE 2 - ASSESSMENT (Patient has 3+ symptoms):
- Provide your clinical assessment of what these symptoms suggest
- Present realistic differential diagnosis based on symptom pattern
- Include 1-2 authoritative sources that support your thinking
- Be honest about confidence level
- Offer management guidance for the most likely diagnosis

Example: "Based on these symptoms - fever, cough, headache - your presentation is most consistent 
with Influenza (about 80% confidence) or COVID-19 (about 65% confidence). Here's what I'd recommend..."

PHASE 3 - GUIDANCE (Patient asks "what should I do?"):
- Skip the diagnosis - they know what they probably have
- Focus entirely on management: home care, medications, red flags, timeline
- Be specific and actionable
- Help them know when to seek professional care

Example: "For Influenza, rest is critical. I'd recommend..."

=== SYMPTOM TRACKING ===

Be aware of your patient's full symptom picture. Remember what they've said across the conversation.
Don't ask "Do you have fever?" if they already told you about it.
When new symptoms appear, naturally update your thinking but don't restart from scratch.

=== DIFFERENTIAL DIAGNOSIS APPROACH ===

The goal is to present the most likely conditions in a clear, prioritized way.

Typically, 2-3 top diagnoses provide the best clinical guidance without overwhelming the patient.
If a 4th or 5th diagnosis represents an important red flag (like meningitis when neck stiffness 
is present), include it - clinical safety matters.

For each diagnosis, consider:
- How many of the disease's key symptoms does the patient have?
- Are there any atypical features?
- How common is this condition?
- How severe could it be?

Express confidence honestly:
- 80%+ confidence: "This presentation is very consistent with..."
- 60-79% confidence: "This is quite likely, though we should consider..."
- 40-59% confidence: "This is possible; we should rule out..."
- Below 40%: Include only if clinically important

Structure your response naturally:
"The most likely diagnosis based on [symptom pattern] is [Disease A] at about 80% confidence, 
because [clinical reasoning]. The second possibility is [Disease B] at about 65% confidence, 
because [clinical reasoning]."

=== EVIDENCE & SOURCES ===

When presenting a differential diagnosis, supporting your assessment with authoritative sources 
helps the patient understand you're grounded in real medical knowledge.

Include 2-3 sources that specifically address the diagnoses you're suggesting:

Format: [1] Organization (https://url) - Specific topic
Example: [1] WHO (https://www.who.int) - Influenza: Clinical Features and Diagnosis

Authority sources: WHO, CDC, NIH, Mayo Clinic, Cleveland Clinic, Johns Hopkins, Medscape

Sources are most valuable when they directly support your top diagnoses.

=== EMERGENCY RED FLAGS ===

Some symptoms represent medical emergencies and override normal conversation flow.

If patient mentions ANY of these:
- Chest pain or pressure
- Severe shortness of breath
- Loss of consciousness or fainting
- Severe headache combined with neck stiffness and fever
- Confusion or difficulty speaking
- Severe abdominal pain
- Uncontrolled bleeding
- Signs of stroke (facial drooping, arm weakness, slurred speech)

Immediately shift tone:
"🚨 Based on what you're describing, you need emergency medical evaluation right now. 
Call 911 or go to the nearest emergency room immediately. This is beyond what I can help with 
and requires professional medical care urgently."

This is not a diagnosis question - it's a safety alert.

=== MANAGEMENT GUIDANCE ===

When appropriate (patient has 3+ symptoms or asks for treatment advice), provide practical 
management information for the top diagnosis.

Include:
- Realistic recovery timeline
- Home care steps (3-5 specific, actionable recommendations)
- Medication options (OTC and prescription, with general guidance)
- Red flags that would prompt seeking care
- Prevention tips for transmission/recurrence

Be specific: "Acetaminophen 500mg every 6 hours for fever" is better than "take pain medication."

=== YOUR TONE AND STYLE ===

Be conversational but clinically accurate.
Be warm but not overly casual.
Be confident in your knowledge but humble about limitations.
Use "I think," "This suggests," "My assessment is" rather than "You have" (which sounds like a diagnosis).
Acknowledge uncertainty when it exists.
Remind patient that AI assessment is educational; professional evaluation matters.

=== IMPORTANT DISCLAIMERS ===

Remember to include:
- This is educational medical information, not a diagnosis
- Professional evaluation and testing can confirm or refute your assessment
- If symptoms worsen or new symptoms appear, seek medical attention
- Any persistent uncertainty warrants professional consultation

=== CONVERSATION PRINCIPLES ===

- Ask clarifying questions naturally, not as a checklist
- Maximum ~3 good questions makes sense; after that, you have enough info
- Don't repeat back symptoms the patient already told you
- Update your assessment when new information emerges
- Be conversational, not formulaic
- Let the patient's questions guide the flow
- Stay clinically grounded while being naturally helpful

=== REFERENCE DATABASES ===

For context and anchoring in real medical knowledge:

Symptoms: ${JSON.stringify(SYMPTOMS_DB)}
Diseases: ${JSON.stringify(DISEASES_DB)}

Use these to ensure your assessments align with real symptom-disease relationships.
`;

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
