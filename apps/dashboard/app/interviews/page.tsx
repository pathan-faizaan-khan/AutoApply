"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Video,
  Plus,
  Bell,
  Mail,
  MessageSquare,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search,
  CheckCircle2,
  Timer,
  Monitor,
} from "lucide-react";

// ── Platform SVG Logos ──────────────────────────────────────────────
const TeamsLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="white">
    <path d="M16.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" opacity="0.85" />
    <path d="M19.5 8h-4.5a.5.5 0 0 0-.5.5v6a2.5 2.5 0 0 0 5 0V8.5a.5.5 0 0 0-.5-.5z" opacity="0.85" />
    <path d="M11 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    <path d="M15.5 8h-9a.5.5 0 0 0-.5.5v7a4 4 0 0 0 8 0v-3h1.5a.5.5 0 0 0 .5-.5V8.5a.5.5 0 0 0-.5-.5z" />
    <rect x="7" y="10" width="6" height="5" rx=".5" fill="#4f46e5" opacity=".9" />
  </svg>
);

const ZoomLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="white">
    <rect x="2" y="5" width="20" height="14" rx="4" opacity="0.15" />
    <path d="M6 9.5v5a1 1 0 0 0 1 1h5.5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" />
    <path d="M14.5 10.7l3.2-1.8a.5.5 0 0 1 .8.45v5.3a.5.5 0 0 1-.8.45l-3.2-1.8v-2.6z" />
  </svg>
);

const MeetLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="white">
    <path d="M12 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" opacity="0.85" />
    <path d="M14 9.5l4.3-2.6a.7.7 0 0 1 1.1.6v9a.7.7 0 0 1-1.1.6L14 14.5V9.5z" />
    <path d="M7 10v4" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 9v6" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 10.5v3" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SkypeLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="white">
    <circle cx="12" cy="12" r="9" opacity="0.85" />
    <text x="12" y="15.5" textAnchor="middle" fill="#0ea5e9" fontSize="10" fontWeight="bold" fontFamily="sans-serif">S</text>
  </svg>
);

// Helper: get the right SVG logo + colors for a platform name
const getPlatformBranding = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("teams")) return { Logo: TeamsLogo, color: "#ffffff", bg: "linear-gradient(135deg, #4f46e5, #7c3aed)", border: "rgba(123,131,235,0.3)", label: "Microsoft Teams" };
  if (p.includes("zoom"))  return { Logo: ZoomLogo,  color: "#ffffff", bg: "linear-gradient(135deg, #2563eb, #0ea5e9)", border: "rgba(45,140,255,0.3)",  label: "Zoom" };
  if (p.includes("meet") || p.includes("google"))  return { Logo: MeetLogo,  color: "#ffffff", bg: "linear-gradient(135deg, #059669, #0d9488)", border: "rgba(0,137,123,0.3)",  label: "Google Meet" };
  if (p.includes("skype")) return { Logo: SkypeLogo, color: "#ffffff", bg: "linear-gradient(135deg, #0ea5e9, #0284c7)", border: "rgba(0,175,240,0.3)",  label: "Skype" };
  return null;
};

interface Interview {
  id: string;
  company: string;
  role: string;
  dateTime: string; // ISO date string for countdown
  displayDateTime?: string; // human-readable fallback
  platform: string;
  link: string;
  notes?: string;
  logoType?: "microsoft" | "google" | "default";
}

// ── Countdown helper ──────────────────────────────────────────────────
const getCountdown = (isoDate: string) => {
  const target = new Date(isoDate).getTime();
  const now = Date.now();
  const diff = target - now;

  if (isNaN(target)) return { label: "", urgency: "none" as const };
  if (diff <= 0) return { label: "Starting now!", urgency: "now" as const };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  let label = "Starts in ";
  if (days > 0) label += `${days}d `;
  if (hours > 0 || days > 0) label += `${hours}h `;
  label += `${minutes}m ${seconds}s`;

  let urgency: "none" | "low" | "medium" | "high" | "now" = "low";
  if (diff < 1000 * 60 * 15) urgency = "now";        // < 15 min
  else if (diff < 1000 * 60 * 60) urgency = "high";   // < 1 hour
  else if (diff < 1000 * 60 * 60 * 6) urgency = "medium"; // < 6 hours

  return { label, urgency };
};

