"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck, ChevronRight, ChevronLeft, Briefcase, Clock,
  Building2, MapPin, IndianRupee, Search, Check,
  ExternalLink, Globe, RefreshCw, Send, Lock, Star, Target,
  CheckCircle2, Plus, X, Settings, Activity
} from "lucide-react";
import Link from "next/link";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

// ─── Types ────────────────────────────────────────────────────────────────────
interface WizardData {
  targetRoles: string[];
  companyTypes: string[];
  workStyle: string;
  location: string;
  timelineDays: number;
  salaryMin: number;
  salaryMax: number;
}

const STEPS = ["Roles", "Timeline", "Company Type", "Location & Style", "Salary", "Automate"];

const COMPANY_TYPES = [
  { label: "Startup", icon: "🚀", desc: "Fast-paced, high growth" },
  { label: "Mid-size", icon: "🏢", desc: "Established, balanced" },
  { label: "Enterprise", icon: "🏛️", desc: "Large scale, stable" },
  { label: "FAANG", icon: "⭐", desc: "Top tier tech giants" },
  { label: "Any", icon: "🌐", desc: "Open to all types" },
];

const WORK_STYLES = ["Remote", "Hybrid", "On-site"];

const TIMELINE_OPTIONS = [
  { label: "1 Month", value: 30, desc: "Aggressive — I need a job fast" },
  { label: "3 Months", value: 90, desc: "Balanced — actively looking" },
  { label: "6 Months", value: 180, desc: "Relaxed — exploring options" },
  { label: "12 Months", value: 365, desc: "Passive — open to opportunities" },
];

const SALARY_PRESETS = [
  { label: "₹3L–₹6L",   min: 300000,  max: 600000  },
  { label: "₹6L–₹12L",  min: 600000,  max: 1200000 },
  { label: "₹12L–₹25L", min: 1200000, max: 2500000 },
  { label: "₹25L+",     min: 2500000, max: 10000000 },
];

