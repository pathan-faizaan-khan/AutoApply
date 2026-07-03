"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCachedFetch } from "../hooks/useCachedFetch";
import {
  FileText,
  Briefcase,
  Send,
  Activity,
  ArrowUpRight,
  Mail,
  ExternalLink,
  RefreshCw,
  Clock,
  MapPin,
  ChevronRight,
  Inbox,
  UploadCloud,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: number;
  email: string;
  name: string;
}

interface DashboardStats {
  resumesUploaded: number;
  jobsAvailable: number;
  emailsSent: number;
  emailsDraft: number;
  activeCampaigns: number;
  acceptedProfiles: number;
  repliedSelected: number;
  repliedNotSelected: number;
  repliedNeutral: number;
}

interface RecentJob {
  id: number;
  title: string;
  companyName: string;
  location: string | null;
  jobUrl: string;
  createdAt: string;
}

interface ActivityItem {
  id: number;
  type: "email_sent" | "email_draft";
  company: string;
  contact: string | null;
  subject: string;
  sentAt: string | null;
}

interface ResumeItem {
  key: string;
  fileName: string;
  size: number;
  lastModified: string;
  downloadUrl: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentJobs: RecentJob[];
  recentActivity: ActivityItem[];
  latestResume: ResumeItem | null;
  resumes: ResumeItem[];
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    if (start === end) return;
    const duration = 800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else prevRef.current = end;
    };

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

// ─── Skeleton Block ───────────────────────────────────────────────────────────

function Skel({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  iconClass,
  accent,
  loading,
  delay = 0,
  href,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  sub: string;
  iconClass: string;
  accent: string;
  loading: boolean;
  delay?: number;
  href?: string;
}) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className={`stat-glow glass rounded-2xl p-5 cursor-default relative overflow-hidden transition-all duration-200 ${href ? "cursor-pointer" : ""}`}
    >
      {/* subtle gradient strip */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${accent} opacity-60`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl border ${iconClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        {!loading && (
          <span className="flex items-center gap-0.5 text-[11px] font-bold text-green-500">
            Live <span className="live-dot ml-1" />
          </span>
        )}
      </div>

      {loading ? (
        <>
          <Skel className="h-7 w-20 mb-2" />
          <Skel className="h-3 w-24 mb-1" />
          <Skel className="h-3 w-28" />
        </>
      ) : (
        <>
          <p className="text-3xl font-black text-foreground tabular-nums">
            <AnimatedNumber value={value} />
          </p>
          <p className="text-[11px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">
            {label}
          </p>
          <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>
        </>
      )}
    </motion.div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

// ─── Job Row ──────────────────────────────────────────────────────────────────

function JobRow({ job, delay = 0 }: { job: RecentJob; delay?: number }) {
  const initials = job.companyName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const ago = (() => {
    const diff = Date.now() - new Date(job.createdAt).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return "Today";
    if (d === 1) return "Yesterday";
    return `${d}d ago`;
  })();

  return (
    <motion.a
      href={job.jobUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-muted transition-all duration-150 group cursor-pointer"
    >
      <div className="w-9 h-9 rounded-xl glass border border-border flex items-center justify-center text-[11px] font-black text-foreground shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground truncate">{job.title}</p>
        <p className="text-xs text-muted-foreground truncate font-medium">{job.companyName}</p>
      </div>
      <div className="text-right shrink-0 hidden sm:block">
        {job.location && (
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground justify-end">
            <MapPin className="w-2.5 h-2.5" /> {job.location}
          </p>
        )}
        <p className="text-[11px] text-muted-foreground mt-0.5">{ago}</p>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </motion.a>
  );
}

// ─── Activity Row ─────────────────────────────────────────────────────────────

function ActivityRow({ item, delay = 0 }: { item: ActivityItem; delay?: number }) {
  const timeStr = item.sentAt
    ? new Date(item.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Draft";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="flex items-start gap-3 py-2.5 border-b border-border last:border-0"
    >
      <div
        className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
          item.type === "email_sent"
            ? "bg-green-500/10 text-green-500"
            : "bg-amber-500/10 text-amber-500"
        }`}
      >
        {item.type === "email_sent" ? (
          <Send className="w-3 h-3" />
        ) : (
          <Mail className="w-3 h-3" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{item.subject}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          → {item.company}
          {item.contact ? ` · ${item.contact}` : ""}
        </p>
      </div>
      <span className="text-[11px] text-muted-foreground shrink-0 font-medium">{timeStr}</span>
    </motion.div>
  );
}


