"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCachedFetch } from "../../hooks/useCachedFetch";
import {
  CalendarDays,
  Video,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Timer,
  Layers,
  X,
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

const getPlatformBranding = (platform: string) => {
  const p = (platform || "").toLowerCase();
  if (p.includes("teams"))  return { Logo: TeamsLogo, bg: "linear-gradient(135deg, #4f46e5, #7c3aed)", border: "rgba(123,131,235,0.3)", label: "Microsoft Teams" };
  if (p.includes("zoom"))   return { Logo: ZoomLogo,  bg: "linear-gradient(135deg, #2563eb, #0ea5e9)", border: "rgba(45,140,255,0.3)",  label: "Zoom" };
  if (p.includes("meet") || p.includes("google")) return { Logo: MeetLogo, bg: "linear-gradient(135deg, #059669, #0d9488)", border: "rgba(0,137,123,0.3)", label: "Google Meet" };
  return null;
};

interface Interview {
  id: string;
  company: string;
  role: string;
  dateTime: string;
  platform: string;
  link: string;
  notes?: string;
  status?: string;
  targetId?: string;
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

  const urgency: "none" | "low" | "medium" | "high" | "now" =
    diff < 1000 * 60 * 15 ? "now" :
    diff < 1000 * 60 * 60 ? "high" :
    diff < 1000 * 60 * 60 * 6 ? "medium" : "low";

  return { label, urgency };
};

const formatReadableDate = (isoDate: string) => {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
};

// Group interviews by company (for multi-round detection)
const groupByCompany = (interviews: Interview[]) => {
  const groups: Record<string, Interview[]> = {};
  for (const iv of interviews) {
    const key = iv.company.trim().toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(iv);
  }
  // Sort each group by date
  for (const key in groups) {
    const group = groups[key];
    if (group) {
      group.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    }
  }
  return groups;
};

// ── Company Avatar ───────────────────────────────────────────────────────────
const CompanyAvatar = ({ name }: { name: string }) => {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const colors: [string, string][] = [
    ["#6366f1", "#8b5cf6"], ["#0ea5e9", "#6366f1"], ["#10b981", "#0ea5e9"],
    ["#f59e0b", "#ef4444"], ["#ec4899", "#8b5cf6"],
  ];
  const idx = name.charCodeAt(0) % colors.length;
  const pair = colors[idx] ?? ["#6366f1", "#8b5cf6"];
  const [from, to] = pair;
  return (
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base flex-shrink-0 shadow-md"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials}
    </div>
  );
};

// ── Interview Round Row ────────────────────────────────────────────────────────
const RoundRow = ({
  interview, roundNum, isLast,
}: { interview: Interview; roundNum: number; isLast: boolean; tick?: number }) => {
  const { label, urgency } = getCountdown(interview.dateTime);
  const branding = getPlatformBranding(interview.platform);
  const isPast = new Date(interview.dateTime).getTime() < Date.now();

  const urgencyStyles: Record<string, string> = {
    now:    "bg-red-500/15 border-red-400/40 text-red-400",
    high:   "bg-orange-500/15 border-orange-400/40 text-orange-400",
    medium: "bg-amber-500/12 border-amber-400/30 text-amber-400",
    low:    "bg-emerald-500/10 border-emerald-400/30 text-emerald-400",
    none:   "bg-muted border-border text-muted-foreground",
  };

  return (
    <div className="flex gap-3">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 z-10 border-2 ${
          isPast
            ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-400"
            : "bg-primary/20 border-primary/60 text-primary"
        }`}>
          {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : roundNum}
        </div>
        {!isLast && <div className="w-px flex-1 bg-border/60 mt-1 mb-1" />}
      </div>

      {/* Round content */}
      <div className={`flex-1 pb-4 ${isLast ? "pb-0" : ""}`}>
        <div className={`rounded-xl border p-4 transition-all ${
          isPast ? "bg-muted/30 border-border/40 opacity-70" : "bg-card/80 border-border/60 hover:border-primary/30"
        }`}>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Round {roundNum}
                </span>
                {isPast && (
                  <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                    Completed
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-primary" />
                  {formatReadableDate(interview.dateTime)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-primary" />
                  {interview.platform}
                </span>
              </div>
              {interview.notes && (
                <p className="text-xs text-muted-foreground/70 italic mt-2">📝 {interview.notes}</p>
              )}
            </div>

            {/* Join button */}
            {interview.link && !isPast && (
              branding ? (
                <a
                  href={interview.link.startsWith("http") ? interview.link : `https://${interview.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: branding.bg, borderColor: branding.border }}
                  className="flex items-center gap-2 text-white font-bold text-xs px-3 py-2 rounded-xl border hover:brightness-125 transition-all flex-shrink-0"
                >
                  <branding.Logo className="w-4 h-4" />
                  Join on {branding.label}
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              ) : (
                <a
                  href={interview.link.startsWith("http") ? interview.link : `https://${interview.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-primary text-white font-bold text-xs px-3 py-2 rounded-xl hover:bg-primary/90 transition-all flex-shrink-0"
                >
                  Join Interview <ExternalLink className="w-3 h-3" />
                </a>
              )
            )}
          </div>

          {/* Countdown */}
          {label && !isPast && (
            <div className={`mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold tabular-nums w-fit ${urgencyStyles[urgency]}`}>
              <Timer className="w-3.5 h-3.5" />
              {label}
              {(urgency === "now" || urgency === "high") && (
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse ml-1" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Company Interview Card ─────────────────────────────────────────────────────
const CompanyCard = ({
  companyName, interviews, onDelete, tick,
}: {
  companyName: string;
  interviews: Interview[];
  onDelete: (id: string) => void;
  tick: number;
}) => {
  const [expanded, setExpanded] = useState(true);
  const isMultiRound = interviews.length > 1;
  const nextInterview = interviews.find(iv => new Date(iv.dateTime).getTime() > Date.now()) || interviews[0];
  const allCompleted = interviews.every(iv => new Date(iv.dateTime).getTime() < Date.now());

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/20 transition-all shadow-sm"
    >
      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <CompanyAvatar name={companyName} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-foreground text-base">{companyName}</h3>
                {isMultiRound && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                    <Layers className="w-3 h-3" /> {interviews.length} Rounds
                  </span>
                )}
                {allCompleted && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> All Done
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm font-medium mt-0.5">{nextInterview?.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg bg-muted border border-border hover:bg-muted/80 text-muted-foreground transition-all"
            >
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
            <button
              onClick={() => interviews.forEach(iv => onDelete(iv.id))}
              className="p-2 rounded-lg bg-muted border border-border hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-muted-foreground transition-all"
              title="Delete all rounds"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Rounds Timeline */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-border/50">
              <div className="ml-2 mt-3 space-y-0">
                {interviews.map((iv, idx) => (
                  <RoundRow
                    key={iv.id}
                    interview={iv}
                    roundNum={idx + 1}
                    isLast={idx === interviews.length - 1}
                    tick={tick}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Add Modal ─────────────────────────────────────────────────────────────────
const AddModal = ({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) => {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [platform, setPlatform] = useState("Google Meet");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role || !date || !time) return;
    setLoading(true);
    try {
      await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        body: JSON.stringify({ company, role, dateTime: new Date(`${date}T${time}`).toISOString(), platform, link, notes }),
      });
      onAdd();
      onClose();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-card border border-border rounded-3xl overflow-hidden shadow-2xl z-10"
      >
        <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-muted/30">
          <h3 className="text-foreground font-black text-lg flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" /> Schedule Interview
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Company</label>
              <input type="text" required value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google"
                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Role</label>
              <input type="text" required value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Software Engineer"
                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Date</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary/50 dark:[color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Time</label>
              <input type="time" required value={time} onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary/50 dark:[color-scheme:dark]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Platform</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary/50">
                <option>Google Meet</option>
                <option>Microsoft Teams</option>
                <option>Zoom</option>
                <option>Phone Interview</option>
                <option>In Person</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Meeting Link</label>
              <input type="text" value={link} onChange={e => setLink(e.target.value)} placeholder="https://meet.google.com/..."
                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Preparation notes, checklist..."
              className="w-full h-16 px-3 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm resize-none focus:outline-none focus:border-primary/50" />
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-border mt-1">
            <button type="button" onClick={onClose}
              className="bg-muted hover:bg-muted/80 text-muted-foreground font-semibold text-sm px-4 py-2.5 rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-95 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
              {loading ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function InterviewsPage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const { data, loading, refetch } = useCachedFetch<{ interviews: Interview[] }>("/api/interviews", null);
  const interviews = data?.interviews || [];

  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");

  const now = Date.now();
  const upcoming = interviews.filter(iv => new Date(iv.dateTime).getTime() > now);
  const completed = interviews.filter(iv => new Date(iv.dateTime).getTime() <= now);

  // Group by company for multi-round display
  const upcomingGroups = groupByCompany(upcoming);
  const completedGroups = groupByCompany(completed);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/interviews?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      refetch();
    } catch (err) { console.error(err); }
  };

  const currentGroups = activeTab === "upcoming" ? upcomingGroups : completedGroups;

  return (
    <div className="p-6 md:p-8 min-h-screen">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-2xl font-black text-foreground">Interviews</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Track your interview rounds and join sessions with one click.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-gradient-to-r from-primary to-blue-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" /> Schedule Interview
        </button>
      </motion.div>

      {/* ── Stats Strip ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { label: "Total", value: interviews.length, color: "text-foreground" },
          { label: "Upcoming", value: upcoming.length, color: "text-primary" },
          { label: "Completed", value: completed.length, color: "text-emerald-400" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── Tabs ───────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl border border-border mb-6 w-fit">
        {(["upcoming", "completed"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
              activeTab === tab
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "upcoming" ? `Upcoming (${upcoming.length})` : `Completed (${completed.length})`}
          </button>
        ))}
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-card border border-border rounded-2xl animate-pulse" />
            ))}
          </motion.div>
        ) : Object.keys(currentGroups).length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 border border-dashed border-border rounded-2xl"
          >
            <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-bold text-sm">
              {activeTab === "upcoming" ? "No upcoming interviews" : "No completed interviews yet"}
            </p>
            {activeTab === "upcoming" && (
              <p className="text-muted-foreground/60 text-xs mt-1">
                Once a recruiter replies positively, your interview will appear here automatically.
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {Object.entries(currentGroups)
              .filter(([, ivs]) => ivs && ivs.length > 0)
              .map(([key, ivs]) => (
              <CompanyCard
                key={key}
                companyName={ivs[0]?.company ?? key}
                interviews={ivs}
                onDelete={handleDelete}
                tick={tick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={refetch} />}
      </AnimatePresence>
    </div>
  );
}
