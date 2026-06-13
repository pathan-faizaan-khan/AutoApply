"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Download, 
  FileText, 
  AlertCircle, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

import MatchAnalysis from "../resume/components/MatchAnalysis";
import AtsCheck from "../resume/components/AtsCheck";
import ResumeOptimization from "../resume/components/ResumeOptimization";
import { ReportTemplate } from "../resume/components/ReportTemplate";
import { OptimizedResumeTemplate } from "../resume/components/OptimizedResumeTemplate";
import { JobDescriptionCard } from "../../components/JobDescriptionCard";

const MOCK_JOBS = [
  {
    id: "job-1",
    title: "Senior React Developer",
    company: "WebFlow Inc.",
    location: "San Francisco, CA (Hybrid)",
    salary: "$145,000 - $175,000",
    matchScore: 96,
    tags: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    description: `Position: Senior React Developer
Company: WebFlow Inc.
Location: San Francisco, CA (Hybrid)
Salary: $145,000 - $175,000

We are looking for a Senior React Developer to join our growing product team. You will lead frontend architecture, build highly-responsive user interfaces, and collaborate closely with designers to ensure a premium user experience.

Requirements:
- 5+ years of software development experience with 3+ years focused on React and TypeScript.
- Deep understanding of Next.js, state management, and modern bundlers (Webpack, Vite).
- Experience with responsive design using Tailwind CSS and CSS modules.
- Excellent communication skills and ability to mentor junior engineers.`
  },
  {
    id: "job-2",
    title: "Full Stack Engineer",
    company: "CloudScale Systems",
    location: "Remote (US/Canada)",
    salary: "$130,000 - $160,000",
    matchScore: 89,
    tags: ["Node.js", "React", "PostgreSQL", "AWS"],
    description: `Position: Full Stack Engineer
Company: CloudScale Systems
Location: Remote (US/Canada)
Salary: $130,000 - $160,000

CloudScale Systems is seeking a Full Stack Engineer to work on our core analytics platform. You will build and optimize scalable REST and GraphQL APIs using Node.js/NestJS, and create beautiful, performant dashboard interfaces in React.

Requirements:
- 4+ years of professional development experience across frontend and backend technologies.
- Proficient in React, Node.js (TypeScript), and PostgreSQL database optimization.
- Familiarity with cloud architecture on AWS (S3, ECS, RDS) and containerization with Docker.
- A strong focus on writing clean, tested, and maintainable code.`
  },
  {
    id: "job-3",
    title: "AI Product Developer",
    company: "Cognitive AI",
    location: "New York, NY (On-site)",
    salary: "$160,000 - $200,000",
    matchScore: 94,
    tags: ["TypeScript", "Next.js", "LLM APIs", "Python"],
    description: `Position: AI Product Developer
Company: Cognitive AI
Location: New York, NY (On-site)
Salary: $160,000 - $200,000

Join us at Cognitive AI to build the future of AI-powered workplace automation. In this role, you will bridge the gap between machine learning models and end-user products, integrating state-of-the-art LLMs into premium Next.js applications.

Requirements:
- 3+ years of experience building high-quality web applications.
- Practical experience working with LLM APIs (OpenAI, Anthropic, Groq) and prompt engineering.
- Solid foundations in TypeScript, React, and server-side rendering with Next.js.
- Passion for designing intuitive user interfaces for AI workflows.`
  }
];

