"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, MapPin, Link as LinkIcon, Globe, GitBranch, Briefcase, FileText, CheckCircle2, Loader2, Save, Edit2, Shield } from "lucide-react";

interface ProfileData {
  name: string | null;
  email: string | null;
  profile: {
    phone: string | null;
    address: string | null;
    linkedInUrl: string | null;
    githubUrl: string | null;
    portfolioUrl: string | null;
    skills: string | null;
    resumeText: string | null;
  } | null;
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    linkedInUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    skills: "",
    resumeText: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch("/api/profile", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.profile) {
          setFormData({
            phone: json.profile.phone || "",
            address: json.profile.address || "",
            linkedInUrl: json.profile.linkedInUrl || "",
            githubUrl: json.profile.githubUrl || "",
            portfolioUrl: json.profile.portfolioUrl || "",
            skills: json.profile.skills || "",
            resumeText: json.profile.resumeText || ""
          });
        }
      }
    } catch (e) {
      console.error("Failed to fetch profile", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        await fetchProfile();
        setIsEditing(false);
      } else {
        alert("Failed to save profile");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-full p-6 md:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <User className="w-8 h-8 text-primary" />
            Your Profile
          </h1>
          <p className="text-muted-foreground mt-1">Manage your identity and professional information.</p>
        </div>
        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-border bg-card text-sm font-bold hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Identity & Contact */}
        <div className="lg:col-span-1 space-y-6">
          {/* Identity Card */}
          <motion.div variants={itemVariants} className="glass p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-10 -mt-10 pointer-events-none blur-2xl" />
            
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-primary/20 mb-5">
              {data?.name?.charAt(0).toUpperCase() || <User />}
            </div>
            
            <h2 className="text-xl font-black text-foreground mb-1">{data?.name || "Anonymous User"}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              Verified Account
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0"><Mail className="w-4 h-4" /></div>
                <div className="truncate text-foreground font-medium">{data?.email || "No email"}</div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0"><Phone className="w-4 h-4" /></div>
                {isEditing ? (
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone number" className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary" />
                ) : (
                  <div className="truncate text-foreground font-medium">{formData.phone || <span className="text-muted-foreground italic">Not provided</span>}</div>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0"><MapPin className="w-4 h-4" /></div>
                {isEditing ? (
                  <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="City, Country" className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary" />
                ) : (
                  <div className="truncate text-foreground font-medium">{formData.address || <span className="text-muted-foreground italic">Not provided</span>}</div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Links Card */}
          <motion.div variants={itemVariants} className="glass p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-wider">
              <LinkIcon className="w-4 h-4 text-blue-500" />
              Social Links
            </h3>
            
            <div className="space-y-4">
              {/* LinkedIn */}
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0"><Globe className="w-4 h-4" /></div>
                {isEditing ? (
                  <input value={formData.linkedInUrl} onChange={e => setFormData({...formData, linkedInUrl: e.target.value})} placeholder="LinkedIn URL" className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary text-xs" />
                ) : (
                  formData.linkedInUrl ? <a href={formData.linkedInUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline truncate font-medium">{formData.linkedInUrl.replace(/^https?:\/\/(www\.)?/, '')}</a> : <span className="text-muted-foreground italic text-xs">No link provided</span>
                )}
              </div>
              {/* GitHub */}
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center text-foreground shrink-0"><GitBranch className="w-4 h-4" /></div>
                {isEditing ? (
                  <input value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} placeholder="GitHub URL" className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary text-xs" />
                ) : (
                  formData.githubUrl ? <a href={formData.githubUrl} target="_blank" rel="noreferrer" className="text-foreground hover:underline truncate font-medium">{formData.githubUrl.replace(/^https?:\/\/(www\.)?/, '')}</a> : <span className="text-muted-foreground italic text-xs">No link provided</span>
                )}
              </div>
              {/* Portfolio */}
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0"><Briefcase className="w-4 h-4" /></div>
                {isEditing ? (
                  <input value={formData.portfolioUrl} onChange={e => setFormData({...formData, portfolioUrl: e.target.value})} placeholder="Portfolio URL" className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary text-xs" />
                ) : (
                  formData.portfolioUrl ? <a href={formData.portfolioUrl} target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline truncate font-medium">{formData.portfolioUrl.replace(/^https?:\/\/(www\.)?/, '')}</a> : <span className="text-muted-foreground italic text-xs">No link provided</span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Skills & Bio */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Skills Map */}
          <motion.div variants={itemVariants} className="glass p-6 rounded-2xl h-full flex flex-col">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-violet-500" />
              Core Skills
            </h3>
            
            {isEditing ? (
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-2 block">Enter skills separated by commas</label>
                <textarea 
                  value={formData.skills} 
                  onChange={e => setFormData({...formData, skills: e.target.value})} 
                  placeholder="e.g. React, TypeScript, Node.js, Python"
                  className="w-full h-32 bg-background border border-border rounded-xl p-4 focus:outline-none focus:border-primary resize-none text-sm"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-wrap gap-2 content-start">
                {formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary font-bold text-xs rounded-lg">
                    {skill}
                  </span>
                )) : (
                  <p className="text-muted-foreground text-sm italic">No skills listed yet. Add your core competencies to improve AI matching.</p>
                )}
              </div>
            )}
          </motion.div>

          {/* Master Resume Text */}
          <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-indigo-500" />
              Master Background Text
            </h3>
            
            {isEditing ? (
              <div className="flex-1 flex flex-col h-full min-h-[250px]">
                <label className="text-xs text-muted-foreground mb-2 block">Paste your full text resume here. The AI uses this to tailor cold emails and applications.</label>
                <textarea 
                  value={formData.resumeText} 
                  onChange={e => setFormData({...formData, resumeText: e.target.value})} 
                  placeholder="Professional summary, experience, education..."
                  className="flex-1 w-full bg-background border border-border rounded-xl p-4 focus:outline-none focus:border-primary resize-none text-sm font-mono"
                />
              </div>
            ) : (
              <div className="flex-1 p-4 rounded-xl bg-muted/30 border border-border/50 max-h-[300px] overflow-y-auto custom-scrollbar">
                {formData.resumeText ? (
                  <p className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed opacity-80">{formData.resumeText}</p>
                ) : (
                  <p className="text-muted-foreground text-sm italic">No background text provided. Add your resume text here to power the AI features.</p>
                )}
              </div>
            )}
          </motion.div>

        </div>

      </motion.div>
    </div>
  );
}
