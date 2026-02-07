
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, AnalysisResult, GroundingSource, User, ChatSession } from './types';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import DiagnosisResult from './components/DiagnosisResult';
import AuthView from './components/AuthView';
import SearchConsultations from './components/SearchConsultations';
import { SYSTEM_INSTRUCTION } from './constants';
import { extractSymptoms } from './services/nlpService';
import { matchLocalDiseases, blendScoresWithAI, extractAIConfidence } from './services/inferenceService';
import { authService } from './services/authService';
import { historyService } from './services/historyService';
import { generateUUID } from './utils/uuid';

const MarkdownText: React.FC<{ content: string }> = ({ content }) => {
  if (!content.trim()) return null;

  const parts = content.split('\n').map((line, i) => {
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const text = line.trim().substring(2);
      return <li key={i} className="ml-4 list-disc mb-1">{parseInline(text)}</li>;
    }
    if (line.trim().startsWith('### ')) {
      return <h3 key={i} className="text-sm font-bold text-teal-800 uppercase tracking-wider mt-4 mb-2">{parseInline(line.substring(4))}</h3>;
    }
    return <p key={i} className="mb-2 last:mb-0 leading-relaxed">{parseInline(line)}</p>;
  });

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

  return <div className="text-slate-800">{parts}</div>;
};

