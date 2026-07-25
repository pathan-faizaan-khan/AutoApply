"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Send,
  Volume2,
  VolumeX,
  SquarePen,
  History,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Map,
  X,
  MessageSquare,
  Clock,
  Trash2,
  CheckCircle2,
  Circle,
  Sparkles,
  StopCircle,
  User,
  Mic,
} from "lucide-react";
import { RenderMarkdown } from "./RenderMarkdown";
import { VoiceMode } from "./VoiceMode";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: "done" | "active" | "upcoming";
  week?: string;
}

// ─── Placeholder Roadmap Data (replace with schema later) ─────────────────────
const PLACEHOLDER_ROADMAP: RoadmapStep[] = [
  { id: "1", title: "Self Assessment", description: "Identify strengths, values, and target roles", status: "done", week: "Week 1" },
  { id: "2", title: "Resume & LinkedIn", description: "Optimize resume and LinkedIn for target roles", status: "active", week: "Week 2-3" },
  { id: "3", title: "Job Research", description: "Build a list of 50 target companies and roles", status: "upcoming", week: "Week 4" },
  { id: "4", title: "Outreach Campaign", description: "Send cold emails and LinkedIn connection requests", status: "upcoming", week: "Week 5-6" },
  { id: "5", title: "Interview Prep", description: "Practice STAR stories and technical questions", status: "upcoming", week: "Week 7" },
  { id: "6", title: "Negotiate & Accept", description: "Evaluate offers, negotiate salary, sign offer", status: "upcoming", week: "Week 8+" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

function getSessionTitle(messages: Message[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New Chat";
  return first.content.slice(0, 45) + (first.content.length > 45 ? "…" : "");
}

// ─── Speak Button (ElevenLabs Neural TTS) ────────────────────────────────────
function SpeakButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setState("idle");
  }, []);

  const handleSpeak = useCallback(async () => {
    if (state === "loading") return;
    if (state === "playing") { stop(); return; }

    setState("loading");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        console.error("TTS request failed:", res.status);
        setState("idle");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        setState("idle");
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setState("idle");
      };

      setState("playing");
      await audio.play();
    } catch (err) {
      console.error("TTS error:", err);
      setState("idle");
    }
  }, [text, state, stop]);

  const title =
    state === "loading" ? "Generating audio…" :
    state === "playing" ? "Stop speaking" :
    "Speak this message";

  return (
    <button
      onClick={handleSpeak}
      disabled={state === "loading"}
      title={title}
      className={`p-1.5 rounded-lg transition-all disabled:opacity-50 ${
        state !== "idle" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {state === "loading" ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : state === "playing" ? (
        <StopCircle className="w-3.5 h-3.5" />
      ) : (
        <Volume2 className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

// ─── Chat Message ─────────────────────────────────────────────────────────────
function ChatMessage({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-gradient-to-br from-violet-500 to-primary text-white"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <BrainCircuit className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "glass border border-border/50 rounded-tl-sm"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{msg.content}</p>
          ) : (
            <RenderMarkdown text={msg.content} />
          )}
        </div>

        {/* Meta row */}
        <div className={`flex items-center gap-1.5 px-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] text-muted-foreground">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {!isUser && <SpeakButton text={msg.content} />}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-violet-500 to-primary text-white shadow-sm">
        <BrainCircuit className="w-4 h-4" />
      </div>
      <div className="glass border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Roadmap Panel ────────────────────────────────────────────────────────────
function RoadmapPanel({ 
  onClose, 
  roadmap, 
  isLoading,
  completedSteps,
  onMarkCompleted 
}: { 
  onClose: () => void; 
  roadmap: any; 
  isLoading: boolean;
  completedSteps: number[];
  onMarkCompleted: (stepId: number, title: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-[380px] flex-shrink-0 glass border-l border-border/50 flex flex-col h-full overflow-hidden shadow-2xl relative"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-full h-48 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border/50 relative z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/20">
            <Map className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Career Roadmap</h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{roadmap?.career_path || "Your Journey"}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground transition-all hover:scale-105 active:scale-95">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Steps Container */}
      <div className="flex-1 overflow-y-auto p-5 hide-scrollbar relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary drop-shadow-md" />
            <p className="text-xs font-semibold text-muted-foreground animate-pulse">Generating your path...</p>
          </div>
        ) : roadmap?.steps ? (
          <div className="space-y-4">
            {roadmap.steps.map((step: any, idx: number) => {
              const stepId = step.id || idx;
              const isCompleted = completedSteps.includes(stepId) || step.status === 'completed';
              const isNext = !isCompleted && (idx === 0 || completedSteps.includes(roadmap.steps[idx - 1]?.id || idx - 1));

              return (
                <div key={stepId} className="relative group">
                  {/* Connector line */}
                  {idx < roadmap.steps.length - 1 && (
                    <div
                      className={`absolute left-[23px] top-12 w-[2px] h-[calc(100%+16px)] -mb-4 transition-colors duration-500
                        ${isCompleted ? 'bg-gradient-to-b from-green-500 to-green-500/20' : 'bg-gradient-to-b from-border to-border/30'}`}
                    />
                  )}

                  <div className={`relative flex gap-4 p-4 rounded-2xl transition-all duration-300 border backdrop-blur-sm shadow-sm
                    ${isCompleted ? 'bg-green-500/5 border-green-500/20 shadow-green-500/10' : 
                      isNext ? 'bg-background hover:bg-muted/30 border-primary/30 shadow-primary/5 hover:border-primary/50 translate-x-1' : 
                      'bg-background/50 border-border/40 hover:bg-background'}`}
                  >
                    {/* Status icon (Interactive checkbox) */}
                    <button
                      onClick={() => onMarkCompleted(stepId, step.title)}
                      disabled={isCompleted}
                      className="shrink-0 mt-1 outline-none transition-transform active:scale-90 disabled:cursor-default disabled:active:scale-100 z-10 bg-background rounded-full h-fit"
                    >
                      {isCompleted ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative">
                          <div className="absolute inset-0 rounded-full bg-green-500 blur-sm opacity-40" />
                          <CheckCircle2 className="relative w-6 h-6 text-green-500 drop-shadow-sm" />
                        </motion.div>
                      ) : isNext ? (
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-primary blur-sm animate-pulse opacity-40" />
                          <Circle className="relative w-6 h-6 text-primary drop-shadow-sm cursor-pointer" />
                        </div>
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors cursor-pointer" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        {step.category && (
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap
                            ${isCompleted ? 'bg-green-500/10 text-green-500' : 
                              isNext ? 'bg-primary/10 text-primary' : 
                              'bg-muted text-muted-foreground'}`}>
                            {step.category}
                          </span>
                        )}
                        <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {step.estimated_days}d
                        </span>
                      </div>
                      <p className={`text-sm font-bold leading-tight mb-1 transition-colors
                        ${isCompleted ? 'text-green-500/80' : isNext ? 'text-foreground' : 'text-foreground/80'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 pt-10">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
              <Map className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">No Roadmap Yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Ask the AI Counselor to generate a custom career roadmap for you.</p>
            </div>
          </div>
        )}

        {roadmap?.steps && (
          <div className="mt-8 pb-4 text-center">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <p className="text-[10px] font-semibold text-muted-foreground">
                Roadmap evolves with your progress
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── History Drawer ───────────────────────────────────────────────────────────
function HistoryDrawer({
  sessions,
  activeId,
  onSelect,
  onDelete,
  onClose,
}: {
  sessions: ChatSession[];
  activeId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute left-0 top-0 bottom-0 w-72 glass border-r border-border z-50 flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">Chat History</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 hide-scrollbar">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No past chats yet</div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  s.id === activeId ? "bg-primary/10 border border-primary/20 text-primary" : "hover:bg-muted text-foreground"
                }`}
                onClick={() => { onSelect(s.id); onClose(); }}
              >
                <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{s.title}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(s.createdAt).toLocaleDateString()}
                    <span className="ml-1">· {s.messages.length} msgs</span>
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}

// ─── Welcome Screen ───────────────────────────────────────────────────────────
const STARTERS = [
  "I'm a new user. Let's do my onboarding questionnaire to build my career profile!",
  "Help me write a compelling cover letter",
  "How do I prepare for a technical interview?",
  "Review my career trajectory and suggest next steps",
  "What skills should I learn for a Product Manager role?",
  "How do I negotiate a higher salary?",
];

function WelcomeScreen({ onSend }: { onSend: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-500 via-primary to-sky-400 flex items-center justify-center shadow-xl">
          <BrainCircuit className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground">AI Career Counselor</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Your personal AI coach for job search, interviews, salary negotiation, and career growth.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl"
      >
        {STARTERS.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => onSend(s)}
            className="text-left text-xs font-medium p-3 rounded-xl glass border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary mb-1" />
            {s}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Context Window Pill ───────────────────────────────────────────────────────
function ContextWindowPill({ count }: { count: number }) {
  const max = 20;
  const pct = Math.min((count / max) * 100, 100);
  const color = pct > 80 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-primary";
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass border border-border text-xs text-muted-foreground">
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span>{count}/{max}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AICounselorPage() {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [isSubmittingOnboarding, setIsSubmittingOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState({ role: "", skills: "" });

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showVoiceMode, setShowVoiceMode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch roadmap when panel is opened
  useEffect(() => {
    if (showRoadmap && !roadmap && !isLoadingRoadmap) {
      const fetchRoadmap = async () => {
        setIsLoadingRoadmap(true);
        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/career/generate-roadmap`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({}) // backend auto-fills user details
          });
          if (res.ok) {
            const data = await res.json();
            setRoadmap(data);
          }
        } catch (error) {
          console.error("Failed to fetch roadmap:", error);
        } finally {
          setIsLoadingRoadmap(false);
        }
      };
      fetchRoadmap();
    }
  }, [showRoadmap, roadmap, isLoadingRoadmap]);

  // Load sessions from API, fallback to localStorage
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/career/session`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            const formattedMessages = data.messages.map((m: any, i: number) => ({
              ...m,
              id: m.id || generateId(),
              timestamp: m.timestamp || Date.now() + i
            }));

            // Re-construct a single active session from DB
            const dbSession: ChatSession = {
              id: "db-session",
              title: "Career Counseling",
              createdAt: Date.now(),
              messages: formattedMessages
            };
            setSessions([dbSession]);
            setActiveSessionId(dbSession.id);
            setMessages(formattedMessages);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load DB session", err);
      }
      
      // Fallback / Initial load from localStorage
      try {
        const saved = localStorage.getItem("ai_counselor_sessions");
        if (saved) {
          const parsed: ChatSession[] = JSON.parse(saved);
          setSessions(parsed);
          if (parsed.length > 0) {
            const last = parsed[0]!;
            setActiveSessionId(last.id);
            setMessages(last.messages);
          }
        }
      } catch {}
    };
    
    const checkOnboarding = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/profile`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        if (res.ok) {
          const data = await res.json();
          const p = data.profile;
          if (!p || !p.skills || !p.jobTitle) {
            setIsOnboarded(false);
          } else {
            setIsOnboarded(true);
          }
        } else {
          // If 401 or 404, block them. If 500, maybe block too.
          setIsOnboarded(false);
        }
      } catch {
        setIsOnboarded(false);
      }
    };

    checkOnboarding();
    loadSession();
  }, []);

  const handleMarkCompleted = async (stepId: number, title: string) => {
    if (completedSteps.includes(stepId)) return;
    
    // Optimistic UI update
    setCompletedSteps(prev => [...prev, stepId]);
    
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/career/progress/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          step_id: stepId,
          status: "completed",
          completion_percentage: 100
        })
      });
      
      if (res.ok) {
        // Send a message to the AI automatically so it gets context of the completion
        sendMessage(`I have just completed the roadmap step: ${title}! What should I do next?`);
      } else {
        // Revert on failure
        setCompletedSteps(prev => prev.filter(id => id !== stepId));
      }
    } catch (err) {
      console.error("Failed to mark step as completed", err);
      // Revert on failure
      setCompletedSteps(prev => prev.filter(id => id !== stepId));
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardingData.role.trim() || !onboardingData.skills.trim()) return;
    setIsSubmittingOnboarding(true);
    try {
      const token = localStorage.getItem("token") || "";
      const payload = {
        jobTitle: onboardingData.role.trim(),
        skills: onboardingData.skills.trim(),
      };
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      setIsOnboarded(true);
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    } finally {
      setIsSubmittingOnboarding(false);
    }
  };

  const persistSessions = useCallback((updated: ChatSession[]) => {
    try {
      localStorage.setItem("ai_counselor_sessions", JSON.stringify(updated.slice(0, 10)));
    } catch {}
  }, []);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ONLY the inner messages container — never the outer layout
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    // Use scrollTop directly to avoid scrollIntoView which climbs all ancestors
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: text.trim(),
      timestamp: Date.now(),
    };

    // Auto-start new chat if limit reached
    let baseMessages = messages;
    let sessionId = activeSessionId;
    if (messages.length >= 20) {
      baseMessages = [];
      sessionId = "";
      setActiveSessionId("");
    }

    const updatedMessages = [...baseMessages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/career/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text.trim(),
          reset_session: messages.length >= 20
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        throw new Error("Invalid response format");
      }
      const replyContent = data.reply || data.error || "Sorry, I encountered an error. Please try again.";

      // Handle server-side actions
      if (data.action_taken === "roadmap_generated") {
        setRoadmap(null); // Clear old data to force a re-fetch
        setShowRoadmap(true); // Open the panel
      }

      const aiMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: replyContent,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      // Save/update session
      const sessionTitle = getSessionTitle(finalMessages);
      
      let finalSessionId = sessionId;

      setSessions((prev) => {
        let updated: ChatSession[];
        if (!finalSessionId || !prev.find((s) => s.id === finalSessionId)) {
          finalSessionId = generateId();
          setActiveSessionId(finalSessionId);
          updated = [
            { id: finalSessionId, title: sessionTitle, messages: finalMessages, createdAt: Date.now() },
            ...prev,
          ];
        } else {
          updated = prev.map((s) =>
            s.id === finalSessionId ? { ...s, title: sessionTitle, messages: finalMessages } : s
          );
        }
        persistSessions(updated);
        return updated;
      });
    } catch (err) {
      const errMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please check your connection and try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isLoading, activeSessionId, persistSessions]);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setActiveSessionId("");
    setInput("");
    setShowHistory(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const selectSession = useCallback((id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      setActiveSessionId(id);
      setMessages(session.messages);
    }
  }, [sessions]);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      persistSessions(updated);
      if (id === activeSessionId) {
        setMessages([]);
        setActiveSessionId("");
      }
      return updated;
    });
  }, [activeSessionId, persistSessions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  };

  const contextCount = Math.min(messages.length, 20);

  return (
    <div className="relative flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] glass rounded-3xl border border-border/70 shadow-xl overflow-hidden">
      
      {/* ── Forced Onboarding Overlay ── */}
      <AnimatePresence>
        {isOnboarded === false && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md p-8 glass border border-border/50 rounded-3xl shadow-2xl"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-sky-400 flex items-center justify-center shadow-lg">
                  <BrainCircuit className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">Welcome to AI Counselor</h2>
              <p className="text-sm text-center text-muted-foreground mb-8">
                To give you the best career advice, I need to know a little bit about your goals.
              </p>
              
              <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 ml-1">Target Role</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    value={onboardingData.role}
                    onChange={(e) => setOnboardingData({ ...onboardingData, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 ml-1">Top Skills</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. React, TypeScript, Node.js"
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    value={onboardingData.skills}
                    onChange={(e) => setOnboardingData({ ...onboardingData, skills: e.target.value })}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmittingOnboarding}
                  className="w-full mt-6 bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmittingOnboarding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Complete Profile
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 glass shrink-0 z-10">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-foreground leading-none">AI Career Counselor</h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Context Window */}
          <ContextWindowPill count={contextCount} />

          {/* Voice Mode */}
          <button
            onClick={() => setShowVoiceMode(true)}
            title="Start Voice Mode"
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all flex items-center gap-1 text-xs font-semibold"
          >
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Voice Mode</span>
          </button>

          {/* History */}
          <button
            onClick={() => setShowHistory(true)}
            title="Chat History"
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all relative"
          >
            <History className="w-4 h-4" />
            {sessions.length > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </button>

          {/* New Chat */}
          <button
            onClick={startNewChat}
            title="New Chat"
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <SquarePen className="w-4 h-4" />
          </button>

          {/* Roadmap toggle */}
          <button
            onClick={() => setShowRoadmap((v) => !v)}
            title="Career Roadmap"
            className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-semibold ${
              showRoadmap ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Roadmap</span>
            {showRoadmap ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Chat Panel ── */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Messages */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar">
            {messages.length === 0 ? (
              <WelcomeScreen onSend={(t) => sendMessage(t)} />
            ) : (
              <div className="max-w-2xl mx-auto space-y-4 pb-2">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} msg={msg} />
                ))}
                {isLoading && <TypingIndicator />}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border/40 shrink-0">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-end gap-2 glass border border-border/60 rounded-2xl px-3 py-2 shadow-sm focus-within:border-primary/40 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about your career…"
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none max-h-[140px] py-1"
                  style={{ height: "auto" }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed mb-0.5"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>

        {/* ── Roadmap Panel ── */}
        <AnimatePresence>
          {showRoadmap && (
            <RoadmapPanel 
              onClose={() => setShowRoadmap(false)} 
              roadmap={roadmap} 
              isLoading={isLoadingRoadmap} 
              completedSteps={completedSteps}
              onMarkCompleted={handleMarkCompleted}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── History Drawer ── */}
      <AnimatePresence>
        {showHistory && (
          <HistoryDrawer
            sessions={sessions}
            activeId={activeSessionId}
            onSelect={selectSession}
            onDelete={deleteSession}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Voice Mode Fullscreen Overlay ── */}
      <AnimatePresence>
        {showVoiceMode && (
          <VoiceMode
            onClose={() => setShowVoiceMode(false)}
            chatHistory={messages}
            onExchangeComplete={(userText, aiText) => {
              // Add both messages to the chat history
              const userMsg: Message = { id: generateId(), role: "user", content: userText, timestamp: Date.now() };
              const aiMsg: Message = { id: generateId(), role: "assistant", content: aiText, timestamp: Date.now() + 1 };
              const updatedMessages = [...messages, userMsg, aiMsg];
              setMessages(updatedMessages);
              
              const sessionTitle = getSessionTitle(updatedMessages);
              let sessionId = activeSessionId;
              setSessions((prev) => {
                let updated: ChatSession[];
                if (!sessionId || !prev.find((s) => s.id === sessionId)) {
                  sessionId = generateId();
                  setActiveSessionId(sessionId);
                  updated = [{ id: sessionId, title: sessionTitle, messages: updatedMessages, createdAt: Date.now() }, ...prev];
                } else {
                  updated = prev.map((s) => s.id === sessionId ? { ...s, title: sessionTitle, messages: updatedMessages } : s);
                }
                persistSessions(updated);
                return updated;
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
