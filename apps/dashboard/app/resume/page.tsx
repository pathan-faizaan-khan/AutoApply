"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, FileText, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { extractDocxText, extractImageText, extractPdfText } from "../../lib/resume-parser";

export default function ResumePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showData, setShowData] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const router = useRouter();

  const [resumeData, setResumeData] = useState<any>({
    name: "", email: "", phone: "", education: [], skills: [], languages: [], experience: [], projects: []
  });

  useEffect(() => {
    try {
      const storedResume = sessionStorage.getItem("resumeData");
      const storedShowData = sessionStorage.getItem("showData");
      const storedFileName = sessionStorage.getItem("fileName");

      if (storedResume) setResumeData(JSON.parse(storedResume));
      if (storedShowData === "true") setShowData(true);
      if (storedFileName) setFileName(storedFileName);
    } catch (e) {
      console.error("Error restoring sessionStorage states:", e);
    }
  }, []);

  const handleExtract = async () => {
    if (!selectedFile) return;

    setIsExtracting(true);
    try {
      let text = "";
      if (selectedFile.name.toLowerCase().endsWith(".docx")) text = await extractDocxText(selectedFile);
      else if (selectedFile.name.toLowerCase().endsWith(".pdf")) text = await extractPdfText(selectedFile);
      else if (selectedFile.name.toLowerCase().match(/\.(png|jpg|jpeg|webp)$/)) text = await extractImageText(selectedFile);
      else throw new Error("Unsupported file format");

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Server error");

      let parsed = typeof data.result === "string" ? JSON.parse(data.result.replace(/```json/g, "").replace(/```/g, "").trim()) : data.result;

      setResumeData(parsed);
      setShowData(true);
      sessionStorage.setItem("resumeData", JSON.stringify(parsed));
      sessionStorage.setItem("showData", "true");
      if (fileName) sessionStorage.setItem("fileName", fileName);

      // Clean up past job analysis data since a new resume is uploaded
      sessionStorage.removeItem("matchData");
      sessionStorage.removeItem("atsData");
      sessionStorage.removeItem("optData");
      sessionStorage.removeItem("jobDescription");
    } catch (error: any) {
      console.error(error);
      alert(`Failed to extract resume: ${error.message}`);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-violet-500/30 font-sans pb-24">
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
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 pt-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Land your dream job with <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">AI-powered</span> insights.
          </h2>
          <p className="text-lg text-slate-400 mb-8">Upload your resume, parse your profile details, and prepare to find your matching job opportunities.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group h-full">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="bg-slate-800 text-slate-300 w-7 h-7 rounded-full flex items-center justify-center text-xs">1</span>
                Upload Resume
              </h3>
              <div className="border-2 border-dashed border-slate-700 hover:border-violet-500/50 transition-colors rounded-2xl p-6 bg-slate-950/30 flex items-center justify-center min-h-[160px]">
                {!fileName ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                    <div className="flex items-center gap-4 text-left">
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                        <FileText size={28} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium mb-0.5 text-lg">Select your resume document</p>
                        <p className="text-sm text-slate-500">Supports PDF, DOCX, JPG, PNG (Max 5MB)</p>
                      </div>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all px-8 py-3 rounded-xl text-white font-bold shadow-lg shadow-violet-900/30 transform hover:-translate-y-1 whitespace-nowrap"
                    >
                      Select File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                    <div 
                      className="flex items-center gap-4 text-left cursor-pointer group/file"
                      onClick={() => fileInputRef.current?.click()}
                      title="Click to select a different file"
                    >
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl group-hover/file:bg-emerald-500/20 transition-colors">
                        <FileText size={28} className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-emerald-400 font-medium text-lg flex items-center gap-2">
                          {fileName} <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full hidden sm:inline-block group-hover/file:text-white transition-colors">Change</span>
                        </p>
                        <p className="text-sm text-slate-500">Document ready for processing</p>
                      </div>
                    </div>
                    <button
                      onClick={handleExtract}
                      disabled={isExtracting}
                      className="bg-emerald-600 hover:bg-emerald-500 transition px-8 py-3 rounded-xl text-white font-bold disabled:opacity-50 flex items-center gap-2 whitespace-nowrap shadow-lg shadow-emerald-900/20 transform hover:-translate-y-1"
                    >
                      {isExtracting ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
                      {isExtracting ? "Extracting..." : "Extract"}
                    </button>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept=".docx,.png,.jpg,.jpeg,.webp,.pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) { setSelectedFile(e.target.files[0]); setFileName(e.target.files[0].name); } }} />
              </div>
            </div>
          </motion.div>

          {/* Extracted Profile Snapshot */}
          <div className="h-full">
            <AnimatePresence mode="wait">
              {showData && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="h-full">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden h-full">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="bg-slate-800 text-slate-300 w-7 h-7 rounded-full flex items-center justify-center text-xs">✓</span>
                      Extracted Profile
                    </h3>
                    <div className="space-y-4">
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="text-slate-400 font-medium">Name</dt>
                          <dd className="text-slate-200 font-semibold">{resumeData.name || "Unknown"}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-400 font-medium">Number</dt>
                          <dd className="text-slate-200 font-semibold">{resumeData.phone || "No Phone"}</dd>
                        </div>
                        <div className="md:col-span-2">
                          <dt className="text-slate-400 font-medium">Email</dt>
                          <dd className="text-slate-200 font-semibold">{resumeData.email || "No Email"}</dd>
                        </div>
                        <div className="md:col-span-2">
                          <dt className="text-slate-400 font-medium">Education</dt>
                          <dd className="text-slate-200">
                            <ul className="list-disc list-inside space-y-1">
                              {resumeData.education?.map((edu:any, i:number) => (
                                <li key={i}>{edu.degree || ""} – {edu.institution || ""} ({edu.year || ""})</li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                        <div className="md:col-span-2">
                          <dt className="text-slate-400 font-medium mb-1">Skills</dt>
                          <dd className="text-slate-200">
                            <div className="flex flex-wrap gap-1.5">
                              {resumeData.skills?.map((skill:string, i:number) => (
                                <span key={i} className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-md font-medium">{skill}</span>
                              ))}
                            </div>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {showData && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
              <button 
                onClick={() => router.push('/job-analysis')} 
                className="mt-8 w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all rounded-2xl text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-900/20 flex justify-center items-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
              >
                Start Job Matching →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}