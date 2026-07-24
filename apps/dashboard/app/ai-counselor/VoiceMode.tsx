"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, X, Settings2, PhoneOff,
  Loader2, Check, ChevronDown, Volume2
} from "lucide-react";
import { RenderMarkdown } from "./page";

// ─── Types ────────────────────────────────────────────────────────────────────
type VoiceState = "idle" | "listening" | "processing" | "speaking";

interface VoiceOption {
  id: string;
  name: string;
  description: string;
}

export const VOICES: VoiceOption[] = [
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam",    description: "Warm & Authoritative" },
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel",  description: "Calm & Professional"  },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi",    description: "Strong & Confident"   },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella",   description: "Friendly & Warm"      },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni",  description: "Well-rounded"         },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh",    description: "Deep & Rich"          },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold",  description: "Crisp & Clear"        },
];

// ─── Globe Canvas ─────────────────────────────────────────────────────────────
function GlobeCanvas({ voiceState, amplitude }: { voiceState: VoiceState; amplitude: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotRef   = useRef(0);
  const rafRef   = useRef<number>(0);
  const ampRef   = useRef(0);

  useEffect(() => { ampRef.current = amplitude; }, [amplitude]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const S = canvas.width;
    const cx = S / 2, cy = S / 2;
    const DEG = Math.PI / 180;

    const colors: Record<VoiceState, [number, number, number]> = {
      idle:       [148, 163, 184],
      listening:  [34,  197,  94],
      processing: [168,  85, 247],
      speaking:   [56,  189, 248],
    };

    function draw() {
      ctx.clearRect(0, 0, S, S);
      const [r, g, b] = colors[voiceState];
      const speed = voiceState === "speaking" ? 1.6 : voiceState === "listening" ? 0.8 : 0.3;
      rotRef.current += speed;

      const amp = ampRef.current;
      const R = (S * 0.37) * (1 + amp * 0.3);

      const pts: { x: number; y: number; z: number; norm: number }[] = [];
      for (let lat = -78; lat <= 78; lat += 13) {
        for (let lon = 0; lon < 360; lon += 13) {
          const lRad = lat * DEG;
          const nRad = (lon + rotRef.current) * DEG;
          const x = cx + R * Math.cos(lRad) * Math.cos(nRad);
          const y = cy + R * Math.sin(lRad);
          const z = Math.cos(lRad) * Math.sin(nRad); // -1..1
          if (z >= -0.15) pts.push({ x, y, z, norm: (z + 1) / 2 });
        }
      }
      pts.sort((a, b) => a.z - b.z);
      pts.forEach(({ x, y, norm }) => {
        const alpha = 0.15 + norm * 0.85;
        const size  = 1 + norm * 3.2 + amp * 2.8;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [voiceState]); // re-run when state changes to pick new color/speed

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      className="block"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

// ─── Voice Mode ───────────────────────────────────────────────────────────────
interface VoiceModeProps {
  onClose: () => void;
  chatHistory: Array<{ role: string; content: string }>;
  onExchangeComplete: (userText: string, aiText: string) => void;
}

export function VoiceMode({ onClose, chatHistory, onExchangeComplete }: VoiceModeProps) {
  const [voiceState,       setVoiceState]       = useState<VoiceState>("idle");
  const [selectedVoice,    setSelectedVoice]    = useState<VoiceOption>(VOICES[0]!);
  const [showVoiceMenu,    setShowVoiceMenu]    = useState(false);
  const [liveTranscript,   setLiveTranscript]   = useState("");
  const [lastUserText,     setLastUserText]     = useState("");
  const [lastAIText,       setLastAIText]       = useState("Hello! I'm Alex, your AI Career Counselor. How can I help you today?");
  const [amplitude,        setAmplitude]        = useState(0);
  const [error,            setError]            = useState("");

  const recognitionRef = useRef<any>(null);
  const audioCtxRef    = useRef<AudioContext | null>(null);
  const analyserRef    = useRef<AnalyserNode | null>(null);
  const streamRef      = useRef<MediaStream | null>(null);
  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const ampRafRef      = useRef<number>(0);
  const isListeningRef = useRef(false);
  const selectedVoiceRef = useRef(selectedVoice);

  // Keep voice ref in sync
  useEffect(() => { selectedVoiceRef.current = selectedVoice; }, [selectedVoice]);

  // ── Amplitude Polling ──────────────────────────────────────────────────────
  const startAmpPolling = useCallback(() => {
    const poll = () => {
      if (!analyserRef.current) { ampRafRef.current = requestAnimationFrame(poll); return; }
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += Math.abs((data[i] ?? 128) - 128);
      setAmplitude(Math.min(1, (sum / data.length) / 18));
      ampRafRef.current = requestAnimationFrame(poll);
    };
    ampRafRef.current = requestAnimationFrame(poll);
  }, []);

  // ── Setup Mic ──────────────────────────────────────────────────────────────
  const setupMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      const actx = new AudioContext();
      audioCtxRef.current = actx;
      const analyser = actx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      actx.createMediaStreamSource(stream).connect(analyser);
      startAmpPolling();
    } catch {
      setError("Microphone access denied. Please allow mic access to use Voice Mode.");
    }
  }, [startAmpPolling]);

  // ── Stop Audio ─────────────────────────────────────────────────────────────
  const ttsAbortControllerRef = useRef<AbortController | null>(null);

  const stopAudio = useCallback(() => {
    if (ttsAbortControllerRef.current) {
      ttsAbortControllerRef.current.abort();
      ttsAbortControllerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
  }, []);

  // ── Speak (ElevenLabs) ─────────────────────────────────────────────────────
  const startListening = useCallback(() => { /* defined below */ }, []);
  const startListeningRef = useRef(startListening);

  const speak = useCallback(async (text: string) => {
    stopAudio(); // Prevent overlapping voices
    setVoiceState("speaking");
    setLastAIText(text);
    
    ttsAbortControllerRef.current = new AbortController();
    
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text, voiceId: selectedVoiceRef.current.id }),
        signal: ttsAbortControllerRef.current.signal,
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        // Only transition to idle and auto-listen if we are still in "speaking" state
        setVoiceState((prev) => {
          if (prev === "speaking") {
            setTimeout(() => startListeningRef.current(), 400);
            return "idle";
          }
          return prev;
        });
      };
      audio.onerror = () => { URL.revokeObjectURL(url); setVoiceState("idle"); };
      await audio.play();
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setVoiceState("idle");
      }
    }
  }, [stopAudio]);

  // ── Get AI Response ────────────────────────────────────────────────────────
  const getAIResponse = useCallback(async (userText: string) => {
    setVoiceState("processing");
    setLastUserText(userText);
    setLiveTranscript("");
    try {
      const token = localStorage.getItem("token") || "";
      const res   = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/career/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: userText }),
      });
      const data  = await res.json();
      const reply = data.reply || "Could you repeat that? I didn't quite catch it.";
      onExchangeComplete(userText, reply);
      await speak(reply);
    } catch {
      setVoiceState("idle");
    }
  }, [chatHistory, speak, onExchangeComplete]);

  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestTranscriptRef = useRef<string>("");

  const startListeningImpl = useCallback(() => {
    stopAudio(); // Interrupt AI if user starts listening manually
    if (isListeningRef.current) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setError("Speech recognition is not supported in this browser (use Chrome/Edge)."); return; }

    const rec = new SR();
    // Use continuous mode so it doesn't shut off instantly on short pauses
    rec.continuous      = true;
    rec.interimResults  = true;
    rec.lang            = "en-US";
    rec.maxAlternatives = 1;

    const resetSilenceTimer = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (isListeningRef.current) {
          isListeningRef.current = false;
          if (recognitionRef.current) recognitionRef.current.abort(); // Hard abort
          
          const textToSend = latestTranscriptRef.current.trim();
          if (textToSend.length > 0) {
            getAIResponse(textToSend);
          } else {
            setVoiceState("idle");
          }
        }
      }, 4000);
    };

    rec.onstart = () => { 
      isListeningRef.current = true; 
      latestTranscriptRef.current = "";
      setVoiceState("listening"); 
      setLiveTranscript(""); 
      resetSilenceTimer();
    };
    
    rec.onresult = (e: any) => {
      resetSilenceTimer();
      let fullTranscript = "";
      for (let i = 0; i < e.results.length; i++) {
        fullTranscript += e.results[i][0].transcript;
      }
      latestTranscriptRef.current = fullTranscript;
      setLiveTranscript(fullTranscript);
    };
    
    rec.onend = () => {
      // If browser kills recognizer automatically (e.g. 15s max silence, or network error)
      if (isListeningRef.current) {
        isListeningRef.current = false;
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        
        const textToSend = latestTranscriptRef.current.trim();
        if (textToSend.length > 0) {
          getAIResponse(textToSend);
        } else {
          setVoiceState("idle");
        }
      }
    };
    
    rec.onerror = (e: any) => { 
      // Ignore no-speech errors in continuous mode as we manage silence manually
      if (e.error === 'no-speech') return; 
      isListeningRef.current = false; 
      setVoiceState("idle"); 
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
    
    rec.onnomatch = () => { 
      isListeningRef.current = false; 
      setVoiceState("idle"); 
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    recognitionRef.current = rec;
    rec.start();
  }, [getAIResponse, stopAudio]);

  // Keep ref updated so speak's onended closure always has current fn
  useEffect(() => { startListeningRef.current = startListeningImpl; }, [startListeningImpl]);

  // ── Init & Cleanup ─────────────────────────────────────────────────────────
  useEffect(() => {
    setupMic().then(() => {
      speak("Hello! I'm Alex, your AI Career Counselor. I'm here to help you navigate your career journey. What would you like to work on today?");
    });
    return () => {
      recognitionRef.current?.stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
      audioCtxRef.current?.close();
      audioRef.current?.pause();
      cancelAnimationFrame(ampRafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── State-derived UI ───────────────────────────────────────────────────────
  const glowRGB: Record<VoiceState, string> = {
    idle:       "148 163 184",
    listening:  "34 197 94",
    processing: "168 85 247",
    speaking:   "56 189 248",
  };

  const statusLabel: Record<VoiceState, string> = {
    idle:       "Tap mic to speak",
    listening:  "Listening…",
    processing: "Thinking…",
    speaking:   "Speaking…",
  };

  const glow = glowRGB[voiceState];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-black/60 backdrop-blur-[40px] supports-[backdrop-filter]:bg-black/40"
    >
      {/* ── Ambient radial glow ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: voiceState === "speaking" ? 1 : 0.6 }}
        transition={{ duration: 0.8 }}
        style={{ background: `radial-gradient(ellipse 55% 50% at 50% 55%, rgba(${glow}, 0.14) 0%, transparent 70%)` }}
      />

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5">
        {/* Status dot */}
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: voiceState === "listening" ? "#22c55e" : voiceState === "speaking" ? "#38bdf8" : "#94a3b8" }}
            animate={{ scale: voiceState !== "idle" ? [1, 1.5, 1] : 1 }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-white/60 text-xs font-medium tracking-widest uppercase">
            Voice Mode
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Voice selector */}
          <div className="relative">
            <button
              onClick={() => setShowVoiceMenu(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 text-xs font-medium transition-all"
            >
              <Volume2 className="w-3 h-3" />
              {selectedVoice.name}
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {showVoiceMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden shadow-2xl z-10"
                  style={{ background: "rgba(10,15,30,0.92)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="px-3 pt-3 pb-1">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Select Voice</p>
                  </div>
                  {VOICES.map(v => (
                    <button
                      key={v.id}
                      onClick={() => { setSelectedVoice(v); setShowVoiceMenu(false); }}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 hover:bg-white/8 transition-all text-left group"
                    >
                      <div>
                        <p className="text-white text-xs font-semibold group-hover:text-primary transition-colors">{v.name}</p>
                        <p className="text-white/40 text-[10px] mt-0.5">{v.description}</p>
                      </div>
                      {selectedVoice.id === v.id && (
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/60 hover:text-white transition-all"
            title="Exit Voice Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Orb + rings ── */}
      <div className="relative flex items-center justify-center select-none">
        {/* Animated rings */}
        {[280, 360, 440].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              border: `1px solid rgba(${glow}, ${0.25 - i * 0.07})`,
            }}
            animate={{
              scale: voiceState === "speaking"
                ? [1, 1.07 + i * 0.015, 1]
                : voiceState === "listening"
                ? [1, 1.04, 1]
                : [1, 1.015, 1],
              opacity: [0.4 + amplitude * 0.5, 0.8 - i * 0.15, 0.4 + amplitude * 0.5],
            }}
            transition={{ duration: 1.6 + i * 0.35, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
          />
        ))}

        {/* Globe */}
        <motion.div
          className="relative z-10 rounded-full overflow-hidden"
          style={{ boxShadow: `0 0 80px 25px rgba(${glow}, ${0.18 + amplitude * 0.3})` }}
          animate={{ scale: voiceState === "speaking" ? 1.02 + amplitude * 0.06 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <GlobeCanvas voiceState={voiceState} amplitude={amplitude} />
        </motion.div>
      </div>

      {/* ── Status & transcript ── */}
      <div className="mt-8 flex flex-col items-center gap-4 max-w-2xl w-full px-8 text-center max-h-[30vh] overflow-y-auto hide-scrollbar pb-10">
        {/* Status */}
        <motion.div
          key={voiceState}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          {voiceState === "processing" && <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />}
          <span className="text-xs font-bold tracking-widest uppercase text-white/40">
            {statusLabel[voiceState]}
          </span>
        </motion.div>

        {/* Live transcript (user speaking) */}
        <AnimatePresence mode="wait">
          {liveTranscript && (
            <motion.p
              key="live"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-white/80 text-lg font-light leading-relaxed min-h-[2rem]"
            >
              {liveTranscript}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Last user utterance */}
        {!liveTranscript && lastUserText && voiceState !== "listening" && (
          <p className="text-white/40 text-sm italic">"{lastUserText}"</p>
        )}

        {/* AI response text (speaking) */}
        <AnimatePresence>
          {voiceState === "speaking" && lastAIText && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-white/80 text-sm leading-relaxed text-left w-full [&_h2]:!text-white/90 [&_h3]:!text-white/90 [&_p]:!text-white/80 [&_ul]:!text-white/80 [&_ol]:!text-white/80 [&_li]:!text-white/80"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
            >
              <RenderMarkdown text={lastAIText} />
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="text-red-400/80 text-xs bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">
            {error}
          </p>
        )}
      </div>

      {/* ── Bottom controls ── */}
      <div className="absolute bottom-10 flex items-center gap-6">
        {/* Mic button */}
        <motion.button
          onClick={() => {
            if (voiceState === "listening") {
              recognitionRef.current?.stop();
              setVoiceState("idle");
              isListeningRef.current = false;
            } else if (voiceState === "idle" || voiceState === "speaking") {
              startListeningImpl();
            }
          }}
          disabled={voiceState === "processing"}
          whileTap={{ scale: 0.92 }}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
            voiceState === "listening"
              ? "bg-red-500 shadow-red-500/40"
              : "bg-white/15 hover:bg-white/25 border border-white/20"
          }`}
          style={voiceState === "listening" ? { boxShadow: "0 0 30px 8px rgba(239,68,68,0.35)" } : {}}
        >
          {voiceState === "listening"
            ? <MicOff className="w-6 h-6 text-white" />
            : <Mic    className="w-6 h-6 text-white" />
          }
        </motion.button>

        {/* End session */}
        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.92 }}
          className="w-12 h-12 rounded-full bg-red-600/80 hover:bg-red-600 flex items-center justify-center shadow-xl border border-red-500/30 transition-all"
          title="End Voice Session"
        >
          <PhoneOff className="w-5 h-5 text-white" />
        </motion.button>

        {/* Settings shortcut */}
        <motion.button
          onClick={() => setShowVoiceMenu(v => !v)}
          whileTap={{ scale: 0.92 }}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all"
          title="Switch voice"
        >
          <Settings2 className="w-5 h-5 text-white/60" />
        </motion.button>
      </div>
    </motion.div>
  );
}
