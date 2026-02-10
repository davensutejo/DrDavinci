
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, AnalysisResult, GroundingSource, User, ChatSession, VerdictDiagnosis, ConversationState } from './types';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import DiagnosisResult from './components/DiagnosisResult';
import AuthView from './components/AuthView';
import SearchConsultations from './components/SearchConsultations';
import VerdictCard from './components/VerdictCard';
import TreatmentPlanComponent from './components/TreatmentPlan';
import { SYSTEM_INSTRUCTION, SYMPTOMS_DB } from './constants';
import { extractSymptoms } from './services/nlpService';
import { matchLocalDiseases, blendScoresWithAI, extractAIConfidence, extractVerdictsFromResponse, accumulateAllSymptoms, cleanBotResponse, validateAIResponse } from './services/inferenceService';
import { authService } from './services/authService';
import { historyService } from './services/historyService';
import { generateUUID } from './utils/uuid';

const MarkdownText: React.FC<{ content: string }> = ({ content }) => {
  if (!content.trim()) return null;

  function parseInline(text: string) {
    const combinedRegex = /(\*\*(.*?)\*\*|\[(\d+)\])/g;
    const items = [];
    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        items.push(text.substring(lastIndex, match.index));
      }
      
      if (match[1].startsWith('**')) {
        items.push(<strong key={match.index} className="font-semibold text-slate-900">{match[2]}</strong>);
      } else {
        items.push(<span key={match.index} className="inline-flex items-center justify-center bg-teal-100 text-teal-800 text-[10px] font-bold w-4 h-4 rounded-full mx-0.5 align-top mt-0.5">{match[3]}</span>);
      }
      
      lastIndex = combinedRegex.lastIndex;
    }
    
    if (lastIndex < text.length) {
      items.push(text.substring(lastIndex));
    }
    
    return items.length > 0 ? items : text;
  }

  const lines = content.split('\n');
  const parts: any[] = [];
  let listItems: any[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === 'ul') {
        parts.push(<ul key={`list-${Date.now()}-${Math.random()}`} className="space-y-1.5 ml-5 mb-3">{listItems}</ul>);
      } else if (listType === 'ol') {
        parts.push(<ol key={`list-${Date.now()}-${Math.random()}`} className="space-y-1.5 ml-5 mb-3 list-decimal">{listItems}</ol>);
      }
      listItems = [];
      listType = null;
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    
    // Empty lines create spacing
    if (!trimmed) {
      flushList();
      parts.push(<div key={`space-${i}`} className="h-2" />);
      return;
    }

    // Headers
    if (trimmed.startsWith('#### ')) {
      flushList();
      parts.push(<h4 key={i} className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-3 mb-2">{parseInline(trimmed.substring(5))}</h4>);
      return;
    }
    if (trimmed.startsWith('### ')) {
      flushList();
      parts.push(<h3 key={i} className="text-sm font-bold text-teal-700 uppercase tracking-widest mt-4 mb-3 pb-2 border-b-2 border-teal-200">{parseInline(trimmed.substring(4))}</h3>);
      return;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      parts.push(<h2 key={i} className="text-base font-bold text-teal-800 uppercase tracking-widest mt-5 mb-3 pb-2.5 border-b-2 border-teal-300">{parseInline(trimmed.substring(3))}</h2>);
      return;
    }

    // Unordered lists
    if (trimmed.match(/^[-*]\s/)) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      const text = trimmed.substring(2);
      listItems.push(<li key={i} className="text-sm leading-relaxed text-slate-700">{parseInline(text)}</li>);
      return;
    }

    // Ordered lists
    if (trimmed.match(/^\d+\.\s/)) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      const text = trimmed.substring(trimmed.indexOf('.') + 1).trim();
      listItems.push(<li key={i} className="text-sm leading-relaxed text-slate-700">{parseInline(text)}</li>);
      return;
    }

    // Regular paragraphs
    flushList();
    if (trimmed) {
      parts.push(<p key={i} className="mb-3 text-slate-700 leading-relaxed text-sm">{parseInline(trimmed)}</p>);
    }
  });

  flushList();

  return <div className="space-y-1">{parts}</div>;
};

