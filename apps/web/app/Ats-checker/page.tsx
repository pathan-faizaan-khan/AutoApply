"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BarChart2,
  Download,
  RefreshCw,
  Briefcase,
  Search,
  Shield,
  Sparkles,
  ChevronRight,
  Type,
  Layout,
  Table2,
  Heading,
  Contact,
  ImageOff,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const INDUSTRY_OPTIONS: { value: string; label: string }[] = [
  { value: "software", label: "Software Engineering" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance & Accounting" },
  { value: "design", label: "Design / UI·UX" },
  { value: "product", label: "Product Management" },
  { value: "other", label: "Other" },
];

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  software: ["React", "TypeScript", "Node.js", "AWS", "Docker", "SQL", "Python", "Git", "CI/CD", "REST API"],
  marketing: ["SEO", "Content Strategy", "Social Media", "Email Marketing", "Analytics", "CRM", "Brand"],
  finance: ["Excel", "Forecasting", "Accounting", "Compliance", "Budgeting", "SAP", "Bloomberg"],
  design: ["Figma", "UI/UX", "Illustrator", "Prototyping", "Design Systems", "Sketch"],
  product: ["Roadmap", "User Stories", "Jira", "A/B Testing", "Stakeholder", "OKRs"],
  other: ["Project Management", "Leadership", "Strategy", "Communication", "Agile"],
};

