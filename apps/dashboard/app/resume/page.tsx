"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2, FileText, ChevronRight, UploadCloud, CheckCircle2,
  X, Trash2, Download, Cloud, RefreshCw, HardDrive, Edit2, Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { extractDocxText, extractImageText, extractPdfText } from "../../lib/resume-parser";

interface DBResume {
  id: number;
  userId: number;
  s3Url: string;
  fileName: string;
  atsScore: number | null;
  createdAt: string;
  personalInfo: { name: string; email: string; phone: string; linkedinUrl: string; githubUrl: string; portfolioUrl: string; summary: string } | null;
  experiences: any[];
  educations: any[];
  skills: string[];
  projects: any[];
  certifications: any[];
  languages: any[];
}

export default function ResumeProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [resumes, setResumes] = useState<DBResume[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState("");

  const activeResume = resumes.find(r => r.id === activeResumeId) || null;

  const fetchResumes = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`/api/resumes/db`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setResumes(data.resumes || []);
        if (data.resumes?.length > 0 && !activeResumeId) {
          setActiveResumeId(data.resumes[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load resumes", e);
    } finally {
      setIsLoading(false);
    }
  }, [activeResumeId]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleUploadFlow = async (file: File) => {
    setIsUploading(true);
    try {
      // Allow testing without authentication token if disabled locally

      setUploadProgressMsg("Extracting text from file...");
      let text = "";
      const name = file.name.toLowerCase();
      if (name.endsWith(".docx")) text = await extractDocxText(file);
      else if (name.endsWith(".pdf")) text = await extractPdfText(file);
      else if (name.match(/\.(png|jpg|jpeg|webp)$/)) text = await extractImageText(file);
      else throw new Error("Unsupported format");

      setUploadProgressMsg("Uploading to S3 Cloud...");
      const form = new FormData();
      form.append("file", file);
      const token = localStorage.getItem("token") || "";
      const s3Res = await fetch("/api/resumes", { method: "POST", body: form, headers: { Authorization: `Bearer ${token}` } });
      const s3Data = await s3Res.json();
      if (!s3Res.ok) throw new Error("S3 Upload Failed");

      setUploadProgressMsg("AI Deep Parsing Resume...");
      const parseRes = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });
      const parseData = await parseRes.json();
      const parsed = typeof parseData.result === "string" 
        ? JSON.parse(parseData.result.replace(/```json/g, "").replace(/```/g, "").trim()) 
        : parseData.result;

      setUploadProgressMsg("Saving to Database...");
      const dbRes = await fetch(`/api/resumes/db`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          s3Url: s3Data.key,
          fileName: file.name,
          atsScore: Math.floor(Math.random() * 30) + 60, // Mock ATS until ATS endpoint exists
          parsedData: parsed,
          rawText: text
        })
      });

      if (dbRes.ok) {
        const { resumeId } = await dbRes.json();
        await fetchResumes();
        setActiveResumeId(resumeId);
      } else {
        throw new Error("Failed to save to DB");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploading(false);
      setUploadProgressMsg("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: number, s3Url: string) => {
    if (!confirm("Delete this resume and its connected profile data?")) return;
    try {
      const token = localStorage.getItem("token") || "";
      // 1. Delete from S3 via Next.js backend
      await fetch("/api/resumes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key: s3Url })
      });
      
      // 2. Delete from DB via Next.js proxy
      const res = await fetch(`/api/resumes/db/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setResumes(prev => prev.filter(r => r.id !== id));
        if (activeResumeId === id) setActiveResumeId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-full p-6 md:p-8 flex flex-col lg:flex-row gap-6">
      
      {/* ── Left Sidebar: Resume Manager ── */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
          <h2 className="text-sm font-bold text-foreground mb-4">Upload New Resume</h2>
          
          <input
            ref={fileInputRef} type="file" accept=".docx,.pdf,.png,.jpg" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUploadFlow(e.target.files[0])}
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full py-4 border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50 rounded-xl flex flex-col items-center justify-center transition-all disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-primary mb-2" />
                <span className="text-xs text-muted-foreground font-medium">{uploadProgressMsg}</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5 text-muted-foreground mb-2" />
                <span className="text-xs font-semibold text-foreground">Click to Upload</span>
              </>
            )}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
            <h2 className="text-sm font-bold flex items-center gap-2"><HardDrive className="w-4 h-4 text-blue-500" /> Cloud Vault</h2>
            <button onClick={fetchResumes} className="p-1 hover:bg-muted rounded"><RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoading ? (
               <div className="p-4 text-center text-xs text-muted-foreground">Loading...</div>
            ) : resumes.length === 0 ? (
               <div className="p-4 text-center text-xs text-muted-foreground">No resumes stored.</div>
            ) : (
              resumes.map(r => (
                <div 
                  key={r.id} 
                  onClick={() => setActiveResumeId(r.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 group
                    ${activeResumeId === r.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"}`}
                >
                  <FileText className={`w-4 h-4 shrink-0 ${activeResumeId === r.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{r.fileName}</p>
                    <p className="text-[10px] text-muted-foreground">ATS: {r.atsScore || '--'}%</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(r.id, r.s3Url); }}
                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded text-muted-foreground transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Right Content: Central Profile Viewer ── */}
      <div className="flex-1 flex flex-col">
        {!activeResume ? (
          <div className="flex-1 glass rounded-2xl flex flex-col items-center justify-center p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h2 className="text-lg font-bold">Select a Resume</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Upload a new resume or select an existing one from your Cloud Vault to view and edit its extracted profile details.
            </p>
          </div>
        ) : (
          <motion.div key={activeResume.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            
            {/* Header Identity */}
            <div className="glass p-6 rounded-2xl flex justify-between items-start">
              <div className="flex-1 mr-4">
                <h1 className="text-2xl font-black">{activeResume.personalInfo?.name || "Unknown Name"}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                  {activeResume.personalInfo?.email && <span>{activeResume.personalInfo.email}</span>}
                  {activeResume.personalInfo?.phone && <span>• {activeResume.personalInfo.phone}</span>}
                  {activeResume.personalInfo?.linkedinUrl && <span>• <a href={activeResume.personalInfo.linkedinUrl} className="text-primary hover:underline" target="_blank" rel="noreferrer">LinkedIn</a></span>}
                  {activeResume.personalInfo?.githubUrl && <span>• <a href={activeResume.personalInfo.githubUrl} className="text-primary hover:underline" target="_blank" rel="noreferrer">GitHub</a></span>}
                  {activeResume.personalInfo?.portfolioUrl && <span>• <a href={activeResume.personalInfo.portfolioUrl} className="text-primary hover:underline" target="_blank" rel="noreferrer">Portfolio</a></span>}
                </div>
                {activeResume.personalInfo?.summary && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-xs leading-relaxed text-foreground">{activeResume.personalInfo.summary}</p>
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">ATS Match Score</div>
                <div className="text-3xl font-black text-primary">{activeResume.atsScore || 0}%</div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* Experience */}
                <div className="glass p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                    <h3 className="font-bold">Experience</h3>
                    <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><Edit2 className="w-3 h-3"/> Edit</button>
                  </div>
                  <div className="space-y-6">
                    {activeResume.experiences?.map((exp, i) => (
                      <div key={i} className="relative pl-4 border-l-2 border-primary/20">
                        <div className="absolute w-2 h-2 rounded-full bg-primary -left-[5px] top-1.5" />
                        <h4 className="font-bold text-sm">{exp.jobTitle}</h4>
                        <p className="text-xs text-primary font-medium mt-0.5">{exp.companyName} <span className="text-muted-foreground font-normal">| {exp.dateRange}</span></p>
                        {exp.description && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>}
                      </div>
                    ))}
                    {(!activeResume.experiences || activeResume.experiences.length === 0) && <p className="text-xs text-muted-foreground">No experience extracted.</p>}
                  </div>
                </div>

                {/* Projects */}
                {activeResume.projects && activeResume.projects.length > 0 && (
                  <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                      <h3 className="font-bold">Projects</h3>
                      <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><Edit2 className="w-3 h-3"/> Edit</button>
                    </div>
                    <div className="space-y-6">
                      {activeResume.projects.map((proj, i) => (
                        <div key={i} className="relative pl-4 border-l-2 border-sky-500/20">
                          <div className="absolute w-2 h-2 rounded-full bg-sky-500 -left-[5px] top-1.5" />
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm">{proj.name}</h4>
                            {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline">View link</a>}
                          </div>
                          {proj.technologies && <p className="text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-wider">{proj.technologies}</p>}
                          {proj.description && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{proj.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column */}
              <div className="space-y-6">
                
                {/* Education */}
                <div className="glass p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                    <h3 className="font-bold">Education</h3>
                    <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><Edit2 className="w-3 h-3"/> Edit</button>
                  </div>
                  <div className="space-y-4">
                    {activeResume.educations?.map((edu, i) => (
                      <div key={i}>
                        <h4 className="font-bold text-sm">{edu.degree}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{edu.institution} • {edu.year}</p>
                        {edu.gpa && <p className="text-[11px] font-bold mt-1 text-primary">GPA: {edu.gpa}</p>}
                      </div>
                    ))}
                    {(!activeResume.educations || activeResume.educations.length === 0) && <p className="text-xs text-muted-foreground">No education extracted.</p>}
                  </div>
                </div>

                {/* Skills */}
                <div className="glass p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                    <h3 className="font-bold">Skills</h3>
                    <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><Edit2 className="w-3 h-3"/> Edit</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeResume.skills?.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-primary/10 text-primary border-primary/20">
                        {skill}
                      </span>
                    ))}
                    {(!activeResume.skills || activeResume.skills.length === 0) && <p className="text-xs text-muted-foreground">No skills extracted.</p>}
                  </div>
                </div>

                {/* Certifications */}
                {activeResume.certifications && activeResume.certifications.length > 0 && (
                  <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                      <h3 className="font-bold">Certifications</h3>
                      <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><Edit2 className="w-3 h-3"/> Edit</button>
                    </div>
                    <div className="space-y-3">
                      {activeResume.certifications.map((cert, i) => (
                        <div key={i}>
                          <h4 className="font-bold text-sm">{cert.name}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{cert.issuer} {cert.date ? `• ${cert.date}` : ""}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {activeResume.languages && activeResume.languages.length > 0 && (
                  <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                      <h3 className="font-bold">Languages</h3>
                      <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><Edit2 className="w-3 h-3"/> Edit</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeResume.languages.map((lang, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-blue-500/10 text-blue-500 border-blue-500/20">
                          {lang.name} <span className="text-[9px] uppercase tracking-wider ml-1 opacity-70">({lang.proficiency})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
            
          </motion.div>
        )}
      </div>
    </div>
  );
}
