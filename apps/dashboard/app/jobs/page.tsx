"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Search, RefreshCw, Layers, LayoutGrid, List,
  MapPin, Building2, Globe, Zap, SlidersHorizontal, X,
  TrendingUp, Clock, Users, ExternalLink, Sparkles,
  ChevronRight, Star, Bookmark, ArrowUpRight, CheckCircle,
} from "lucide-react";
import { ScrapedJob } from "./components/JobCard";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GoogleJob {
  title: string;
  company_name: string;
  job_url: string;
  description: string;
  domain: string;
  location: string;
  source: string;
  match_score?: number;
}

type ViewMode = "grid" | "list";
type JobTab = "scraped" | "google";

// ─── Match Score Badge ────────────────────────────────────────────────────────
function MatchBadge({ score }: { score: number }) {
  const config =
    score >= 75
      ? { gradient: "from-emerald-500 to-green-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" }
      : score >= 50
      ? { gradient: "from-amber-500 to-yellow-400", bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" }
      : { gradient: "from-rose-500 to-red-400", bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-700 dark:text-rose-400", border: "border-rose-200 dark:border-rose-800" };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${config.bg} ${config.text} ${config.border}`}>
      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${config.gradient}`} />
      {score}% match
    </div>
  );
}

// ─── Premium Job Card (Grid) ──────────────────────────────────────────────────
function PremiumJobCard({ job, index, isGoogle }: { job: ScrapedJob | GoogleJob; index: number; isGoogle?: boolean }) {
  const gJob = job as GoogleJob;
  const sJob = job as ScrapedJob;
  const title = job.title;
  const company = isGoogle ? gJob.company_name : sJob.companyName;
  const url = isGoogle ? gJob.job_url : sJob.jobUrl;
  const description = isGoogle ? gJob.description : (sJob.description || "");
  const location = isGoogle ? (gJob.location || "Remote") : (sJob.location || "Remote");
  const matchScore = gJob.match_score;
  const appliedPeoples = !isGoogle ? sJob.appliedPeoples : null;
  const initial = company.charAt(0).toUpperCase();

  const palettes = [
    { gradient: "from-violet-600 to-indigo-500", light: "bg-violet-50 dark:bg-violet-950/30", badge: "text-violet-600 dark:text-violet-400", border: "border-violet-100 dark:border-violet-900/50", glow: "group-hover:shadow-violet-500/15" },
    { gradient: "from-blue-600 to-cyan-500", light: "bg-blue-50 dark:bg-blue-950/30", badge: "text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-900/50", glow: "group-hover:shadow-blue-500/15" },
    { gradient: "from-emerald-600 to-teal-500", light: "bg-emerald-50 dark:bg-emerald-950/30", badge: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-900/50", glow: "group-hover:shadow-emerald-500/15" },
    { gradient: "from-rose-600 to-pink-500", light: "bg-rose-50 dark:bg-rose-950/30", badge: "text-rose-600 dark:text-rose-400", border: "border-rose-100 dark:border-rose-900/50", glow: "group-hover:shadow-rose-500/15" },
    { gradient: "from-amber-600 to-orange-500", light: "bg-amber-50 dark:bg-amber-950/30", badge: "text-amber-600 dark:text-amber-400", border: "border-amber-100 dark:border-amber-900/50", glow: "group-hover:shadow-amber-500/15" },
    { gradient: "from-purple-600 to-violet-500", light: "bg-purple-50 dark:bg-purple-950/30", badge: "text-purple-600 dark:text-purple-400", border: "border-purple-100 dark:border-purple-900/50", glow: "group-hover:shadow-purple-500/15" },
  ];
  const p = palettes[index % palettes.length]!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative flex flex-col rounded-2xl bg-card border border-border/60 overflow-hidden hover:border-primary/30 hover:shadow-2xl ${p.glow} transition-all duration-300 cursor-pointer`}
    >
      {/* Top color strip */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${p.gradient} shrink-0`} />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          {/* Company logo placeholder */}
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0`}>
            {initial}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {isGoogle && (
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase tracking-widest">
                Google
              </span>
            )}
            {matchScore !== undefined && <MatchBadge score={matchScore} />}
          </div>
        </div>

        {/* Job info */}
        <div className="flex-1">
          <h3 className="font-bold text-sm text-foreground leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 mb-3">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <p className="text-xs font-semibold text-muted-foreground truncate">{company}</p>
          </div>
          <p className="text-[11px] text-muted-foreground/70 line-clamp-2 leading-relaxed">
            {description || `Join ${company} as a ${title}. Apply today to be part of a growing team.`}
          </p>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg ${p.light} ${p.badge} border ${p.border}`}>
            <MapPin className="w-2.5 h-2.5" /> {location}
          </span>
          {appliedPeoples != null && appliedPeoples > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border/60">
              <Users className="w-2.5 h-2.5" /> {appliedPeoples} applied
            </span>
          )}
        </div>

        {/* CTA */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${p.gradient} hover:opacity-90 active:scale-95 transition-all shadow-md`}
        >
          View & Apply <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

// ─── List Row ─────────────────────────────────────────────────────────────────
function JobListRow({ job, index, isGoogle }: { job: ScrapedJob | GoogleJob; index: number; isGoogle?: boolean }) {
  const gJob = job as GoogleJob;
  const sJob = job as ScrapedJob;
  const company = isGoogle ? gJob.company_name : sJob.companyName;
  const url = isGoogle ? gJob.job_url : sJob.jobUrl;
  const location = isGoogle ? (gJob.location || "Remote") : (sJob.location || "Remote");
  const matchScore = gJob.match_score;
  const description = isGoogle ? gJob.description : (sJob.description || "");

  const palettes = [
    "from-violet-600 to-indigo-500", "from-blue-600 to-cyan-500",
    "from-emerald-600 to-teal-500", "from-rose-600 to-pink-500",
    "from-amber-600 to-orange-500", "from-purple-600 to-violet-500",
  ];
  const gradient = palettes[index % palettes.length]!;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group flex items-center gap-4 p-4 rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-lg transition-all duration-200"
    >
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-base shrink-0 shadow-md`}>
        {company.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{job.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-muted-foreground font-medium truncate">{company}</p>
          <span className="text-muted-foreground/40">·</span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" /> {location}
          </span>
        </div>
        {description && (
          <p className="text-[11px] text-muted-foreground/60 truncate mt-1">{description}</p>
        )}
      </div>

      <div className="hidden md:flex items-center gap-2.5 shrink-0">
        {matchScore !== undefined && <MatchBadge score={matchScore} />}
        {isGoogle && (
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            GOOGLE
          </span>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          Apply <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────
function FilterPanel({
  filters, setFilters, onClose
}: {
  filters: Record<string, string[]>;
  setFilters: (f: Record<string, string[]>) => void;
  onClose: () => void;
}) {
  const toggle = (key: string, val: string) => {
    const current = filters[key] || [];
    setFilters({
      ...filters,
      [key]: current.includes(val) ? current.filter(v => v !== val) : [...current, val],
    });
  };
  const isActive = (key: string, val: string) => (filters[key] || []).includes(val);

  const FilterGroup = ({ label, options, filterKey }: { label: string; options: string[]; filterKey: string }) => (
    <div className="mb-5">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => toggle(filterKey, opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isActive(filterKey, opt)
                ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-56 shrink-0 bg-card border border-border rounded-2xl p-5 sticky top-4 h-fit shadow-lg"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <p className="text-sm font-black text-foreground">Filters</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>
      <FilterGroup label="Work Style" filterKey="workStyle" options={["Remote", "Hybrid", "On-site"]} />
      <FilterGroup label="Company Type" filterKey="companyType" options={["Startup", "Mid-size", "Enterprise", "FAANG"]} />
      <FilterGroup label="Experience" filterKey="experience" options={["Junior", "Mid", "Senior", "Lead"]} />
      <button
        onClick={() => setFilters({})}
        className="w-full mt-1 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 transition-all"
      >
        Clear all filters
      </button>
    </motion.div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-card border border-border/50 overflow-hidden animate-pulse">
      <div className="h-1.5 bg-muted" />
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-muted" />
          <div className="w-20 h-6 rounded-full bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded-lg w-3/4" />
          <div className="h-3 bg-muted rounded-lg w-1/2" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 bg-muted rounded-lg w-full" />
          <div className="h-3 bg-muted rounded-lg w-5/6" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-lg bg-muted" />
        </div>
        <div className="h-10 rounded-xl bg-muted" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function JobsPortalPage() {
  const [scrapedJobs, setScrapedJobs] = useState<ScrapedJob[]>([]);
  const [googleJobs, setGoogleJobs] = useState<GoogleJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [googleQuery, setGoogleQuery] = useState("");
  const [activeTab, setActiveTab] = useState<JobTab>("scraped");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const fetchScrapedJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) setScrapedJobs(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchScrapedJobs(); }, [fetchScrapedJobs]);

  const handleGoogleSearch = async () => {
    if (!googleQuery.trim()) return;
    setGoogleLoading(true);
    try {
      const res = await fetch("/api/jobs/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: googleQuery,
          location: (filters.workStyle || []).join(","),
          company_type: (filters.companyType || [])[0]?.toLowerCase() || "",
          num_results: 10,
        }),
      });
      const data = await res.json();
      setGoogleJobs(data.jobs || []);
      setActiveTab("google");
    } catch (e) {
      console.error(e);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleTriggerScrape = async () => {
    setScraping(true);
    try {
      await fetch("https://autoapply-scraper-backend.onrender.com/api/scrape/run", { method: "POST" });
    } finally {
      setScraping(false);
    }
  };

  const filteredScraped = scrapedJobs.filter(j =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (j.location?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const activeJobs = activeTab === "scraped" ? filteredScraped : googleJobs;
  const totalCount = activeTab === "scraped" ? filteredScraped.length : googleJobs.length;

  return (
    <div className="min-h-full p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-3">
            <Briefcase className="w-3.5 h-3.5" /> Job Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Explore Opportunities
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Auto-scraped + Google-powered jobs matched to your profile
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${showFilters ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30 bg-card"}`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {Object.keys(filters).length > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-white text-primary text-[9px] font-black flex items-center justify-center">
                {Object.values(filters).flat().length}
              </span>
            )}
          </button>
          <button
            onClick={() => setViewMode(v => v === "grid" ? "list" : "grid")}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </button>
          <button onClick={fetchScrapedJobs} className="flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleTriggerScrape}
            disabled={scraping}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold hover:bg-foreground/90 transition-all shadow-lg disabled:opacity-60"
          >
            {scraping ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
            Run Scraper
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/70 rounded-xl w-fit border border-border/60">
        {(["scraped", "google"] as JobTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "scraped" ? (
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-violet-500" /> Scraped Jobs
                {scrapedJobs.length > 0 && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">{scrapedJobs.length}</span>
                )}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-500" /> Google Search
                {googleJobs.length > 0 && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">{googleJobs.length}</span>
                )}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {activeTab === "scraped" ? (
          <div className="relative max-w-2xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by title, company, location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
            />
          </div>
        ) : (
          <div className="flex gap-2 max-w-2xl">
            <div className="relative flex-1 group">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                type="text"
                placeholder="e.g. Senior Frontend Engineer at Google..."
                value={googleQuery}
                onChange={e => setGoogleQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGoogleSearch()}
                className="w-full h-12 pl-11 pr-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            <button
              onClick={handleGoogleSearch}
              disabled={googleLoading}
              className="px-6 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 shrink-0 flex items-center gap-2"
            >
              {googleLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {googleLoading ? "Searching..." : "Search"}
            </button>
          </div>
        )}
      </motion.div>

      {/* Content */}
      <div className="flex gap-5">
        {/* Filter Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />
          )}
        </AnimatePresence>

        {/* Job Grid/List */}
        <div className="flex-1 min-w-0">
          {/* Count + info bar */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-semibold text-muted-foreground">
              <span className="font-black text-foreground">{totalCount}</span> {totalCount === 1 ? "opportunity" : "opportunities"} found
            </p>
            {activeTab === "scraped" && !loading && (
              <p className="text-[11px] text-muted-foreground/60 hidden md:block">Auto-refreshed from scrapers</p>
            )}
          </div>

          {loading && activeTab === "scraped" ? (
            <div className={viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-3"
            }>
              {[...Array(8)].map((_, i) => (
                viewMode === "grid" ? <SkeletonCard key={i} /> : (
                  <div key={i} className="h-20 rounded-2xl bg-muted/50 animate-pulse border border-border/50" />
                )
              ))}
            </div>
          ) : activeJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border/60 rounded-3xl"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5 border border-primary/10">
                <Briefcase className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">No jobs found</h3>
              <p className="text-sm text-muted-foreground max-w-xs text-center">
                {activeTab === "google" ? "Type a role above and hit Search to find Google-powered jobs." : "Run the scraper to populate the job pool, or check back later."}
              </p>
              {activeTab === "scraped" && (
                <button
                  onClick={handleTriggerScrape}
                  disabled={scraping}
                  className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
                >
                  {scraping ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Run Scraper
                </button>
              )}
            </motion.div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeJobs.map((job, i) => (
                <PremiumJobCard key={i} job={job} index={i} isGoogle={activeTab === "google"} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {activeJobs.map((job, i) => (
                <JobListRow key={i} job={job} index={i} isGoogle={activeTab === "google"} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