const FORMATTING_CHECKLIST = [
  { id: "layout", title: "Single or Two‑Column Layout", icon: Layout },
  { id: "tables", title: "No Complex Tables", icon: Table2 },
  { id: "headers", title: "Standard Section Headings", icon: Heading },
  { id: "fonts", title: "ATS‑Safe Fonts", icon: Type },
  { id: "contacts", title: "Contact Details Parsed", icon: Contact },
  { id: "graphics", title: "No Graphics or Icons", icon: ImageOff },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const scoreColor = (s: number) =>
  s >= 76 ? "text-emerald-400" : s >= 51 ? "text-amber-400" : "text-red-400";

const scoreGlow = (s: number) =>
  s >= 76
    ? "shadow-emerald-500/20"
    : s >= 51
      ? "shadow-amber-500/20"
      : "shadow-red-500/20";

const scoreBorder = (s: number) =>
  s >= 76
    ? "border-emerald-500/30"
    : s >= 51
      ? "border-amber-500/30"
      : "border-red-500/30";

const scoreRingTrack = (s: number) =>
  s >= 76 ? "stroke-emerald-500" : s >= 51 ? "stroke-amber-500" : "stroke-red-500";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ATSCheckerPage() {
  /* ---------- Input state ---------- */
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [industry, setIndustry] = useState("software");
  const [inputType, setInputType] = useState<"file" | "text">("file");

  /* ---------- UI / analysis state ---------- */
  const [status, setStatus] = useState<"idle" | "analyzing" | "result">("idle");
  const [progress, setProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- Drag & drop ---------- */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };
  const clearFile = () => {
    setFile(null);
    setResumeText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------- Analysis ---------- */
  const canRun =
    (inputType === "file" && !!file) || (inputType === "text" && resumeText.trim().length > 0);

  const runAnalysis = () => {
    if (!canRun) return;
    setStatus("analyzing");
    setProgress(0);
    setAnalysisStep(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.floor(Math.random() * 12) + 4, 100);
        if (next >= 100) {
          clearInterval(interval);
          generateResults();
          return 100;
        }
        const stepThresholds = [20, 40, 60, 80, 100];
        setAnalysisStep(stepThresholds.findIndex((t) => next < t));
        return next;
      });
    }, 180);
  };

  const generateResults = () => {
    const jobWords = jobDescription
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3);
    const industryKw = INDUSTRY_KEYWORDS[industry] || [];
    let targetKeywords = industryKw.filter((k) => jobWords.includes(k.toLowerCase()));
    if (targetKeywords.length < 5) targetKeywords = [...new Set([...targetKeywords, ...industryKw.slice(0, 8)])];

    const found: string[] = [];
    const missing: string[] = [];
    targetKeywords.forEach((kw) => {
      const match =
        inputType === "text" ? resumeText.toLowerCase().includes(kw.toLowerCase()) : Math.random() < 0.6;
      if (match) found.push(kw);
      else missing.push(kw);
    });
    if (found.length === 0 && targetKeywords.length) {
      const half = Math.floor(targetKeywords.length / 2);
      found.push(...targetKeywords.slice(0, half));
      missing.length = 0;
      missing.push(...targetKeywords.slice(half));
    }

    const keywordScore = Math.round((found.length / Math.max(targetKeywords.length, 1)) * 100);
    const formattingScore = 70 + Math.floor(Math.random() * 20);
    const experienceScore = 65 + Math.floor(Math.random() * 25);
    const overall = Math.round(keywordScore * 0.5 + formattingScore * 0.3 + experienceScore * 0.2);

    // Simulate formatting checklist statuses
    const statuses = ["pass", "pass", "warning", "pass", "pass", "fail"] as const;
    const checklist = FORMATTING_CHECKLIST.map((item, i) => ({
      ...item,
      status: statuses[i],
    }));

    let verdict = "Needs Work";
    let verdictDesc = "Your resume needs significant improvements for ATS compatibility.";
    let verdictColor = "red";
    if (overall >= 76) {
      verdict = "Excellent";
      verdictDesc = "Your resume is highly optimized for ATS scanners.";
      verdictColor = "emerald";
    } else if (overall >= 51) {
      verdict = "Average";
      verdictDesc = "Solid foundation — a few tweaks will boost your score.";
      verdictColor = "amber";
    }

    setResult({
      overall,
      keywordScore,
      formattingScore,
      experienceScore,
      found,
      missing,
      verdict,
      verdictDesc,
      verdictColor,
      checklist,
      fileName: file ? file.name : "pasted-resume.txt",
    });
    setStatus("result");
  };

  /* ---------- PDF download ---------- */
  const loadHtml2Pdf = async () => {
    if ((window as any).html2pdf) return (window as any).html2pdf;
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.onload = () => resolve((window as any).html2pdf);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const downloadReport = async () => {
    if (!result) return;
    try {
      const html2pdf = await loadHtml2Pdf();
      const element = document.getElementById("report-dashboard");
      if (!element) return;
      const opt = {
        margin: [0.3, 0.3, 0.3, 0.3],
        filename: `ATS_Report_${result.fileName.replace(/\.[^/.]+$/, "")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#0a0f1e" },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error("PDF generation failed", e);
      alert("Failed to generate PDF — please try again.");
    }
  };

  /* ---------- Score ring SVG ---------- */
  const ScoreRing = ({ score, size = 120 }: { score: number; size?: number }) => {
    const r = (size - 12) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    return (
      <svg width={size} height={size} className="drop-shadow-lg">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={10} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className={scoreRingTrack(score)}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          className={`text-3xl font-extrabold fill-current ${scoreColor(score)}`}
          style={{ fontSize: size * 0.28 }}
        >
          {score}
        </text>
      </svg>
    );
  };

  /* ---------- Small bar for sub-scores ---------- */
  const ScoreBar = ({ label, score, delay = 0 }: { label: string; score: number; delay?: number }) => (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-300 font-medium">{label}</span>
        <span className={`font-bold ${scoreColor(score)}`}>{score}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            score >= 76 ? "bg-emerald-500" : score >= 51 ? "bg-amber-500" : "bg-red-500"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );

  const analysisSteps = ["Uploading…", "Scanning structure…", "Extracting keywords…", "Comparing with ATS…", "Finalizing…"];

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-[#060a14] text-slate-100 flex flex-col items-center px-4 py-14 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-violet-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px]" />
      </div>

      {/* ---- Header ---- */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-5 tracking-wide">
          <Shield className="w-3.5 h-3.5" />
          AI‑POWERED RESUME SCANNER
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
            ATS Compatibility
          </span>{" "}
          Check
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Scan your resume for formatting issues, extract critical keywords, and benchmark
          your match against any job description — all before you hit apply.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* =========================================================== */}
        {/*  IDLE — Input Form                                           */}
        {/* =========================================================== */}
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 w-full max-w-2xl space-y-6"
          >
            {/* Resume input card */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6 shadow-xl shadow-black/20">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" />
                Your Resume
              </h2>

              {/* Toggle tabs */}
              <div className="flex gap-2 mb-5">
                {(["file", "text"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setInputType(t)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      inputType === t
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
                        : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {t === "file" ? "Upload File" : "Paste Text"}
                  </button>
                ))}
              </div>

              {inputType === "file" ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? "border-violet-500 bg-violet-600/10 scale-[1.01]"
                      : file
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : "border-slate-700 bg-slate-950/50 hover:border-violet-500/40 hover:bg-violet-500/5"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.docx,.txt,.rtf"
                  />
                  {file ? (
                    <>
                      <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-3" />
                      <p className="font-semibold text-emerald-300 mb-1">{file.name}</p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024).toFixed(1)} KB •{" "}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearFile();
                          }}
                          className="text-red-400 hover:text-red-300 underline"
                        >
                          Remove
                        </button>
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-12 h-12 mx-auto text-violet-400 mb-3 group-hover:scale-110 transition-transform" />
                      <p className="font-semibold text-slate-200 mb-1">Drag & drop your resume</p>
                      <p className="text-xs text-slate-500">PDF, DOCX, TXT, RTF — up to 10 MB</p>
                    </>
                  )}
                </div>
              ) : (
                <textarea
                  placeholder="Paste your resume content here…"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full h-44 p-4 bg-slate-950/60 rounded-xl border border-slate-700/60 text-slate-100 placeholder:text-slate-600 resize-none focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              )}
            </div>

            {/* Job Description + Industry card */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6 shadow-xl shadow-black/20">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-violet-400" />
                Target Role
              </h2>

              <div className="space-y-4">
                {/* Industry selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-950/60 border border-slate-700/60 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-violet-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {INDUSTRY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Job Description <span className="text-slate-600">(optional — improves accuracy)</span>
                  </label>
                  <textarea
                    placeholder="Paste the job posting here for keyword‑level matching…"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full h-28 p-4 bg-slate-950/60 rounded-xl border border-slate-700/60 text-slate-100 placeholder:text-slate-600 resize-none focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Run button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={runAnalysis}
              disabled={!canRun}
              className={`w-full py-4 rounded-xl font-bold text-base tracking-wide flex items-center justify-center gap-3 transition-all duration-300 ${
                canRun
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/25 text-white"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Search className="w-5 h-5" />
              Run ATS Analysis
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {/* =========================================================== */}
        {/*  ANALYZING                                                    */}
        {/* =========================================================== */}
        {status === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-md text-center py-16"
          >
            {/* Pulsing icon */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-600/30">
                <BarChart2 className="w-10 h-10 text-white" />
              </div>
            </div>

            <motion.p
              key={analysisStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-semibold text-slate-200 mb-6"
            >
              {analysisSteps[analysisStep] ?? "Processing…"}
            </motion.p>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mx-auto mb-3">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">{progress}% complete</p>
          </motion.div>
        )}

        {/* =========================================================== */}
        {/*  RESULT — Dashboard                                          */}
        {/* =========================================================== */}
        {status === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-4xl space-y-6"
          >
            <div id="report-dashboard" className="space-y-6">
              {/* ---- Overall Score Card ---- */}
              <div
                className={`bg-slate-900/60 backdrop-blur-xl border ${scoreBorder(result.overall)} rounded-2xl p-8 shadow-2xl ${scoreGlow(result.overall)} flex flex-col sm:flex-row items-center gap-8`}
              >
                <ScoreRing score={result.overall} size={140} />
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Overall ATS Score</p>
                  <h2 className="text-3xl font-extrabold text-slate-100 mb-2">{result.overall}/100</h2>
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${
                      result.verdictColor === "emerald"
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                        : result.verdictColor === "amber"
                          ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                          : "text-red-400 bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    {result.verdict}
                  </span>
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">{result.verdictDesc}</p>
                </div>
              </div>

              {/* ---- Sub-scores ---- */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Keyword Match", score: result.keywordScore, icon: Search },
                  { label: "Formatting", score: result.formattingScore, icon: Layout },
                  { label: "Experience Depth", score: result.experienceScore, icon: Briefcase },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className="bg-slate-900/50 backdrop-blur border border-slate-800/50 rounded-xl p-5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <item.icon className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                    </div>
                    <ScoreBar label="" score={item.score} delay={i * 0.15} />
                  </div>
                ))}
              </div>

              {/* ---- Keyword Match Detail ---- */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Found */}
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800/50 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Keywords Found ({result.found.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.found.map((kw: string) => (
                      <span
                        key={kw}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      >
                        {kw}
                      </span>
                    ))}
                    {result.found.length === 0 && <p className="text-xs text-slate-500">None detected</p>}
                  </div>
                </div>

                {/* Missing */}
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800/50 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Keywords Missing ({result.missing.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missing.map((kw: string) => (
                      <span
                        key={kw}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20"
                      >
                        {kw}
                      </span>
                    ))}
                    {result.missing.length === 0 && <p className="text-xs text-slate-500">All keywords matched!</p>}
                  </div>
                </div>
              </div>

              {/* ---- Formatting Checklist ---- */}
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800/50 rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-violet-400" />
                  Formatting Audit
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {result.checklist.map((item: any) => {
                    const Icon = FORMATTING_CHECKLIST.find((c) => c.id === item.id)?.icon || FileText;
                    const statusConfig = {
                      pass: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                      warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
                      fail: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
                    }[item.status as "pass" | "warning" | "fail"];
                    const StatusIcon = statusConfig?.icon || CheckCircle2;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 bg-slate-950/40 border border-slate-800/40 rounded-xl px-4 py-3"
                      >
                        <div className={`w-8 h-8 rounded-lg ${statusConfig?.bg} flex items-center justify-center flex-shrink-0`}>
                          <StatusIcon className={`w-4 h-4 ${statusConfig?.color}`} />
                        </div>
                        <span className="text-sm text-slate-300 font-medium">{item.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ---- Pro Tips ---- */}
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800/50 rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  Quick Tips to Improve
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { title: "Mirror the Job Posting", desc: "Use exact keywords from the job description in your resume." },
                    { title: "Use Standard File Formats", desc: "Submit as .docx or .pdf for maximum ATS compatibility." },
                    { title: "Avoid Tabular Layouts", desc: "Stick to single-column layouts — ATS parsers struggle with tables." },
                    { title: "Standardize Headings", desc: "Use common titles like 'Work Experience' and 'Education'." },
                  ].map((tip, i) => (
                    <div key={i} className="flex gap-3 bg-slate-950/40 border border-slate-800/40 rounded-xl p-4">
                      <div className="w-6 h-6 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-400 font-bold text-xs">
                        {i + 1}
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-200 mb-0.5">{tip.title}</h5>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ---- Action buttons ---- */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadReport}
                className="flex-1 py-3.5 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 transition-all"
              >
                <Download className="w-5 h-5" />
                Download PDF Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setStatus("idle");
                  setResult(null);
                  clearFile();
                }}
                className="flex-1 py-3.5 rounded-xl font-bold bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 flex items-center justify-center gap-2 border border-slate-700/50 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Run Another Check
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
