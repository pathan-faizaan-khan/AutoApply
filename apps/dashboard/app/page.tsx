"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Briefcase,
  Send,
  TrendingUp,
  CheckCircle,
  Plus,
  ArrowUpRight,
  Zap,
  Clock,
  Star,
} from "lucide-react";

interface User {
  id: number;
  email: string;
  name: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  label,
  val,
  icon: Icon,
  sub,
  iconClass,
  delay = 0,
}: {
  label: string;
  val: string;
  icon: React.ElementType;
  sub: string;
  iconClass: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-5 cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl border ${iconClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="flex items-center gap-0.5 text-[11px] font-bold text-green-500">
          +12% <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
      <p className="text-2xl font-black text-foreground">{val}</p>
      <p className="text-[11px] font-semibold text-muted-foreground mt-1 uppercase tracking-widest">{label}</p>
      <p className="text-xs text-muted-foreground mt-2">{sub}</p>
    </motion.div>
  );
}

function ApplicationRow({
  company,
  role,
  date,
  status,
  logo,
  delay = 0,
}: {
  company: string;
  role: string;
  date: string;
  status: "Applied" | "Interviewing" | "Pending" | "Rejected";
  logo: string;
  delay?: number;
}) {
  const statusStyles = {
    Applied: "bg-blue-500/10 text-blue-400 border-blue-500/15",
    Interviewing: "bg-green-500/10 text-green-400 border-green-500/15",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/15",
    Rejected: "bg-red-500/10 text-red-400 border-red-500/15",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-muted transition-all duration-200 group cursor-pointer"
    >
      <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-base font-black text-foreground shrink-0 border border-border">
        {logo}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground truncate">{company}</p>
        <p className="text-xs text-muted-foreground truncate font-medium">{role}</p>
      </div>
      <div className="hidden sm:block text-right">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${statusStyles[status]}`}>
          {status}
        </span>
        <p className="text-[11px] text-muted-foreground mt-1 font-medium">{date}</p>
      </div>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-primary shrink-0 ml-2">
        View →
      </button>
    </motion.div>
  );
}

function ActivityItem({ text, time, delay = 0 }: { text: string; time: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="flex items-start gap-3 py-2.5"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
      <div>
        <p className="text-sm text-foreground font-medium">{text}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{time}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardHome() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000";

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

    if (!activeToken) {
      setUser({ id: 1, email: "alex@example.com", name: "Alex" });
      setLoading(false);
      return;
    }

    try {
      const b64 = activeToken.split(".")[1];
      if (!b64) throw new Error("bad token");
      const json = JSON.parse(atob(b64.replace(/-/g, "+").replace(/_/g, "/")));
      setUser({ id: json.userId, email: json.email, name: json.name || "User" });
    } catch {
      setUser({ id: 1, email: "user@example.com", name: "User" });
    }
    setLoading(false);
  }, [landingUrl]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="w-5 h-5 text-white fill-white animate-pulse" />
          </div>
          <p className="text-sm font-semibold text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Applied",   val: "42",   icon: Briefcase,    sub: "Last 30 days",          iconClass: "bg-violet-500/10 text-violet-500 border-violet-500/20", delay: 0 },
    { label: "Awaiting Reply",  val: "18",   icon: Send,         sub: "Avg. 5 days response",   iconClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",     delay: 0.07 },
    { label: "Interviews",      val: "4",    icon: TrendingUp,   sub: "2 this week",            iconClass: "bg-green-500/10 text-green-500 border-green-500/20",  delay: 0.14 },
    { label: "Success Rate",    val: "98%",  icon: CheckCircle,  sub: "Above industry avg",     iconClass: "bg-purple-500/10 text-purple-500 border-purple-500/20", delay: 0.21 },
  ];

  const applications = [
    { company: "Google", role: "Senior Frontend Engineer", date: "May 15", status: "Applied" as const, logo: "G", delay: 0.3 },
    { company: "Meta", role: "Software Engineer II", date: "May 12", status: "Interviewing" as const, logo: "M", delay: 0.37 },
    { company: "Stripe", role: "Fullstack Developer", date: "May 10", status: "Pending" as const, logo: "S", delay: 0.44 },
    { company: "Linear", role: "Product Engineer", date: "May 8", status: "Interviewing" as const, logo: "L", delay: 0.51 },
    { company: "Vercel", role: "DX Engineer", date: "May 5", status: "Applied" as const, logo: "V", delay: 0.58 },
  ];

  const activity = [
    { text: "Application to Google auto-submitted", time: "2 hours ago", delay: 0.5 },
    { text: "Resume tailored for Meta SWE role", time: "Yesterday", delay: 0.55 },
    { text: "Stripe interview scheduled for Jun 12", time: "2 days ago", delay: 0.6 },
    { text: "Cover letter generated for Linear", time: "3 days ago", delay: 0.65 },
  ];

  return (
    <div className="min-h-full p-6 md:p-8">
      {/* Floating Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <div className="relative max-w-sm group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
          <input
            type="text"
            placeholder="Search jobs, companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 glass rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30 transition-all duration-200"
          />
        </div>
      </motion.div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mb-7"
      >
        <h1 className="text-xl font-black text-foreground tracking-tight">
          Good morning, {user?.name} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5 font-medium">
          4 new job matches since yesterday
        </p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <StatCard key={i} label={s.label} val={s.val} icon={s.icon} sub={s.sub} iconClass={s.iconClass} delay={s.delay} />
        ))}
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Applications Panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="xl:col-span-2 glass rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-bold text-foreground">Active Applications</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">5 tracked positions</p>
            </div>
            <button className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/25">
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
          <div className="px-2 py-2 space-y-0.5 max-h-[340px] overflow-y-auto">
            {applications.map((app, i) => (
              <ApplicationRow key={i} {...app} />
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* AI Tip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-2xl p-5"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center shadow-md shadow-primary/30">
                  <Zap className="w-3.5 h-3.5 text-white fill-white" />
                </div>
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">AI Insight</p>
              </div>
              <p className="text-sm text-foreground font-semibold leading-relaxed">
                Tailor your resume for Meta's SWE role — it increases callback rate by <span className="text-primary font-black">3.2×</span>.
              </p>
              <button className="mt-3 text-xs font-bold text-primary hover:underline underline-offset-2">
                Optimize now →
              </button>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-2xl p-5 flex-1"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-foreground">Recent Activity</h2>
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="divide-y divide-border">
              {activity.map((a, i) => (
                <ActivityItem key={i} {...a} />
              ))}
            </div>
          </motion.div>

          {/* Quick Stat: Saved Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Saved Jobs</p>
                <p className="text-2xl font-black text-foreground">27</p>
                <p className="text-xs text-muted-foreground mt-0.5">Ready to apply</p>
              </div>
              <button className="flex items-center gap-1.5 px-3.5 py-2 glass rounded-xl text-xs font-bold text-foreground border border-border hover:border-primary/30 hover:text-primary transition-all">
                <Star className="w-3.5 h-3.5" />
                View
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