// Helper to format ISO date into a pretty readable string
const formatReadableDate = (isoDate: string) => {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Generate sample dates relative to right now
const tomorrow10AM = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
};
const in3Days230PM = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  d.setHours(14, 30, 0, 0);
  return d.toISOString();
};

export default function InterviewsPage() {
  // Live tick — updates every second for the countdown
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: "1",
      company: "Microsoft",
      role: "Software Engineer Interview",
      dateTime: tomorrow10AM(),
      platform: "Microsoft Teams",
      link: "https://teams.microsoft.com",
      notes: "Focus on System Design and Coding principles.",
      logoType: "microsoft",
    },
    {
      id: "2",
      company: "Google",
      role: "Frontend Developer Interview",
      dateTime: in3Days230PM(),
      platform: "Google Meet",
      link: "https://meet.google.com",
      notes: "Prepare for JavaScript performance and React questions.",
      logoType: "google",
    },
  ]);

  // Notifications State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [platform, setPlatform] = useState("Microsoft Teams");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role || !date || !time) return;

    // Combine the date + time inputs into an ISO string
    const isoDateTime = new Date(`${date}T${time}`).toISOString();
    let logoType: "microsoft" | "google" | "default" = "default";
    if (company.toLowerCase().includes("microsoft")) logoType = "microsoft";
    else if (company.toLowerCase().includes("google")) logoType = "google";

    const newInterview: Interview = {
      id: Date.now().toString(),
      company,
      role,
      dateTime: isoDateTime,
      platform,
      link: link || "https://google.com",
      notes,
      logoType,
    };

    setInterviews([newInterview, ...interviews]);
    setShowAddModal(false);
    
    // Reset Form
    setCompany("");
    setRole("");
    setDate("");
    setTime("");
    setLink("");
    setNotes("");
  };

  const handleDelete = (id: string) => {
    setInterviews(interviews.filter((item) => item.id !== id));
  };

  // Helper to render company logo
  const renderLogo = (type?: "microsoft" | "google" | "default", companyName?: string) => {
    if (type === "microsoft") {
      return (
        <div className="grid grid-cols-2 gap-0.5 w-10 h-10 p-2 bg-slate-900 border border-slate-800 rounded-xl flex-shrink-0">
          <div className="bg-[#f25022] w-2.5 h-2.5" />
          <div className="bg-[#7fba00] w-2.5 h-2.5" />
          <div className="bg-[#00a4ef] w-2.5 h-2.5" />
          <div className="bg-[#ffb900] w-2.5 h-2.5" />
        </div>
      );
    }
    if (type === "google") {
      return (
        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-white text-base bg-gradient-to-tr from-red-500 via-yellow-500 to-blue-500 flex-shrink-0">
          G
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 flex items-center justify-center font-bold text-violet-400 text-base flex-shrink-0">
        {companyName ? companyName.charAt(0).toUpperCase() : "I"}
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-5 h-5 text-violet-400" />
            <h1 className="text-2xl font-bold text-white">Interview Schedule & Notifications</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Keep track of your active job application interviews, details, links, and reminders.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-violet-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" /> Schedule Interview
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 w-full">
        {/* Left Column: Upcoming Interviews */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" /> Upcoming Interviews
            </h2>

            <AnimatePresence mode="wait">
              {interviews.length > 0 ? (
                <div className="space-y-4">
                  {interviews.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="bg-[#0e1424]/90 border border-slate-800/60 hover:border-violet-500/30 rounded-2xl p-5 flex flex-col gap-4 transition-all"
                    >
                      {/* Top: Logo + Company Info + Delete */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3.5">
                          {renderLogo(item.logoType, item.company)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                Upcoming Interview
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            </div>
                            <h3 className="text-white font-bold text-base leading-tight mt-0.5">
                              {item.company}
                            </h3>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/40 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-slate-500 transition-all flex-shrink-0"
                          title="Delete Interview"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Middle: Role + Details */}
                      <div className="space-y-2">
                        <p className="text-slate-300 font-semibold text-sm">
                          {item.role}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-violet-400" />
                            {item.displayDateTime || formatReadableDate(item.dateTime)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5 text-violet-400" />
                            {item.platform}
                          </span>
                        </div>

                        {item.notes && (
                          <p className="text-slate-500 text-xs italic leading-relaxed">
                            📝 {item.notes}
                          </p>
                        )}
                      </div>

                      {/* Countdown Timer */}
                      {(() => {
                        const { label, urgency } = getCountdown(item.dateTime);
                        if (!label) return null;
                        const urgencyStyles = {
                          now:    "bg-red-500/15 border-red-500/30 text-red-400",
                          high:   "bg-orange-500/15 border-orange-500/30 text-orange-400",
                          medium: "bg-amber-500/12 border-amber-500/25 text-amber-400",
                          low:    "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
                          none:   "bg-slate-800/50 border-slate-700/40 text-slate-400",
                        };
                        return (
                          <div
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold tabular-nums ${urgencyStyles[urgency]}`}
                          >
                            <Timer className="w-3.5 h-3.5" />
                            {label}
                            {(urgency === "now" || urgency === "high") && (
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            )}
                          </div>
                        );
                      })()}

                      {/* Bottom: Join Button (full width) */}
                      <div className="border-t border-slate-800/40 pt-3 mt-auto">
                        {(() => {
                          const branding = getPlatformBranding(item.platform);
                          if (branding) {
                            const { Logo, color, bg, border: brBorder } = branding;
                            return (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ background: bg, borderColor: brBorder, color }}
                                className="w-full text-center font-bold text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2.5 transition-all border hover:brightness-125 hover:scale-[1.01] active:scale-[0.98]"
                              >
                                <Logo className="w-5 h-5" />
                                Join on {branding.label}
                                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                              </a>
                            );
                          }
                          return (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full text-center bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-600/15"
                            >
                              Join Interview <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          );
                        })()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 border border-dashed border-slate-800 rounded-xl"
                >
                  <CalendarDays className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <p className="text-slate-400 font-semibold text-sm">No interviews scheduled yet</p>
                  <p className="text-slate-600 text-xs mt-1">Use the "Schedule Interview" button to get started.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Remaining 3 Boxes */}
        <div className="space-y-6">
          {/* Box 2: Notifications & Reminders */}
          <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Bell className="w-4 h-4 text-violet-400" /> Notifications & Reminders
            </h2>

            <div className="space-y-4">
              {/* Alert Toggle 1 */}
              <div className="flex justify-between items-center p-3.5 bg-slate-950/40 border border-slate-800/40 rounded-xl">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Email Reminders</h4>
                    <p className="text-[11px] text-slate-500">Send invite confirmations & briefs</p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                    emailAlerts ? "bg-violet-600" : "bg-slate-800"
                  }`}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full bg-white transition-all absolute ${
                      emailAlerts ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Alert Toggle 2 */}
              <div className="flex justify-between items-center p-3.5 bg-slate-950/40 border border-slate-800/40 rounded-xl">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Push Notifications</h4>
                    <p className="text-[11px] text-slate-500">Reminders 15 minutes before call</p>
                  </div>
                </div>
                <button
                  onClick={() => setPushAlerts(!pushAlerts)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                    pushAlerts ? "bg-violet-600" : "bg-slate-800"
                  }`}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full bg-white transition-all absolute ${
                      pushAlerts ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Alert Toggle 3 */}
              <div className="flex justify-between items-center p-3.5 bg-slate-950/40 border border-slate-800/40 rounded-xl">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">SMS Notifications</h4>
                    <p className="text-[11px] text-slate-500">Receive schedule text reminders</p>
                  </div>
                </div>
                <button
                  onClick={() => setSmsAlerts(!smsAlerts)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                    smsAlerts ? "bg-violet-600" : "bg-slate-800"
                  }`}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full bg-white transition-all absolute ${
                      smsAlerts ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-5 text-center leading-relaxed">
              💡 You will receive reminders, alerts and interview schedule. We sync with your calendar settings automatically.
            </p>
          </div>

          {/* ── Join Interview Platforms Widget ── */}
          <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-violet-400" /> Join Interview Platforms
            </h2>

            <div className="space-y-2.5">
              {/* Microsoft Teams */}
              <a
                href="https://teams.microsoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-800/50 bg-slate-950/30 hover:bg-[rgba(123,131,235,0.08)] hover:border-[rgba(123,131,235,0.3)] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-[rgba(123,131,235,0.12)] border border-[rgba(123,131,235,0.2)] flex items-center justify-center flex-shrink-0">
                  <TeamsLogo className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Join on Microsoft Teams</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 ml-auto transition-colors" />
              </a>

              {/* Zoom */}
              <a
                href="https://zoom.us/join"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-800/50 bg-slate-950/30 hover:bg-[rgba(45,140,255,0.08)] hover:border-[rgba(45,140,255,0.3)] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-[rgba(45,140,255,0.12)] border border-[rgba(45,140,255,0.2)] flex items-center justify-center flex-shrink-0">
                  <ZoomLogo className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Join on Zoom</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 ml-auto transition-colors" />
              </a>

              {/* Google Meet */}
              <a
                href="https://meet.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-800/50 bg-slate-950/30 hover:bg-[rgba(0,137,123,0.08)] hover:border-[rgba(0,137,123,0.3)] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-[rgba(0,137,123,0.12)] border border-[rgba(0,137,123,0.2)] flex items-center justify-center flex-shrink-0">
                  <MeetLogo className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Join on Google Meet</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 ml-auto transition-colors" />
              </a>
            </div>

            <p className="text-[11px] text-slate-500 mt-4 text-center leading-relaxed">
              Click &quot;Join Interview&quot; on any card and the app opens the respective platform.
            </p>
          </div>

          {/* Quick Stats/Tips */}
          <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" /> Interview Preparation
            </h2>
            
            <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
              <div className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Test your mic, camera, and internet connection beforehand.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Reread the Job Description and match key skills with your experiences.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Keep a digital copy of your parsed resume open to refer back to.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Interview Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setShowAddModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-[#0e1424] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800/80 flex justify-between items-center bg-slate-950/20">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-violet-400" /> Schedule New Interview
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddInterview} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Microsoft"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/50 border border-slate-700/60 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-1.5">
                    Role / Job Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/50 border border-slate-700/60 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/50 border border-slate-700/60 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-1.5">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/50 border border-slate-700/60 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-1.5">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/50 border border-slate-700/60 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50 appearance-none"
                  >
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Skype">Skype</option>
                    <option value="Phone Interview">Phone Interview</option>
                    <option value="In Person">In Person</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-1.5">
                    Interview URL Link
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://teams.microsoft.com/..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/50 border border-slate-700/60 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-1.5">
                  Preps & Notes
                </label>
                <textarea
                  placeholder="Keep reference links, checklist, or preparation plans here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-20 px-3 py-2.5 bg-slate-950/50 border border-slate-700/60 rounded-xl text-white text-sm resize-none focus:outline-none focus:border-violet-500/50"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-3 border-t border-slate-800/80 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-600/20"
                >
                  Schedule
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