function EmptyState({
  icon: Icon,
  title,
  cta,
  href,
}: {
  icon: React.ElementType;
  title: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
      <div className="w-12 h-12 rounded-2xl glass border border-border flex items-center justify-center">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground font-medium">{title}</p>
      <Link
        href={href}
        className="text-xs font-bold text-primary hover:underline underline-offset-2 flex items-center gap-1"
      >
        {cta} <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

// ─── Greeting ─────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardHome() {
  const [user, setUser] = useState<User | null>(null);
  
  const { data, loading, error, refetch, isRefreshing } = useCachedFetch<DashboardData>("/api/dashboard", null);

  const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000";

  // Decode user from JWT
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    let activeToken = urlToken;

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      activeToken = localStorage.getItem("token");
    }

    if (activeToken) {
      try {
        const b64 = activeToken.split(".")[1];
        if (b64) {
          const json = JSON.parse(atob(b64.replace(/-/g, "+").replace(/_/g, "/")));
          setUser({ id: json.userId, email: json.email, name: json.name || "User" });
        }
      } catch {
        setUser({ id: 1, email: "user@example.com", name: "User" });
      }
    } else {
      setUser({ id: 1, email: "demo@example.com", name: "You" });
    }
  }, [landingUrl]);

  // ─── Stats config ────────────────────────────────────────────────────────

  const stats = [
    {
      label: "Resumes Uploaded",
      value: data?.stats.resumesUploaded ?? 0,
      icon: FileText,
      sub: "Stored in your vault",
      iconClass: "bg-primary/10 text-primary border-primary/20",
      accent: "bg-gradient-to-r from-primary to-blue-500",
      href: "/resume",
      delay: 0,
    },
    {
      label: "Jobs Available",
      value: data?.stats.jobsAvailable ?? 0,
      icon: Briefcase,
      sub: "From live job boards",
      iconClass: "bg-sky-500/10 text-sky-500 border-sky-500/20",
      accent: "bg-gradient-to-r from-sky-500 to-cyan-400",
      href: "/jobs",
      delay: 0.07,
    },
    {
      label: "Emails Sent",
      value: data?.stats.emailsSent ?? 0,
      icon: Send,
      sub: `${data?.stats.emailsDraft ?? 0} drafts pending`,
      iconClass: "bg-green-500/10 text-green-500 border-green-500/20",
      accent: "bg-gradient-to-r from-green-500 to-emerald-400",
      href: "/history",
      delay: 0.14,
    },
    {
      label: "Active Campaigns",
      value: data?.stats.activeCampaigns ?? 0,
      icon: TrendingUp,
      sub: "Outreach campaigns running",
      iconClass: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
      accent: "bg-gradient-to-r from-indigo-500 to-blue-600",
      href: "/referrals",
      delay: 0.21,
    },
    {
      label: "Accepted Profiles",
      value: data?.stats.acceptedProfiles ?? 0,
      icon: TrendingUp, // Will use Activity or CheckCircle if imported, TrendingUp is fine.
      sub: "Interviews scheduled",
      iconClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      accent: "bg-gradient-to-r from-emerald-500 to-teal-400",
      href: "/interviews",
      delay: 0.28,
    },
    {
      label: "Selected",
      value: data?.stats.repliedSelected ?? 0,
      icon: TrendingUp,
      sub: "Positive replies received",
      iconClass: "bg-green-500/10 text-green-500 border-green-500/20",
      accent: "bg-gradient-to-r from-green-500 to-emerald-400",
      href: "/history",
      delay: 0.35,
    },
    {
      label: "Not Selected",
      value: data?.stats.repliedNotSelected ?? 0,
      icon: Activity,
      sub: "Negative replies received",
      iconClass: "bg-red-500/10 text-red-500 border-red-500/20",
      accent: "bg-gradient-to-r from-red-500 to-rose-400",
      href: "/history",
      delay: 0.42,
    },
    {
      label: "Replied",
      value: data?.stats.repliedNeutral ?? 0,
      icon: Mail,
      sub: "Neutral replies received",
      iconClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      accent: "bg-gradient-to-r from-blue-500 to-indigo-400",
      href: "/history",
      delay: 0.49,
    },
  ];

  // ─── Skeleton full-page loader ──────────────────────────────────────────

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <p className="text-sm font-semibold text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-5 md:p-7 space-y-6">

      {/* ── Header row ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-xl font-black text-foreground tracking-tight">
            {getGreeting()},{" "}
            <span className="gradient-text">{user.name}</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-medium">
            {loading
              ? "Fetching your latest data…"
              : error
              ? "Some data couldn't be loaded — retrying will help"
              : `${data?.stats.jobsAvailable ?? 0} jobs available · ${data?.stats.emailsSent ?? 0} emails sent`}
          </p>
        </div>

        <button
          onClick={refetch}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-2 glass rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing…" : "Refresh"}
        </button>
      </motion.div>

      {/* ── Stat cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} loading={loading} />
        ))}
      </div>

      {/* ── Bento grid: main content ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* ── Jobs Pipeline (2/3 width) ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="xl:col-span-2 glass rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Jobs Pipeline</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {loading ? "—" : `${data?.recentJobs.length ?? 0} latest scraped positions`}
                </p>
              </div>
              <span className="live-dot ml-1" />
            </div>
            <Link
              href="/jobs"
              className="flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-2"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="px-2 py-2 max-h-[360px] overflow-y-auto space-y-0.5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3.5 px-3 py-3">
                  <Skel className="w-9 h-9 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skel className="h-4 w-2/3" />
                    <Skel className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : data?.recentJobs.length ? (
              data.recentJobs.map((job, i) => (
                <JobRow key={job.id} job={job} delay={0.28 + i * 0.05} />
              ))
            ) : (
              <EmptyState
                icon={Briefcase}
                title="No jobs scraped yet"
                cta="Go to Jobs"
                href="/jobs"
              />
            )}
          </div>
        </motion.div>

        {/* ── Right column ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Resume Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <FileText className="w-3.5 h-3.5 text-primary" />
              </div>
              <h2 className="text-sm font-bold text-foreground">Your Resume</h2>
            </div>

            {loading ? (
              <div className="space-y-2">
                <Skel className="h-4 w-full" />
                <Skel className="h-3 w-3/4" />
                <Skel className="h-8 w-full mt-2" />
              </div>
            ) : data?.latestResume ? (
              <>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground truncate">
                      {data.latestResume.fileName}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {new Date(data.latestResume.lastModified).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {" · "}
                      {(data.latestResume.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={data.latestResume.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/25"
                  >
                    <ExternalLink className="w-3 h-3" /> Open
                  </a>
                  <Link
                    href="/resume"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 glass rounded-xl text-xs font-bold text-foreground border border-border hover:border-primary/30 hover:text-primary transition-all"
                  >
                    <UploadCloud className="w-3 h-3" /> Manage
                  </Link>
                </div>
              </>
            ) : (
              <EmptyState
                icon={UploadCloud}
                title="No resume uploaded yet"
                cta="Upload Resume"
                href="/resume"
              />
            )}
          </motion.div>

          {/* AI Insight Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-md shadow-primary/30">
                <Lightbulb className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                Insight
              </p>
            </div>
            <p className="text-sm text-foreground font-semibold leading-relaxed">
              {data?.stats.emailsSent === 0
                ? "Start an outreach campaign to send personalized cold emails to recruiters."
                : data?.stats.emailsSent && data.stats.emailsSent < 5
                ? <>You've sent <span className="text-primary font-black">{data?.stats.emailsSent}</span> emails. Sending 10+ increases callback rate by <span className="text-primary font-black">3.2×</span>.</>
                : <>Strong pipeline! <span className="text-primary font-black">{data?.stats.emailsSent}</span> emails sent. Keep following up to maximize responses.</>}
            </p>
            <Link
              href="/referrals"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-2"
            >
              Start campaign <ChevronRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Activity Feed ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <Clock className="w-3.5 h-3.5 text-green-500" />
            </div>
            <h2 className="text-sm font-bold text-foreground">Outreach Activity</h2>
          </div>
          <Link
            href="/history"
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-2"
          >
            Full history <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="px-5 py-2">
          {loading ? (
            <div className="space-y-3 py-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skel className="w-7 h-7 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skel className="h-3.5 w-3/4" />
                    <Skel className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.recentActivity.length ? (
            data.recentActivity.map((item, i) => (
              <ActivityRow key={item.id ?? i} item={item} delay={0.42 + i * 0.05} />
            ))
          ) : (
            <EmptyState
              icon={Inbox}
              title="No outreach activity yet"
              cta="Send your first cold email"
              href="/cold-mail"
            />
          )}
        </div>
      </motion.div>

      {/* ── Quick links strip ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: "Upload Resume", icon: UploadCloud, href: "/resume", color: "text-primary" },
          { label: "Browse Jobs", icon: Briefcase, href: "/jobs", color: "text-blue-500" },
          { label: "Send Cold Mail", icon: Mail, href: "/cold-mail", color: "text-green-500" },
          { label: "Mock Interview", icon: Activity, href: "/mock-interviews", color: "text-indigo-500" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="glass rounded-xl p-4 flex flex-col items-center gap-2.5 text-center hover:border-primary/30 hover:-translate-y-1 transition-all duration-200 group"
          >
            <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
            <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