// ─── Step Progress ────────────────────────────────────────────────────────────
function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-8 overflow-x-auto pb-2 scrollbar-none">
      {Array.from({ length: total }, (_, i) => {
        const isPast = i < current;
        const isCurrent = i === current;
        return (
          <div key={i} className="flex items-center shrink-0">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
              isPast ? "bg-primary text-white" :
              isCurrent ? "bg-primary/10 text-primary border border-primary/20" :
              "bg-muted text-muted-foreground border border-transparent"
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                isPast ? "bg-white/20" : isCurrent ? "bg-primary/20 text-primary" : "bg-muted-foreground/20"
              }`}>
                {isPast ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className={`text-xs font-bold ${isCurrent || isPast ? "" : "hidden sm:block"}`}>
                {STEPS[i]}
              </span>
            </div>
            {i < total - 1 && (
              <div className={`h-[2px] w-4 sm:w-8 mx-1 sm:mx-2 rounded-full transition-all duration-500 ${isPast ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Wizard Page ─────────────────────────────────────────────────────────
function ReferralsPageContent() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    targetRoles: [],
    companyTypes: [],
    workStyle: "Remote",
    location: "",
    timelineDays: 90,
    salaryMin: 600000,
    salaryMax: 1200000,
  });
  const [roleInput, setRoleInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [campaignSaved, setCampaignSaved] = useState(false);
  
  // Automation specific state
  const [targetEmailCount, setTargetEmailCount] = useState(10);
  const [googleToken, setGoogleToken] = useState<string>("");
  const [automationStarted, setAutomationStarted] = useState(false);
  const [campaignId, setCampaignId] = useState<number | null>(null);
  const [campaignStatus, setCampaignStatus] = useState<any>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const res = await fetch("/api/profile", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          if (data.hasGmailConnected) {
            setGoogleToken("connected");
          }
        }
      } catch (e) {
        console.error("Failed to fetch profile:", e);
      }
    };
    checkConnection();
  }, []);

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        const res = await fetch("/api/outreach/connect-gmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({ code: codeResponse.code }),
        });
        
        if (res.ok) {
          setGoogleToken("connected");
        } else {
          alert("Failed to connect Gmail.");
        }
      } catch (e) {
        console.error("Failed to connect Gmail:", e);
      }
    },
    scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly',
  });

  // Poll automation status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (automationStarted && campaignId && campaignStatus?.automationStatus !== 'completed' && campaignStatus?.automationStatus !== 'failed') {
      interval = setInterval(async () => {
        try {
          const token = localStorage.getItem("token") || "";
          const res = await fetch(`/api/outreach/campaign/${campaignId}`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const result = await res.json();
            setCampaignStatus(result.campaign);
          }
        } catch (e) { console.error(e) }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [automationStarted, campaignId, campaignStatus]);

  const addRole = () => {
    const r = roleInput.trim();
    if (r && !data.targetRoles.includes(r)) {
      setData(d => ({ ...d, targetRoles: [...d.targetRoles, r] }));
      setRoleInput("");
    }
  };

  const removeRole = (role: string) =>
    setData(d => ({ ...d, targetRoles: d.targetRoles.filter(r => r !== role) }));

  const toggleCompanyType = (type: string) => {
    if (type === "Any") {
      setData(d => ({ ...d, companyTypes: ["Any"] }));
      return;
    }
    setData(d => ({
      ...d,
      companyTypes: d.companyTypes.includes(type)
        ? d.companyTypes.filter(t => t !== type)
        : [...d.companyTypes.filter(t => t !== "Any"), type],
    }));
  };

  const canProceed = () => {
    if (step === 0) return data.targetRoles.length > 0;
    if (step === 2) return data.companyTypes.length > 0;
    if (step === 5) return !!googleToken;
    return true;
  };

  const handleAutomate = async () => {
    if (!googleToken) return;
    setSearching(true);
    try {
      const token = localStorage.getItem("token") || "";
      // Save campaign to backend
      const campRes = await fetch("/api/outreach/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          targetRoles: data.targetRoles,
          companyTypes: data.companyTypes,
          locationPref: data.location,
          workStyle: data.workStyle,
          timelineDays: data.timelineDays,
          salaryMin: data.salaryMin,
          salaryMax: data.salaryMax,
        }),
      });
      if (campRes.ok) {
        const campData = await campRes.json();
        setCampaignSaved(true);
        setCampaignId(campData.campaign.id);

        // Start Automation
        const autoRes = await fetch(`/api/outreach/campaign/${campData.campaign.id}/automate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            targetEmailCount,
          }),
        });
        
        if (autoRes.ok) {
          setAutomationStarted(true);
          setCampaignStatus({ automationStatus: 'starting', emailsSentCount: 0 });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const isResults = step === 6;

  return (
    <div className="min-h-full p-4 md:p-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Define Your Dream Role
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              Configure your preferences, and we will automatically find decision makers and pitch you.
            </p>
          </div>
        </div>

        {!isResults ? (
          <div className="glass rounded-3xl border border-border p-6 md:p-8 shadow-sm">
            <StepProgress current={step} total={STEPS.length} />

            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Step 0: Roles */}
                  {step === 0 && (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="text-xl font-black text-foreground">What roles are you targeting?</h2>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">Add one or more job titles you are actively seeking.</p>
                      
                      <div className="flex gap-2 mb-5">
                        <input
                          type="text"
                          value={roleInput}
                          onChange={e => setRoleInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && addRole()}
                          placeholder="e.g. Senior Frontend Engineer"
                          className="flex-1 h-12 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                        />
                        <button
                          onClick={addRole}
                          className="px-5 h-12 flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                        >
                          <Plus className="w-4 h-4" /> Add
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 min-h-[48px]">
                        <AnimatePresence>
                          {data.targetRoles.map(role => (
                            <motion.span
                              key={role}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-bold border border-primary/20"
                            >
                              {role}
                              <button onClick={() => removeRole(role)} className="hover:bg-primary/20 p-0.5 rounded-md transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </motion.span>
                          ))}
                        </AnimatePresence>
                      </div>

                      {data.targetRoles.length === 0 && (
                        <div className="mt-4 p-4 rounded-xl border border-dashed border-border bg-muted/30 text-center">
                          <p className="text-xs font-bold text-muted-foreground mb-2">Popular Roles:</p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {["Software Engineer", "Product Manager", "Data Scientist", "UX Designer"].map(r => (
                              <button key={r} onClick={() => { setRoleInput(r); setTimeout(addRole, 0); }} className="text-[11px] font-semibold text-muted-foreground bg-card border border-border px-2 py-1 rounded-lg hover:border-primary/50 hover:text-foreground transition-all">
                                {r}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 1: Timeline */}
                  {step === 1 && (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="text-xl font-black text-foreground">What is your timeline?</h2>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">How long are you giving yourself to land a role?</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {TIMELINE_OPTIONS.map(opt => {
                          const isActive = data.timelineDays === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setData(d => ({ ...d, timelineDays: opt.value }))}
                              className={`p-4 rounded-2xl border text-left transition-all duration-200 group relative overflow-hidden ${
                                isActive
                                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                  : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
                              }`}
                            >
                              {isActive && (
                                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-blue-500" />
                              )}
                              <div className="flex items-center justify-between">
                                <p className={`font-bold text-sm ${isActive ? "text-foreground" : "text-foreground"}`}>{opt.label}</p>
                                {isActive && <CheckCircle2 className="w-4 h-4 text-primary" />}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Company Type */}
                  {step === 2 && (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="text-xl font-black text-foreground">What type of company?</h2>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">Select all that interest you.</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {COMPANY_TYPES.map(type => {
                          const isActive = data.companyTypes.includes(type.label);
                          return (
                            <button
                              key={type.label}
                              onClick={() => toggleCompanyType(type.label)}
                              className={`p-4 rounded-2xl border text-left transition-all duration-200 group relative ${
                                isActive
                                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                  : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="text-2xl">{type.icon}</div>
                                {isActive && <CheckCircle2 className="w-4 h-4 text-primary" />}
                              </div>
                              <p className={`font-bold text-sm ${isActive ? "text-foreground" : "text-foreground"}`}>{type.label}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{type.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Location & Work Style */}
                  {step === 3 && (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="text-xl font-black text-foreground">Where do you want to work?</h2>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">Choose your preferred work style and location.</p>
                      
                      <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        {WORK_STYLES.map(ws => {
                          const isActive = data.workStyle === ws;
                          return (
                            <button
                              key={ws}
                              onClick={() => setData(d => ({ ...d, workStyle: ws }))}
                              className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                isActive 
                                  ? "border-primary bg-primary/5 text-primary shadow-sm" 
                                  : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                              }`}
                            >
                              {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {ws}
                            </button>
                          );
                        })}
                      </div>
                      
                      <AnimatePresence>
                        {data.workStyle !== "Remote" && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">City / Country</label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <input
                                type="text"
                                value={data.location}
                                onChange={e => setData(d => ({ ...d, location: e.target.value }))}
                                placeholder="e.g. San Francisco, London, Bangalore..."
                                className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Step 4: Salary */}
                  {step === 4 && (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <IndianRupee className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="text-xl font-black text-foreground">What is your salary expectation?</h2>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">This helps us target companies that meet your financial goals.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {SALARY_PRESETS.map(p => {
                          const isActive = data.salaryMin === p.min && data.salaryMax === p.max;
                          return (
                            <button
                              key={p.label}
                              onClick={() => setData(d => ({ ...d, salaryMin: p.min, salaryMax: p.max }))}
                              className={`p-4 rounded-2xl border text-center font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                isActive 
                                  ? "border-primary bg-primary/5 text-primary shadow-sm" 
                                  : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                              }`}
                            >
                              {isActive && <CheckCircle2 className="w-4 h-4" />}
                              {p.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 5: Automate Setup */}
                  {step === 5 && (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Settings className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="text-xl font-black text-foreground">Configure Automation</h2>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">We will find matching companies, discover decision-makers, and auto-send personalized outreach.</p>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 block">Target Email Volume</label>
                          <div className="flex flex-wrap gap-2">
                            {[5, 10, 20, 50].map(count => {
                              const isActive = targetEmailCount === count;
                              return (
                                <button
                                  key={count}
                                  onClick={() => setTargetEmailCount(count)}
                                  className={`flex-1 min-w-[80px] py-3 rounded-xl border text-sm font-bold transition-all ${
                                    isActive 
                                      ? "border-primary bg-primary/5 text-primary shadow-sm" 
                                      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                                  }`}
                                >
                                  {count} Emails
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                              <Globe className="w-4 h-4 text-primary" /> Gmail Authorization
                            </h3>
                            {googleToken ? (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full">
                                <Lock className="w-3.5 h-3.5" /> Required
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-5">You must authorize AutoApply.AI to send personalized emails on your behalf from your Gmail account.</p>
                          {!googleToken && (
                            <button
                              onClick={() => login()}
                              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-border text-sm font-bold text-foreground hover:bg-muted dark:hover:bg-zinc-800 transition-all shadow-sm"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                              Connect Google Account
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/60">
              <button
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0 || searching || automationStarted}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-bold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              {step < 5 ? (
                <button
                  onClick={() => canProceed() && setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleAutomate();
                    setStep(6);
                  }}
                  disabled={searching || !googleToken}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {searching ? <><RefreshCw className="w-4 h-4 animate-spin" /> Preparing...</> : <><Send className="w-4 h-4" /> Launch Outreach</>}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Automation Dashboard */
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-8 text-center max-w-xl mx-auto shadow-2xl relative overflow-hidden">
            {/* Background glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none ${
              campaignStatus?.automationStatus === 'completed' ? "bg-emerald-500" :
              campaignStatus?.automationStatus === 'failed' ? "bg-rose-500" : "bg-primary"
            }`} />

            <div className="relative z-10">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30 relative">
                <Activity className={`w-10 h-10 text-white ${campaignStatus?.automationStatus === 'running' ? 'animate-pulse' : ''}`} />
                {campaignStatus?.automationStatus === 'running' && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2 border-white/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              
              <h2 className="text-2xl font-black text-foreground mb-3">Outreach Engine Active</h2>
              
              <div className="min-h-[40px] mb-8">
                {campaignStatus?.automationStatus === 'starting' && (
                  <p className="text-muted-foreground text-sm font-medium">Initializing AI models and building target lists...</p>
                )}
                {campaignStatus?.automationStatus === 'running' && (
                  <p className="text-primary font-bold text-sm">Hunting for companies, matching decision-makers, and sending tailored emails...</p>
                )}
                {campaignStatus?.automationStatus === 'completed' && (
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">Campaign successfully completed! Target reached.</p>
                )}
                {campaignStatus?.automationStatus === 'failed' && (
                  <p className="text-rose-600 dark:text-rose-400 font-bold text-sm">An error occurred during the campaign. Please check logs.</p>
                )}
              </div>

              <div className="space-y-3 bg-muted/40 rounded-2xl p-5 border border-border">
                <div className="flex justify-between text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span className={campaignStatus?.automationStatus === 'completed' ? 'text-emerald-500' : 'text-primary'}>
                    {campaignStatus?.emailsSentCount || 0} / {targetEmailCount} Sent
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${
                      campaignStatus?.automationStatus === 'completed' 
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500' 
                        : 'bg-gradient-to-r from-primary to-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, ((campaignStatus?.emailsSentCount || 0) / targetEmailCount) * 100)}%` }}
                  />
                </div>
              </div>

              {(campaignStatus?.automationStatus === 'completed' || campaignStatus?.automationStatus === 'failed') && (
                <button
                  onClick={() => { setStep(0); setAutomationStarted(false); setCampaignStatus(null); setData(d => ({ ...d, targetRoles: [] })); }}
                  className="mt-8 px-8 py-3 rounded-xl border border-border bg-card text-sm font-bold text-foreground hover:bg-muted hover:border-primary/40 transition-all shadow-sm"
                >
                  Start New Campaign
                </button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function ReferralsPage() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ReferralsPageContent />
    </GoogleOAuthProvider>
  );
}
