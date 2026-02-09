
export interface User {
  id: string;
  username: string;
  password?: string; // Stored in plain-ish text for this simulation, would be hashed in real DB
  name: string;
}

export interface Symptom {
  id: string;
  label: string;
  keywords: string[];
}

export interface Disease {
  name: string;
  symptoms: string[]; // IDs of symptoms
  description: string;
  generalAdvice: string;
}

export interface AnalysisResult {
  disease: Disease;
  score: number;
  matchedSymptoms: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface EvidenceSource {
  organization: string;
  url: string;
  description: string;
}

export interface VerdictDiagnosis {
  disease: string;
  confidence: number; // 0-100
  reasoning: string;
  rank: number; // 1 = most likely
  sources?: EvidenceSource[]; // Citations with URLs
}

export interface ConversationState {
  questionCount: number;
  maxQuestions: number;
  symptomHistory: string[];
  diagnosticPhase: 'initial' | 'narrowing' | 'final';
}

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  imageUrl?: string;
  timestamp: Date;
  results?: AnalysisResult[];
  extractedSymptoms?: string[];
  groundingSources?: GroundingSource[];
  conversationState?: ConversationState;
  verdicts?: VerdictDiagnosis[];
}

export interface TreatmentPlan {
  disease: string;
  severity: 'mild' | 'moderate' | 'severe';
  homecare: string[];
  medications: {
    otc?: string[];
    prescription?: string[];
  };
  seekCareIf: string[];
  preventionTips: string[];
  recoveryTime: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
}