export default function JobAnalysisPage() {
  const router = useRouter();
  // Refs for PDF generation
  const reportRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  // State (similar to resume page)
  const [resumeData, setResumeData] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchData, setMatchData] = useState<any>(null);
  const [atsData, setAtsData] = useState<any>(null);
  const [optData, setOptData] = useState<any>(null);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [isDownloadingResume, setIsDownloadingResume] = useState(false);

  // Restore data from sessionStorage (same logic as resume page)
  useEffect(() => {
    try {
      const storedResume = sessionStorage.getItem("resumeData");
      const storedJD = sessionStorage.getItem("jobDescription");
      const storedMatch = sessionStorage.getItem("matchData");
      const storedAts = sessionStorage.getItem("atsData");
      const storedOpt = sessionStorage.getItem("optData");

      if (storedResume) setResumeData(JSON.parse(storedResume));
      if (storedJD) {
        setJobDescription(storedJD);
        // Match selectedJobId if description corresponds to a mock job
        const matchedJob = MOCK_JOBS.find(j => j.description === storedJD);
        if (matchedJob) {
          setSelectedJobId(matchedJob.id);
        }
      }
      if (storedMatch) setMatchData(JSON.parse(storedMatch));
      if (storedAts) setAtsData(JSON.parse(storedAts));
      if (storedOpt) setOptData(JSON.parse(storedOpt));
    } catch (e) {
      console.error("Error restoring sessionStorage states:", e);
    }
  }, []);

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value);
    const matchedJob = MOCK_JOBS.find(j => j.description === value);
    if (matchedJob) {
      setSelectedJobId(matchedJob.id);
    } else {
      setSelectedJobId(null);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeData) {
      return alert("Please upload your resume first on the Resume page before running the AI analysis.");
    }
    if (!jobDescription.trim()) {
      return alert("Please enter a Job Description");
    }
    setIsAnalyzing(true);
    sessionStorage.setItem("jobDescription", jobDescription);
    try {
      const [matchRes, atsRes, optRes] = await Promise.all([
        fetch("/api/analyze-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeData, jobDescription }),
        }).then((res) => res.json()),
        fetch("/api/check-ats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeData }),
        }).then((res) => res.json()),
        fetch("/api/optimize-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeData, jobDescription }),
        }).then((res) => res.json()),
      ]);

      if (matchRes.result) {
        setMatchData(matchRes.result);
        sessionStorage.setItem("matchData", JSON.stringify(matchRes.result));
      }
      if (atsRes.result) {
        setAtsData(atsRes.result);
        sessionStorage.setItem("atsData", JSON.stringify(atsRes.result));
      }
      if (optRes.result) {
        setOptData(optRes.result);
        sessionStorage.setItem("optData", JSON.stringify(optRes.result));
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      alert("Failed to complete analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReportPDF = async () => {
    if (!reportRef.current) return;
    setIsDownloadingReport(true);

    try {
      const pages = Array.from(reportRef.current.children) as HTMLElement[];
      const pdf = new jsPDF('p', 'mm', 'a4');

      for (let i = 0; i < pages.length; i++) {
        const pageNode = pages[i];
        if (!pageNode) continue;
        const dataUrl = await toPng(pageNode, { quality: 1, backgroundColor: '#020617', pixelRatio: 2 });
        if (i > 0) pdf.addPage();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
      pdf.save(`${resumeData.name || 'Candidate'}_AI_Analysis_Report.pdf`);
    } catch (error) {
      console.error(error);
      alert('Failed to generate Report PDF: ' + String(error));
    } finally {
      setIsDownloadingReport(false);
    }
  };

  const downloadResumePDF = async () => {
    if (!resumeRef.current) return;
    setIsDownloadingResume(true);

    try {
      const dataUrl = await toPng(resumeRef.current, { quality: 1, backgroundColor: '#ffffff', pixelRatio: 2 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resumeData.name || 'Candidate'}_Optimized_Resume.pdf`);
    } catch (error) {
      console.error(error);
      alert('Failed to generate Resume PDF: ' + String(error));
    } finally {
      setIsDownloadingResume(false);
    }
  };

  return (
    <div className="min-h-full p-6 md:p-8">
      {/* Hidden PDF templates */}
      {matchData && atsData && optData && (
        <ReportTemplate ref={reportRef} matchData={matchData} atsData={atsData} optData={optData} />
      )}
      {optData?.optimizedResume && (
        <OptimizedResumeTemplate ref={resumeRef} resumeData={optData.optimizedResume} />
      )}

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-black text-foreground tracking-tight">Job Analysis</h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-medium">
            Match your resume against job descriptions and get AI-powered insights.
          </p>
        </div>
        <button
          onClick={() => router.push('/resume')}
          className="flex items-center gap-1.5 px-3.5 py-2 glass rounded-xl text-xs font-bold text-foreground border border-border hover:border-primary/30 hover:text-primary transition-all"
        >
          ← Resume
        </button>
      </motion.div>

      <div>
        {/* Missing Resume Warning Banner */}
        {!resumeData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 glass rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-l-4 border-amber-500/60"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">No Resume Uploaded</p>
                <p className="text-xs text-muted-foreground">Upload a resume first to run semantic matching and ATS checks.</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/resume')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-all whitespace-nowrap"
            >
              Upload Resume
            </button>
          </motion.div>
        )}

        {/* Option Selection Banner */}
        <div className="mb-5 glass rounded-2xl p-4 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 shrink-0">
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground mb-0.5">Select a Job Target</p>
            <p className="text-xs text-muted-foreground">Pick a role from the cards below (<strong>Option 2</strong>) or paste your own job description in the text area (<strong>Option 1</strong>).</p>
          </div>
        </div>

        {/* Jobs Dashboard (Option 2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {MOCK_JOBS.map((job) => {
            const isSelected = selectedJobId === job.id;
            return (
              <motion.div
                key={job.id}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`cursor-pointer glass rounded-2xl overflow-hidden flex flex-col justify-between relative group transition-all duration-200 ${
                  isSelected ? "ring-2 ring-primary/50" : ""
                }`}
                onClick={() => {
                  setSelectedJobId(job.id);
                  setJobDescription(job.description);
                }}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-indigo-500" />
                )}

                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-xl bg-muted border border-border">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                      job.matchScore >= 90
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    }`}>
                      {job.matchScore}% Match
                    </span>
                  </div>

                  <p className="text-sm font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">{job.title}</p>
                  <p className="text-xs text-muted-foreground font-medium mb-3">{job.company}</p>

                  <div className="space-y-1 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /><span>{job.location}</span></div>
                    <div className="flex items-center gap-1.5"><DollarSign className="w-3 h-3" /><span>{job.salary}</span></div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {job.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-muted border border-border text-muted-foreground text-[10px] rounded-md font-medium">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    className={`w-full py-2 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "glass border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    {isSelected ? (<><CheckCircle2 className="w-3.5 h-3.5" /> Selected</>) : (<>Select Job <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" /></>)}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Job Description Card (reused component) */}
        <JobDescriptionCard
          jobDescription={jobDescription}
          setJobDescription={handleJobDescriptionChange}
          handleAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />

        {/* Result sections – same as in resume page */}
        <AnimatePresence>
          {(matchData || atsData || optData) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {/* Action Buttons */}
              <div className="mb-6 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={downloadReportPDF}
                  disabled={isDownloadingReport}
                  className="flex items-center justify-center gap-2 glass border border-border px-5 py-2.5 rounded-xl text-sm font-bold text-foreground hover:border-primary/30 hover:text-primary transition-all disabled:opacity-50 w-full sm:w-auto"
                >
                  {isDownloadingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isDownloadingReport ? "Generating…" : "Download AI Report"}
                </button>
                <button
                  onClick={downloadResumePDF}
                  disabled={isDownloadingResume}
                  className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 text-green-500 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-500/20 transition-all disabled:opacity-50 w-full sm:w-auto"
                >
                  {isDownloadingResume ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  {isDownloadingResume ? "Generating…" : "Download ATS Resume"}
                </button>
              </div>

              {/* Visual Reports */}
              <div className="space-y-6">
                {matchData && <MatchAnalysis data={matchData} />}
                {atsData && <AtsCheck data={atsData} />}
                {optData && <ResumeOptimization data={optData} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