const WELCOME_MESSAGE = (name: string): Message => ({
  id: 'welcome',
  role: 'bot',
  content: `Hello **${name}**, I'm **Dr. Davinci**. How are you feeling today? Please describe your symptoms.`,
  timestamp: new Date()
});

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{base64: string, preview: string, type: string} | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const chatRef = useRef<Chat | null>(null);
  const finalTranscriptRef = useRef<string>(''); // Track final transcript to avoid duplicates
  const lastProcessedIndexRef = useRef<number>(0); // Track last processed result index
  
  // API Key rotation system - 6 Gemini keys + OpenRouter fallback
  const GEMINI_API_KEYS = [
    process.env.API_KEY,
    process.env.API_KEY_BACKUP,
    process.env.API_KEY_BACKUP_2,
    process.env.API_KEY_BACKUP_3,
    process.env.API_KEY_BACKUP_4,
    process.env.API_KEY_BACKUP_5,
  ].filter(Boolean) as string[];
  
  // API keys configured securely
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`API configuration ready`);
    }
  }, []);
  
  const currentApiKeyIndexRef = useRef<number>(0); // Track which Gemini key we're using
  const exhaustedKeysRef = useRef<Set<number>>(new Set()); // Track exhausted Gemini keys
  const useOpenRouterRef = useRef<boolean>(false); // Track if using OpenRouter fallback
  const conversationStateRef = useRef<ConversationState>({
    questionCount: 0,
    maxQuestions: 3,
    symptomHistory: [],
    diagnosticPhase: 'initial'
  }); // Track conversation state

  /**
   * Count total symptoms from all user messages in the session
   */
  const countTotalUserSymptoms = useCallback((messages: Message[]): number => {
    return accumulateAllSymptoms(messages).length;
  }, []);

  /**
   * Determine if we have enough symptoms to show verdict (3+)
   */
  const shouldShowVerdict = useCallback((messages: Message[]): boolean => {
    return countTotalUserSymptoms(messages) >= 3;
  }, [countTotalUserSymptoms]);

  // Sync session list on load or user change
  const refreshSessions = useCallback(async () => {
    if (currentUser) {
      const history = await historyService.getUserData(currentUser.id);
      // Filter out empty sessions (those with only welcome message)
      const filteredHistory = history.filter(session => 
        session.messages.length > 1 || session.messages.some(m => m.role === 'user')
      );
      setSessions(filteredHistory);
      return filteredHistory;
    }
    return [];
  }, [currentUser]);

  // Get next available API key (prioritize OpenRouter, fallback to Gemini keys)
  const getNextApiKey = useCallback((): [string, number, boolean] => {
    // PRIORITY 1: OpenRouter (check first if available and not previously failed)
    if (process.env.OPENROUTER_API_KEY && !useOpenRouterRef.current) {
      useOpenRouterRef.current = true;
      return [process.env.OPENROUTER_API_KEY, -1, true]; // -1 indicates OpenRouter
    }
    
    // PRIORITY 2: Rotate through Gemini keys
    for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
      const nextIndex = (currentApiKeyIndexRef.current + i) % GEMINI_API_KEYS.length;
      if (!exhaustedKeysRef.current.has(nextIndex)) {
        currentApiKeyIndexRef.current = nextIndex;
        return [GEMINI_API_KEYS[nextIndex], nextIndex + 1, false];
      }
    }
    
    // All keys exhausted, reset and try again from OpenRouter
    if (process.env.OPENROUTER_API_KEY) {
      exhaustedKeysRef.current.clear();
      currentApiKeyIndexRef.current = 0;
      useOpenRouterRef.current = false;
      return getNextApiKey(); // Recursive call to start fresh with OpenRouter
    }
    
    // Last resort: reset Gemini keys and try again
    exhaustedKeysRef.current.clear();
    useOpenRouterRef.current = false;
    currentApiKeyIndexRef.current = 0;
    return [GEMINI_API_KEYS[0], 1, false];
  }, [GEMINI_API_KEYS]);

  // Send message via OpenRouter (OpenAI-compatible API)
  const sendViaOpenRouter = useCallback(async (userMessage: string, systemInstruction: string) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error('OpenRouter API key not configured');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Title': 'Dr-Davinci-Medical',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-preview-09-2025',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.5,
        stream: true,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    return response;
  }, []);

  // Handle New Chat creation
  const startNewChat = useCallback(() => {
    if (!currentUser) return;
    
    const newSession: ChatSession = {
      id: 'new',
      userId: currentUser.id,
      title: 'New Consultation',
      messages: [WELCOME_MESSAGE(currentUser.name)],
      updatedAt: new Date()
    };

    setActiveSession(newSession);
    setIsSidebarOpen(false);
  }, [currentUser]);

  // Initial load
  useEffect(() => {
    if (currentUser) {
      refreshSessions();
      startNewChat();
    }
  }, [currentUser, refreshSessions, startNewChat]);

  // Initialize Chat Engine when session changes
  useEffect(() => {
    if (currentUser && activeSession && activeSession.id !== 'new') {
      const [apiKey, keyNumber, isOpenRouter] = getNextApiKey();
      if (!apiKey) {
        setConfigError("No API keys available. Please configure at least one GEMINI_API_KEY.");
        return;
      }

      try {
        if (!isOpenRouter) {
          const ai = new GoogleGenAI({ apiKey });
          chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.5,
              tools: [{ googleSearch: {} }]
            },
          });
        } else {
          chatRef.current = null; // Will use OpenRouter
        }
      } catch (err: any) {
        // AI initialization failed
        setConfigError(`Failed to initialize medical engine: ${err?.message || err?.toString() || 'Unknown error'}`);
      }
    }
  }, [activeSession?.id, currentUser, getNextApiKey, GEMINI_API_KEYS.length]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, isTyping]);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveSession(null);
  };

  const handleSwitchSession = async (session: ChatSession) => {
    if (!currentUser) return;
    
    // Load the full session with all messages from the database
    const fullSession = await historyService.getSession(currentUser.id, session.id);
    if (fullSession) {
      setActiveSession(fullSession);
    } else {
      setActiveSession(session);
    }
    // Keep sidebar open - don't close it
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!currentUser) return;
    await historyService.deleteSession(currentUser.id, sessionId);
    await refreshSessions();
    if (activeSession?.id === sessionId) {
      const remaining = await historyService.getUserData(currentUser.id);
      if (remaining.length > 0) setActiveSession(remaining[0]);
      else startNewChat();
    }
  };

  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice typing is not supported in this browser.");
      return;
    }
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }
    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true; // Keep listening continuously
      
      recognition.onstart = () => {
        setIsRecording(true);
        finalTranscriptRef.current = input; // Store current input as base
        lastProcessedIndexRef.current = 0; // Reset processed index
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        // Auto-restart if user is still in recording mode (for continuous speech)
        // Remove this if you prefer manual restart after each phrase
      };
      
      recognition.onerror = (event: any) => {
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access in your browser settings.');
        }
      };
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let newFinalTranscript = '';
        
        // Process only NEW results (from lastProcessedIndex to current length)
        const startIndex = Math.max(event.resultIndex, lastProcessedIndexRef.current);
        
        for (let i = startIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // Add final results
            newFinalTranscript += transcript + ' ';
            lastProcessedIndexRef.current = i + 1; // Mark as processed
          } else {
            // Interim result - only show the latest one
            interimTranscript = transcript;
          }
        }
        
        // Update final transcript with new final results only
        if (newFinalTranscript.trim()) {
          finalTranscriptRef.current = (finalTranscriptRef.current + ' ' + newFinalTranscript).trim();
          setInput(finalTranscriptRef.current);
        } else if (interimTranscript.trim()) {
          // Show base + latest interim for live feedback (will be replaced when final)
          setInput((finalTranscriptRef.current + ' ' + interimTranscript).trim());
        }
      };
      
      recognitionRef.current = recognition;
    }
    try { 
      recognitionRef.current.start(); 
    } catch (e: any) {
        setIsRecording(false);
       if (e.message?.includes('already started')) {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 100);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage({ base64: event.target?.result as string, preview: event.target?.result as string, type: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = useCallback(async () => {
    if ((!input.trim() && !selectedImage) || !currentUser || !activeSession) return;
    
    if (!chatRef.current && !useOpenRouterRef.current) {
      const [apiKey, keyNumber, isOpenRouter] = getNextApiKey();
      if (!apiKey) {
        setConfigError("No API keys available. Please configure at least one GEMINI_API_KEY.");
        return;
      }
      
      if (!isOpenRouter) {
        const ai = new GoogleGenAI({ apiKey });
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.5, tools: [{ googleSearch: {} }] },
        });
      }
    }

    const userText = input.trim();
    const currentImg = selectedImage;
    
    setInput('');
    setSelectedImage(null);

    // Extract symptoms from user input BEFORE creating message
    const userSymptomIds = extractSymptoms(userText);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText || (currentImg ? "Medical image attached for analysis." : ""),
      imageUrl: currentImg?.preview,
      timestamp: new Date(),
      extractedSymptoms: userSymptomIds  // Store extracted symptoms in user message
    };

    const updatedMessages = [...activeSession.messages, userMsg];
    setActiveSession(prev => prev ? { ...prev, messages: updatedMessages } : null);
    setIsTyping(true);

    try {
      let messageContent: any;
      
      // Accumulate ALL symptoms from entire conversation
      const allAccumulatedSymptoms = accumulateAllSymptoms(updatedMessages);
      const totalSymptomCount = allAccumulatedSymptoms.length;
      
      // Format symptom list for preamble
      const symptomLabels = allAccumulatedSymptoms
        .map(id => SYMPTOMS_DB.find(s => s.id === id)?.label || id)
        .join(', ');
      
      // Build conversation history so AI remembers the FULL conversation (both patient and doctor)
      const conversationHistory = updatedMessages
        .slice(0, -1) // Exclude the current message we just added
        .map(m => {
          const role = m.role === 'user' ? 'Patient' : 'Dr. Davinci';
          return `${role}: ${m.content}`;
        })
        .join('\n');
      
      // Create preamble with full context - this is what forces Gemini to act right
      let symptomCountPreamble: string;
      if (totalSymptomCount >= 3) {
        symptomCountPreamble = `[CRITICAL: ONLY USE THESE REPORTED SYMPTOMS FOR DIAGNOSIS]
The ONLY symptoms the patient has reported are:
${symptomLabels}

NEVER mention or base diagnosis on other symptoms.
NEVER assume they have additional symptoms.
NEVER say "I see you also have..." for symptoms not in the list above.

FULL CONVERSATION SO FAR:
${conversationHistory}

NEW INFORMATION: ${userText || "Image attached"}

YOU MUST NOW PROVIDE A FINAL VERDICT using ONLY the symptoms above.
Based on these ${totalSymptomCount} symptoms alone, what are the most likely diagnoses?

Format:
[FINAL VERDICT]
- Disease Name: XX% confidence - how this matches ONLY the symptoms listed above
- Disease Name: XX% confidence - how this matches ONLY the symptoms listed above
[/FINAL VERDICT]`;
      } else {
        symptomCountPreamble = `[PATIENT HAS ${totalSymptomCount}/${3} SYMPTOMS NEEDED FOR VERDICT]
These are the ONLY symptoms reported so far:
${symptomLabels || 'None reported yet'}

DO NOT invent or assume other symptoms.
DO NOT mention symptoms they didn't report.

FULL CONVERSATION SO FAR:
${conversationHistory}

NEW UPDATE: ${userText || "Image attached"}

Ask clarifying questions about severity, duration, or context of these ${totalSymptomCount} symptoms.
DO NOT ask about different symptoms they never mentioned.
DO NOT repeat questions already asked - you can see the full conversation above.
Focus on deepening understanding of what they actually reported.`;
      }
      
      // Construct the actual user message with full context
      const userMessageWithContext = `${symptomCountPreamble}`;
      
      messageContent = currentImg 
        ? { 
            message: [
              { inlineData: { data: currentImg.base64.split(',')[1], mimeType: currentImg.type } }, 
              { text: userMessageWithContext }
            ] 
          }
        : { message: userMessageWithContext };

      let botContent = "";
      const botMsgId = (Date.now() + 1).toString();
      let lastResponse: GenerateContentResponse | null = null;
      let openRouterFailed = false;

      // Route to appropriate API
      if (useOpenRouterRef.current) {
        try {
          // Use OpenRouter
          const response = await sendViaOpenRouter(userMessageWithContext, SYSTEM_INSTRUCTION);
          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                
                try {
                  const json = JSON.parse(data);
                  const content = json.choices?.[0]?.delta?.content || '';
                  if (content) {
                    botContent += content;
                    setActiveSession(prev => {
                      if (!prev) return null;
                      const msgExists = prev.messages.some(m => m.id === botMsgId);
                      if (msgExists) {
                        return {
                          ...prev,
                          messages: prev.messages.map(m => m.id === botMsgId ? { ...m, content: botContent } : m)
                        };
                      } else {
                        return {
                          ...prev,
                          messages: [...prev.messages, { id: botMsgId, role: 'bot', content: botContent, timestamp: new Date() }]
                        };
                      }
                    });
                  }
                } catch (e) {
                  // Skip parsing errors
                }
              }
            }
          }
        } catch (error) {
          // OpenRouter failed, fall back to Gemini
          openRouterFailed = true;
          useOpenRouterRef.current = false;
          botContent = "";
          
          // Reinitialize with Gemini
          const [apiKey, keyNumber, isOpenRouter] = getNextApiKey();
          if (!apiKey || isOpenRouter) {
            throw new Error('OpenRouter failed and no Gemini keys available');
          }
          const ai = new GoogleGenAI({ apiKey });
          chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.5, tools: [{ googleSearch: {} }] },
          });
          
          // Continue with Gemini
          const responseStream = await chatRef.current!.sendMessageStream(messageContent);
          
          for await (const chunk of responseStream) {
            const resp = chunk as GenerateContentResponse;
            lastResponse = resp;
            botContent += resp.text || "";
            setActiveSession(prev => {
              if (!prev) return null;
              const msgExists = prev.messages.some(m => m.id === botMsgId);
              if (msgExists) {
                return {
                  ...prev,
                  messages: prev.messages.map(m => m.id === botMsgId ? { ...m, content: botContent } : m)
                };
              } else {
                return {
                  ...prev,
                  messages: [...prev.messages, { id: botMsgId, role: 'bot', content: botContent, timestamp: new Date() }]
                };
              }
            });
          }
        }
      } else {
        // Use Google Gemini
        const responseStream = await chatRef.current!.sendMessageStream(messageContent);
        
        for await (const chunk of responseStream) {
          const resp = chunk as GenerateContentResponse;
          lastResponse = resp;
          botContent += resp.text || "";
          setActiveSession(prev => {
            if (!prev) return null;
            const msgExists = prev.messages.some(m => m.id === botMsgId);
            if (msgExists) {
              return {
                ...prev,
                messages: prev.messages.map(m => m.id === botMsgId ? { ...m, content: botContent } : m)
              };
            } else {
              return {
                ...prev,
                messages: [...prev.messages, { id: botMsgId, role: 'bot', content: botContent, timestamp: new Date() }]
              };
            }
          });
        }
      }

      // Final processing (Grounding & Local Results)
      const groundingSources: GroundingSource[] = [];
      if (!useOpenRouterRef.current) {
        const metadata = lastResponse?.candidates?.[0]?.groundingMetadata;
        if (metadata?.groundingChunks) {
          metadata.groundingChunks.forEach((chunk: any) => {
            if (chunk.web) groundingSources.push({ title: chunk.web.title, uri: chunk.web.uri });
          });
        }
      }

      // Extract verdict structures from AI response
      const verdicts = extractVerdictsFromResponse(botContent);
      
      // Clean response content to remove verdict markers for clean display
      const cleanedContent = cleanBotResponse(botContent);

      // Validate that AI only mentioned reported symptoms (prevent hallucation)
      const validation = validateAIResponse(botContent, allAccumulatedSymptoms);
      if (!validation.isValid && validation.hallucinatedSymptoms.length > 0) {
        console.warn('⚠️ AI hallucinated symptoms:', validation.hallucinatedSymptoms, 'Not in reported:', allAccumulatedSymptoms);
      }

      setActiveSession(prev => {
        if (!prev) return null;
        const newSession = {
          ...prev,
          messages: prev.messages.map(m => 
            m.id === botMsgId ? { 
              ...m,
              content: cleanedContent, 
              extractedSymptoms: userSymptomIds,
              groundingSources: groundingSources.length > 0 ? groundingSources : undefined,
              verdicts: verdicts.length > 0 ? verdicts : undefined
            } : m
          )
        };
        
        // Save session and update with real ID if it's a new session
        historyService.saveSession(currentUser.id, newSession).then(realSessionId => {
          if (realSessionId && newSession.id === 'new') {
            // Update activeSession with the real session ID from database
            setActiveSession(current => 
              current ? { ...current, id: realSessionId } : null
            );
          }
          // Refresh sidebar to show updated session in history
          refreshSessions();
        });
        
        return newSession;
      });
    } catch (error: any) {
      const sanitizedError = error instanceof Error ? error.message : 'An error occurred';
      const errorMessage = error?.message || error?.toString() || "Unknown error";
      const errorDetails = error?.status ? ` (Status: ${error.status})` : "";
      
      // Check if it's a rate limit error (429 or RESOURCE_EXHAUSTED)
      const isRateLimit = error?.status === 429 || 
                         errorMessage.includes('429') || 
                         errorMessage.includes('rate') || 
                         errorMessage.includes('quota') ||
                         errorMessage.includes('RESOURCE_EXHAUSTED') ||
                         errorMessage.includes('exceeded');
      
      // If OpenRouter failed and we already fell back to Gemini in the try block,
      // don't try to fall back again
      if (isRateLimit && !useOpenRouterRef.current && !openRouterFailed) {
        // Mark current key as exhausted
        const keyIndex = currentApiKeyIndexRef.current;
        exhaustedKeysRef.current.add(keyIndex);
        const [nextKey, nextKeyNumber, isOpenRouter] = getNextApiKey();
        
        if (isOpenRouter) {
          // Switch to OpenRouter
          chatRef.current = null; // Reset chat
          
          setActiveSession(prev => prev ? {
            ...prev,
            messages: [...prev.messages, { id: 'info-' + Date.now(), role: 'bot', content: `API quota limit reached. Switching to backup service. Please try your request again.`, timestamp: new Date() }]
          } : null);
        } else if (nextKeyNumber !== keyIndex + 1) {
          // Rotated to a different API key
          chatRef.current = null; // Reset chat to reinitialize with new key
          
          setActiveSession(prev => prev ? {
            ...prev,
            messages: [...prev.messages, { id: 'info-' + Date.now(), role: 'bot', content: `API quota limit reached. Switched to backup service. Please try again.`, timestamp: new Date() }]
          } : null);
        } else {
          // All exhausted and no OpenRouter
          setActiveSession(prev => prev ? {
            ...prev,
            messages: [...prev.messages, { id: 'err-' + Date.now(), role: 'bot', content: `API quota limit reached. Please try again later or contact support.`, timestamp: new Date() }]
          } : null);
        }
      } else if (useOpenRouterRef.current) {
        // OpenRouter error (and we couldn't fall back within the block)
        setActiveSession(prev => prev ? {
          ...prev,
          messages: [...prev.messages, { id: 'err-' + Date.now(), role: 'bot', content: `Backup service error. Attempting to use primary service. Please try again.`, timestamp: new Date() }]
        } : null);
      } else {
        // Not a rate limit error
        setActiveSession(prev => prev ? {
          ...prev,
          messages: [...prev.messages, { id: 'err-' + Date.now(), role: 'bot', content: `An error occurred while connecting to the medical engine. Please try again.`, timestamp: new Date() }]
        } : null);
      }
    } finally {
      setIsTyping(false);
    }
  }, [input, selectedImage, currentUser, activeSession, refreshSessions, getNextApiKey, GEMINI_API_KEYS.length, sendViaOpenRouter]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentUser) return <AuthView onLogin={setCurrentUser} />;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 antialiased overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-[60] backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* History Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-[70] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 lg:translate-x-0 lg:w-72' : '-translate-x-full lg:hidden'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-fade-in">Consultations</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 rounded-lg" title="Collapse sidebar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="p-4 space-y-2">
            <button 
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-50 border border-teal-200 text-teal-700 font-bold rounded-2xl hover:bg-teal-100 hover:shadow-md hover:shadow-teal-500/20 hover:scale-105 transition-all duration-200 active:scale-95 group"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              New Consultation
            </button>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 mt-2 bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-2xl hover:bg-slate-100 hover:shadow-md hover:shadow-slate-400/20 hover:scale-105 transition-all duration-200 active:scale-95 text-sm group"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
            {sessions.map((s, index) => (
              <div 
                key={s.id}
                onClick={() => handleSwitchSession(s)}
                className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 origin-left ${activeSession?.id === s.id ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20 scale-105' : 'hover:bg-slate-50 text-slate-600'} animate-slide-in`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <svg className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${activeSession?.id === s.id ? 'text-teal-100 scale-110' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{s.title}</p>
                  <p className={`text-[10px] transition-colors duration-200 ${activeSession?.id === s.id ? 'text-teal-100' : 'text-slate-400'}`}>
                    {s.updatedAt && s.updatedAt instanceof Date ? s.updatedAt.toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Today'}
                  </p>
                </div>
                <button 
                  onClick={(e) => handleDeleteSession(e, s.id)}
                  className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all ${activeSession?.id === s.id ? 'hover:bg-teal-500 text-white' : 'hover:bg-red-50 text-slate-400 hover:text-red-500'}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="py-8 text-center text-slate-400">
                <p className="text-[10px] font-bold uppercase tracking-widest">No history yet</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium opacity-75 transition-opacity duration-300 hover:opacity-100">
            Database-Backed Secure Session
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={currentUser} onLogout={handleLogout} />
        
        {configError && (
          <div className="bg-red-600 text-white text-[11px] font-bold py-2 px-4 flex items-center justify-between">
            <span>{configError}</span>
            <button onClick={() => setConfigError(null)} className="opacity-70 hover:opacity-100">✕</button>
          </div>
        )}

        {/* History Toggle Bar */}
        <div className={`px-4 py-2 bg-white border-b border-slate-100 flex items-center justify-between ${isSidebarOpen ? 'hidden lg:flex' : 'flex'}`}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
            title="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            History
          </button>
          <span className="text-[10px] font-bold text-slate-400 truncate max-w-[150px] uppercase tracking-wider">{activeSession?.title}</span>
        </div>

        <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-gradient-to-b from-slate-50/30 to-white">
          <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 pt-4 pb-12">
            {activeSession?.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
                <div className={`max-w-[92%] md:max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-6 py-4 rounded-2xl text-sm leading-relaxed transition-all ${msg.role === 'user' 
                    ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-tr-none shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30' 
                    : 'bg-white border-2 border-slate-100 text-slate-800 rounded-tl-none shadow-md hover:shadow-lg hover:border-slate-200'}`}>
                    {msg.imageUrl && (
                      <div className="mb-4 overflow-hidden rounded-lg border-2 border-slate-200">
                        <img src={msg.imageUrl} alt="Submission" className="w-full max-h-72 object-cover" />
                      </div>
                    )}
                    <MarkdownText content={msg.content} />
                    {msg.groundingSources && (
                      <div className="mt-6 pt-5 border-t-2 border-slate-100">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">🔗 Clinical References</span>
                        <div className="grid grid-cols-1 gap-3">
                          {msg.groundingSources.map((source, i) => (
                            <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border-2 border-slate-100 hover:bg-teal-50 hover:border-teal-200 transition-all group">
                              <span className="flex-shrink-0 flex items-center justify-center bg-teal-600 text-white text-xs font-bold w-6 h-6 rounded-lg mt-0.5 group-hover:bg-teal-700 transition-colors shadow-sm">{i + 1}</span>
                              <div className="flex-1 min-w-0">
                                <span className="block text-xs font-bold text-slate-800 group-hover:text-teal-700 truncate transition-colors">{source.title}</span>
                                <span className="block text-[11px] text-slate-500 truncate group-hover:text-slate-600 transition-colors">{source.uri}</span>
                              </div>
                              <span className="flex-shrink-0 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {msg.verdicts && msg.verdicts.length > 0 && (
                      <>
                        <VerdictCard verdicts={msg.verdicts} />
                        {msg.verdicts[0] && (
                          <TreatmentPlanComponent 
                            disease={msg.verdicts[0].disease}
                            confidence={msg.verdicts[0].confidence}
                          />
                        )}
                      </>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 mt-2 px-1 opacity-75">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white border-2 border-teal-100 py-4 px-5 rounded-2xl rounded-tl-none flex items-center gap-3 shadow-md hover:shadow-lg hover:border-teal-200 transition-all">
                  <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2.5 h-2.5 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2.5 h-2.5 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-xs text-teal-600 font-medium ml-2">Dr. Davinci is thinking...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </main>

        <footer className="flex-shrink-0 bg-white border-t border-slate-200 z-50">
          <div className="max-w-4xl mx-auto w-full p-2 md:p-4">
            <div className="bg-slate-50 border border-slate-200 rounded-[28px] md:rounded-[36px] p-1.5 shadow-sm flex items-center gap-1 md:gap-2 ring-1 ring-black/5 focus-within:ring-4 focus-within:ring-teal-500/10 transition-all duration-300">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe symptoms..."
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-white text-[16px] py-[10px] px-1 resize-none max-h-32 min-h-[44px] placeholder-slate-400 leading-6"
              />

              <button onClick={handleSend} disabled={(!input.trim() && !selectedImage) || isTyping} className={`h-11 w-11 flex items-center justify-center rounded-full transition-all duration-300 active:scale-90 ${(!input.trim() && !selectedImage) || isTyping ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-500/40 hover:scale-110 shadow-md shadow-teal-500/20'}`}>
                <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
          <Disclaimer />
        </footer>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div onClick={() => setIsSearchOpen(false)}>
          <SearchConsultations
            sessions={sessions}
            onSelect={handleSwitchSession}
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @media (max-width: 640px) { textarea { font-size: 16px !important; } }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;