const WELCOME_MESSAGE = (name: string): Message => ({
  id: 'welcome',
  role: 'bot',
  content: `Hello **${name}**, I'm **Dr. Davinci**. How are you feeling today? Please describe your symptoms or share an image of your concern.`,
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
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        setConfigError("API Key is missing. Please configure API_KEY in your environment settings.");
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.5,
            tools: [{ googleSearch: {} }]
          },
        });
      } catch (err: any) {
        console.error("Failed to initialize AI:", err);
        setConfigError(`Failed to initialize medical engine: ${err?.message || err?.toString() || 'Unknown error'}`);
      }
    }
  }, [activeSession?.id, currentUser]);

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
        console.error('Speech recognition error:', event.error);
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
      console.error('Failed to start speech recognition:', e);
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
    
    if (!chatRef.current) {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        setConfigError("Cannot send message: API Key is missing.");
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.5, tools: [{ googleSearch: {} }] },
      });
    }

    const userText = input.trim();
    const currentImg = selectedImage;
    
    setInput('');
    setSelectedImage(null);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText || (currentImg ? "Medical image attached for analysis." : ""),
      imageUrl: currentImg?.preview,
      timestamp: new Date()
    };

    const updatedMessages = [...activeSession.messages, userMsg];
    setActiveSession(prev => prev ? { ...prev, messages: updatedMessages } : null);
    setIsTyping(true);

    try {
      let messageContent: any = currentImg 
        ? { 
            message: [
              { inlineData: { data: currentImg.base64.split(',')[1], mimeType: currentImg.type } }, 
              { text: userText || "Analyze this image." }
            ] 
          }
        : { message: userText };

      const responseStream = await chatRef.current!.sendMessageStream(messageContent);
      
      let botContent = "";
      const botMsgId = (Date.now() + 1).toString();
      let lastResponse: GenerateContentResponse | null = null;
      
      setActiveSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, { id: botMsgId, role: 'bot', content: "", timestamp: new Date() }]
        };
      });

      for await (const chunk of responseStream) {
        const resp = chunk as GenerateContentResponse;
        lastResponse = resp;
        botContent += resp.text || "";
        setActiveSession(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: prev.messages.map(m => m.id === botMsgId ? { ...m, content: botContent } : m)
          };
        });
      }

      // Final processing (Grounding & Local Results)
      const groundingSources: GroundingSource[] = [];
      const metadata = lastResponse?.candidates?.[0]?.groundingMetadata;
      if (metadata?.groundingChunks) {
        metadata.groundingChunks.forEach((chunk: any) => {
          if (chunk.web) groundingSources.push({ title: chunk.web.title, uri: chunk.web.uri });
        });
      }

      const foundSymptomIds = extractSymptoms(userText);
      let results = matchLocalDiseases(foundSymptomIds);

      // Blend AI confidence with local scores
      const aiConfidence = extractAIConfidence(botContent);
      if (results.length > 0) {
        results = results.map(result => ({
          ...result,
          score: blendScoresWithAI(result.score, aiConfidence, 0.4)
        }));
        // Re-sort by blended score
        results.sort((a, b) => b.score - a.score);
      }

      setActiveSession(prev => {
        if (!prev) return null;
        const newSession = {
          ...prev,
          messages: prev.messages.map(m => 
            m.id === botMsgId ? { 
              ...m, 
              results: results.length > 0 ? results : undefined,
              extractedSymptoms: foundSymptomIds,
              groundingSources: groundingSources.length > 0 ? groundingSources : undefined
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
          // Refresh sessions AFTER save completes to avoid duplicates
          refreshSessions().catch(console.error);
        }).catch(console.error);
        
        return newSession;
      });
    } catch (error: any) {
      console.error("API Error:", error);
      const errorMessage = error?.message || error?.toString() || "Unknown error";
      const errorDetails = error?.status ? ` (Status: ${error.status})` : "";
      setActiveSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, { id: 'err-' + Date.now(), role: 'bot', content: `An error occurred while connecting to the medical engine: ${errorMessage}${errorDetails}. Please verify your API key and connection.`, timestamp: new Date() }]
      } : null);
    } finally {
      setIsTyping(false);
    }
  }, [input, selectedImage, currentUser, activeSession, refreshSessions]);

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

        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 pt-4 pb-8">
            {activeSession?.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
                <div className={`max-w-[92%] md:max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-4 rounded-3xl text-[15px] leading-relaxed transition-all shadow-sm ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                    {msg.imageUrl && (
                      <div className="mb-3 overflow-hidden rounded-2xl border border-white/20">
                        <img src={msg.imageUrl} alt="Submission" className="w-full max-h-64 object-cover" />
                      </div>
                    )}
                    <MarkdownText content={msg.content} />
                    {msg.groundingSources && (
                      <div className="mt-6 pt-5 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Clinical References</span>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.groundingSources.map((source, i) => (
                            <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-teal-50 transition-all group">
                              <span className="flex-shrink-0 flex items-center justify-center bg-teal-600 text-white text-[10px] font-bold w-5 h-5 rounded-lg mt-0.5">{i + 1}</span>
                              <div className="flex-1 min-w-0">
                                <span className="block text-xs font-semibold text-slate-700 group-hover:text-teal-700 truncate">{source.title}</span>
                                <span className="block text-[10px] text-slate-400 truncate">{source.uri}</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {msg.results && (
                      <div className="mt-6 pt-5 border-t border-slate-100">
                        <DiagnosisResult results={msg.results} />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 mt-2 uppercase tracking-widest">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white border border-slate-200 py-3 px-5 rounded-3xl rounded-tl-none flex items-center gap-3 shadow-sm animate-pulse">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </main>

        <footer className="flex-shrink-0 bg-white border-t border-slate-200 z-50">
          <div className="max-w-4xl mx-auto w-full p-2 md:p-4">
            {selectedImage && (
              <div className="mb-2 flex px-2">
                <div className="relative">
                  <img src={selectedImage.preview} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border-2 border-teal-500 shadow-md" />
                  <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-slate-900 text-white p-1 rounded-full"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-[28px] md:rounded-[36px] p-1.5 shadow-sm flex items-center gap-1 md:gap-2 ring-1 ring-black/5 focus-within:ring-4 focus-within:ring-teal-500/10 transition-all duration-300">
              <button onClick={() => fileInputRef.current?.click()} className="h-11 w-11 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all duration-200 hover:scale-110 active:scale-90">
                <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe symptoms..."
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-[16px] py-[10px] px-1 resize-none max-h-32 min-h-[44px] placeholder-slate-400 leading-6"
              />

              <button onClick={toggleRecording} className={`h-11 w-11 flex items-center justify-center rounded-full transition-all duration-300 relative active:scale-95 hover:scale-110 ${isRecording ? 'text-red-600 bg-red-50' : 'text-slate-400 hover:text-teal-600 hover:bg-teal-50'}`}>
                {isRecording && <span className="absolute inset-0 rounded-full bg-red-400/20 animate-ping"></span>}
                <svg className={`w-6 h-6 ${isRecording ? 'animate-pulse' : 'transition-transform duration-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </button>

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
