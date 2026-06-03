"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Sparkles, 
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
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-violet-500/30 font-sans pb-24">
      {matchData && atsData && optData && (
        <ReportTemplate ref={reportRef} matchData={matchData} atsData={atsData} optData={optData} />
      )}
      {optData?.optimizedResume && (
        <OptimizedResumeTemplate ref={resumeRef} resumeData={optData.optimizedResume} />
      )}
      
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-violet-600 to-indigo-500 p-2 rounded-xl shadow-lg shadow-violet-500/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ResumePro AI
            </h1>
          </div>
          <button 
            onClick={() => router.push('/resume')} 
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition px-4 py-2.5 rounded-xl text-white font-medium border border-slate-700 text-sm shadow-md"
          >
            ← Upload Resume
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 pt-12">
        {/* Feature headings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center animate-fade-in"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Feature 3 - Find Matching Jobs
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-slate-300">
            Feature 4 - Jobs Dashboard
          </h3>
        </motion.div>

        {/* Missing Resume Warning Banner */}
        {!resumeData && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
                <AlertCircle size={28} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg">No Resume Uploaded</h4>
                <p className="text-slate-400 text-sm">Please upload your resume to run semantic matching and check ATS compatibility.</p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/resume')} 
              className="bg-amber-600 hover:bg-amber-500 transition px-6 py-3 rounded-xl text-white font-bold whitespace-nowrap shadow-lg shadow-amber-900/20 transform hover:-translate-y-0.5 duration-200"
            >
              Upload Resume
            </button>
          </motion.div>
        )}

        {/* Option Selection Banner */}
        <div className="mb-6 bg-slate-900/50 border border-slate-800 rounded-3xl p-5 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 flex-shrink-0">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-white font-semibold text-base mb-0.5">Select Job Target Path</p>
            <p className="text-sm text-slate-400">Choose between <strong>Option 1</strong> (manually typing/pasting your job description in the textarea below) or <strong>Option 2</strong> (clicking any card from the Jobs Dashboard below to auto-fill the card).</p>
          </div>
        </div>

        {/* Jobs Dashboard (Option 2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {MOCK_JOBS.map((job) => {
            const isSelected = selectedJobId === job.id;
            return (
              <motion.div
                key={job.id}
                whileHover={{ y: -4 }}
                className={`cursor-pointer transition-all duration-300 rounded-3xl p-6 bg-slate-900 border flex flex-col justify-between h-full relative overflow-hidden group shadow-lg ${
                  isSelected 
                    ? "border-blue-500 shadow-blue-500/10" 
                    : "border-slate-800 hover:border-slate-700 shadow-slate-950/50"
                }`}
                onClick={() => {
                  setSelectedJobId(job.id);
                  setJobDescription(job.description);
                }}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                )}

                <div>
                  <div className="flex items-start justify-between mb-4">
                    <span className="p-2.5 bg-slate-800/50 rounded-2xl border border-slate-700 text-slate-300 group-hover:bg-slate-800 transition-colors">
                      <Briefcase size={20} />
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      job.matchScore >= 90
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {job.matchScore}% Match
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {job.title}
                  </h4>
                  <p className="text-slate-400 text-sm mb-4 font-medium">{job.company}</p>

                  <div className="space-y-2 text-xs text-slate-500 mb-6">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={14} />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {job.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-800 border border-slate-700/60 text-slate-400 text-[10px] rounded-md font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 size={16} />
                        Selected
                      </>
                    ) : (
                      <>
                        Select Job
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </>
                    )}
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
              <div className="mb-8 flex flex-col sm:flex-row justify-end gap-4">
                <button
                  onClick={downloadReportPDF}
                  disabled={isDownloadingReport}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 transition px-6 py-3.5 rounded-xl text-white font-semibold shadow-lg border border-slate-700 disabled:opacity-70 w-full sm:w-auto"
                >
                  {isDownloadingReport ? (
                    <Loader2 size={20} className="animate-spin text-indigo-400" />
                  ) : (
                    <Download size={20} className="text-indigo-400" />
                  )}
                  {isDownloadingReport ? "Generating Report..." : "Download Full AI Report"}
                </button>
                <button
                  onClick={downloadResumePDF}
                  disabled={isDownloadingResume}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition px-6 py-3.5 rounded-xl text-white font-semibold shadow-lg shadow-emerald-900/20 disabled:opacity-70 w-full sm:w-auto"
                >
                  {isDownloadingResume ? (
                    <Loader2 size={20} className="animate-spin text-white" />
                  ) : (
                    <FileText size={20} className="text-white" />
                  )}
                  {isDownloadingResume ? "Generating Resume..." : "Download ATS Resume"}
                </button>
              </div>

              {/* Visual Reports */}
              <div className="space-y-8">
                {matchData && <MatchAnalysis data={matchData} />}
                {atsData && <AtsCheck data={atsData} />}
                {optData && <ResumeOptimization data={optData} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

