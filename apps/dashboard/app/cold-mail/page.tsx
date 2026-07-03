"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, RefreshCw, Send, User, Globe, Link2,
  GitBranch, ChevronRight, Check, Copy, ExternalLink, Activity,
  FileText, Eye, Edit3, AlertCircle, Search, Building2,
  Shield, Clock, CheckCircle2, Users, ArrowRight, Loader2,
  Star, Info, XCircle, X, Bot
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { ResumePreview } from "../../components/ResumePreview";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Contact {
  name: string;
  email: string;
  title?: string;
  linkedin_url?: string;
  github_url?: string;
  confidence: "high" | "medium" | "low";
  source: string;
}

interface EmailDraft {
  id?: number;
  subject: string;
  body: string;
  status: string;
}

// ─── Confidence Badge ─────────────────────────────────────────────────────────
function ConfidenceBadge({ level }: { level: string }) {
  const config: Record<string, { label: string; cls: string; dot: string }> = {
    high: { label: "High", cls: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500" },
    medium: { label: "Medium", cls: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800", dot: "bg-amber-500" },
    low: { label: "Low", cls: "bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700", dot: "bg-slate-400" },
  };
  const c = config[level] || config.low!;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── Contact Card ─────────────────────────────────────────────────────────────
function ContactCard({ contact, selected, onClick }: {
  contact: Contact;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all group relative overflow-hidden ${
        selected
          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
          : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
      }`}
    >
      {selected && (
        <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-primary to-blue-500 rounded-r-full" />
      )}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md ${
          selected ? "bg-gradient-to-br from-primary to-blue-500" : "bg-gradient-to-br from-slate-500 to-slate-600"
        }`}>
          {contact.name ? contact.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className="text-sm font-bold text-foreground truncate">{contact.name || "Unknown"}</p>
            <ConfidenceBadge level={contact.confidence} />
          </div>
          <p className="text-[11px] text-muted-foreground truncate mb-1">{contact.title || "Employee"}</p>
          <p className="text-[11px] text-primary font-semibold truncate">{contact.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            {contact.linkedin_url && (
              <span className="flex items-center gap-1 text-[9px] text-blue-500 font-semibold">
                <Link2 className="w-2.5 h-2.5" /> LinkedIn
              </span>
            )}
            {contact.github_url && (
              <span className="flex items-center gap-1 text-[9px] text-muted-foreground font-semibold">
                <GitBranch className="w-2.5 h-2.5" /> GitHub
              </span>
            )}
            <span className="text-[9px] text-muted-foreground/50 font-semibold uppercase ml-auto">{contact.source?.replace("_", " ")}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Searching / Loading overlay ──────────────────────────────────────────────
function SearchingState({ company }: { company: string }) {
  const steps = [
    { label: "Scanning company domain", icon: Globe, delay: 0 },
    { label: "Finding decision makers", icon: Users, delay: 0.6 },
    { label: "Verifying email addresses", icon: Shield, delay: 1.2 },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full py-10 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mb-6 shadow-xl shadow-primary/25 relative">
        <Search className="w-7 h-7 text-white" />
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-primary/50"
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">Finding Contacts</h3>
      <p className="text-xs text-muted-foreground mb-6">Searching {company}&apos;s team...</p>
      <div className="space-y-3 w-full max-w-[220px]">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.delay, duration: 0.4 }}
            className="flex items-center gap-3 text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: step.delay }}
              >
                <step.icon className="w-3.5 h-3.5 text-primary" />
              </motion.div>
            </div>
            <span className="text-xs text-muted-foreground font-medium">{step.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Generating Email overlay ─────────────────────────────────────────────────
function GeneratingState({ contactName }: { contactName: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mb-6 shadow-2xl shadow-primary/30 relative">
        <Bot className="w-9 h-9 text-white" />
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-primary/40"
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">Crafting Your Cold Email</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        AI is personalising a cold email for <span className="font-bold text-foreground">{contactName}</span>, referencing your resume and job context.
      </p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground px-4 py-2.5 rounded-xl bg-muted border border-border">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
        Analysing profile & crafting message...
      </div>
    </div>
  );
}

// ─── Email Editor Panel ───────────────────────────────────────────────────────
function EmailEditorPanel({ draft, onChange, onSend, sending, tailoring, onTailor, tailorChanges, tailoredResumeData }: {
  draft: EmailDraft;
  onChange: (d: EmailDraft) => void;
  onSend: () => void;
  sending: boolean;
  tailoring: boolean;
  onTailor: () => void;
  tailorChanges: string[];
  tailoredResumeData: any;
}) {
  const [copied, setCopied] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Edit3 className="w-3.5 h-3.5 text-primary" />
          </div>
          <h3 className="text-sm font-black text-foreground">Email Draft</h3>
          {draft.status === "sent" && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">SENT</span>
          )}
          {draft.status === "draft" && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">DRAFT</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground border border-border hover:text-foreground hover:border-primary/30 transition-all"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Subject */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Subject Line</label>
        <input
          type="text"
          value={draft.subject}
          onChange={e => onChange({ ...draft, subject: e.target.value })}
          className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col min-h-0">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Message Body</label>
        <textarea
          value={draft.body}
          onChange={e => onChange({ ...draft, body: e.target.value })}
          className="flex-1 p-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none leading-relaxed"
          style={{ minHeight: "200px" }}
        />
      </div>

      {/* Attachment */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Attachments</label>
          {draft.body && (
            <button
              onClick={onTailor}
              disabled={tailoring}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all disabled:opacity-50 border border-primary/20"
            >
              {tailoring ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />}
              {tailoredResumeData ? "Re-tailor Resume" : "AI-Tailor Resume"}
            </button>
          )}
        </div>

        {tailoredResumeData ? (
          <button
            onClick={() => setShowResumeModal(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all w-full text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Tailored_Resume.pdf</p>
              <p className="text-[10px] text-muted-foreground">{tailorChanges.length} AI optimizations applied</p>
            </div>
            <Eye className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
          </button>
        ) : (
          <div className="px-4 py-3 rounded-xl border border-dashed border-border bg-muted/30 flex items-center gap-3">
            <FileText className="w-4 h-4 text-muted-foreground/40" />
            <span className="text-xs font-medium text-muted-foreground">No tailored resume yet — click &quot;AI-Tailor Resume&quot; above</span>
          </div>
        )}
      </div>

      {/* Send */}
      <button
        onClick={onSend}
        disabled={sending || !draft.subject || !draft.body}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-40 active:scale-[0.98]"
      >
        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {sending ? "Sending via Gmail..." : "Send via Gmail"}
      </button>

      {/* Resume Modal */}
      <AnimatePresence>
        {showResumeModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setShowResumeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-sm font-black flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Tailored Resume Preview
                </h3>
                <button onClick={() => setShowResumeModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
                <ResumePreview data={tailoredResumeData} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBadge({ step, label, done }: { step: number; label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
        done
          ? "bg-emerald-500 text-white"
          : "bg-primary text-white"
      }`}>
        {done ? <Check className="w-3 h-3" /> : step}
      </div>
      <span className="text-xs font-bold text-muted-foreground hidden sm:block">{label}</span>
    </div>
  );
}

// ─── Trust badges ─────────────────────────────────────────────────────────────
function TrustBar() {
  const items = [
    { icon: Shield, label: "Privacy First" },
    { icon: Activity, label: "AI Powered" },
    { icon: CheckCircle2, label: "Gmail OAuth" },
    { icon: Star, label: "High Deliverability" },
  ];
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {items.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
          <Icon className="w-3.5 h-3.5 text-primary/70" />
          {label}
        </div>
      ))}
    </div>
  );
}

// ─── Main Cold Mail Page ──────────────────────────────────────────────────────
function ColdMailPageContent() {
  const searchParams = useSearchParams();

  const preCompany = searchParams.get("company") || "";
  const preDomain = searchParams.get("domain") || "";
  const preRole = searchParams.get("role") || "";
  const preUrl = searchParams.get("url") || "";

  const [company, setCompany] = useState(preCompany);
  const [domain, setDomain] = useState(preDomain);
  const [role, setRole] = useState(preRole);
  const [jobDescription, setJobDescription] = useState("");

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [findingContacts, setFindingContacts] = useState(false);

  const [draft, setDraft] = useState<EmailDraft>({ subject: "", body: "", status: "draft" });
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [tailorChanges, setTailorChanges] = useState<string[]>([]);
  const [tailoredResumeData, setTailoredResumeData] = useState<any>(null);
  const [tailoring, setTailoring] = useState(false);

  const [googleAccessToken, setGoogleAccessToken] = useState("");
  const [fetchingJob, setFetchingJob] = useState(false);
  const [jdOpen, setJdOpen] = useState(false);

  useEffect(() => {
    if (preCompany && preDomain && preRole) {
      handleFindContacts();
    }
    if (preUrl) {
      handleScrapeJob(preUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScrapeJob = async (url: string) => {
    setFetchingJob(true);
    try {
      const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "https://autoapply-scraper-backend.onrender.com";
      const res = await fetch(`${fastApiUrl}/api/jobs/scrape-description`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.description) setJobDescription(data.description);
    } catch (e) {
      console.error(e);
    } finally {
      setFetchingJob(false);
    }
  };

  const handleFindContacts = useCallback(async () => {
    if (!company || !domain) return;
    setFindingContacts(true);
    setContacts([]);
    setSelectedContact(null);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch("/api/outreach/find-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ company_name: company, domain, target_role: role }),
      });
      const data = await res.json();
      setContacts(data.contacts || []);
      if (data.contacts?.length) setSelectedContact(data.contacts[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setFindingContacts(false);
    }
  }, [company, domain, role]);

  const handleGenerateEmail = async () => {
    if (!selectedContact) return;
    setGenerating(true);
    try {
      const token = localStorage.getItem("token") || "";
      const resumeRes = await fetch("/api/outreach/resume-context", { headers: { Authorization: `Bearer ${token}` } });
      const resumeCtx = await resumeRes.json();

      const res = await fetch("/api/outreach/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          contact_name: selectedContact.name,
          contact_title: selectedContact.title || "",
          company_name: company,
          job_title: role,
          job_description: jobDescription,
          candidate_name: resumeCtx?.personalInfo?.name || "The Candidate",
          candidate_skills: resumeCtx?.skills || [],
          candidate_summary: "",
          candidate_experience_summary: resumeCtx?.experiences?.slice(0, 2)
            .map((e: any) => `${e.jobTitle} at ${e.companyName}`).join(", ") || "",
        }),
      });
      const data = await res.json();
      if (data.email?.id) {
        setDraft({ id: data.email.id, subject: data.subject, body: data.body, status: "draft" });
      } else {
        setDraft({ subject: data.subject, body: data.body, status: "draft" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleTailorResume = async () => {
    setTailoring(true);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch("/api/outreach/tailor-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ job_title: role, job_description: jobDescription, email_id: draft.id }),
      });
      const data = await res.json();
      setTailorChanges(data.changes || []);
      setTailoredResumeData(data.tailored_resume || null);
    } catch (e) {
      console.error(e);
    } finally {
      setTailoring(false);
    }
  };

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
          alert("Gmail connected successfully!");
          await sendEmailWithToken();
        } else {
          alert("Failed to connect Gmail.");
        }
      } catch (e) {
        console.error("Failed to connect Gmail:", e);
      }
    },
    scope: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly",
  });

  const handleSendEmail = async () => {
    try {
      await sendEmailWithToken();
    } catch (e: any) {
      if (e.message === 'User has not connected Gmail') {
        login();
      }
    }
  };

  const sendEmailWithToken = async () => {
    if (!draft.id) {
      alert("Error: Please generate the email again before sending.");
      return;
    }
    setSending(true);
    try {
      const appToken = localStorage.getItem("token") || "";
      const res = await fetch(`/api/outreach/emails/${draft.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${appToken}` },
        body: JSON.stringify({ toEmail: selectedContact?.email || "target@example.com" }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send");
      }
      setEmailSent(true);
      setDraft(d => ({ ...d, status: "sent" }));
    } catch (e: any) {
      console.error(e);
      alert("Failed to send email: " + e.message);
    } finally {
      setSending(false);
    }
  };

  const hasSetup = company && domain && role;
  const hasContacts = contacts.length > 0;
  const hasEmail = !!draft.body;

  return (
    <div className="min-h-full p-4 md:p-6 flex flex-col gap-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Cold Email Outreach</h1>
          <p className="text-sm text-muted-foreground mt-1">Find decision makers, craft AI personalised emails & track replies — all in one flow.</p>
        </div>
        <TrustBar />
      </motion.div>

      {/* Step Progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
        className="flex items-center gap-3 flex-wrap"
      >
        <StepBadge step={1} label="Company Setup" done={!!hasSetup} />
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
        <StepBadge step={2} label="Find Contacts" done={hasContacts} />
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
        <StepBadge step={3} label="Generate Email" done={hasEmail} />
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
        <StepBadge step={4} label="Send" done={emailSent} />
      </motion.div>

      {/* Setup Form */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl border border-border p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-black text-foreground">Target Company</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Company Name</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Stripe"
              className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Domain</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="e.g. stripe.com"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Target Role</label>
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Frontend Engineer"
              className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50" />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleFindContacts}
              disabled={!company || !domain || findingContacts}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-md shadow-primary/20 active:scale-[0.98]"
            >
              {findingContacts ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              {findingContacts ? "Searching..." : "Find Contacts"}
            </button>
          </div>
        </div>

        {/* Job Description toggle */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <button
            onClick={() => setJdOpen(v => !v)}
            className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <FileText className="w-3.5 h-3.5" />
            {fetchingJob ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin text-primary" /> Auto-fetching job description...
              </span>
            ) : "Job Description (optional — improves email quality)"}
            <ChevronRight className={`w-3.5 h-3.5 ml-auto transition-transform ${jdOpen ? "rotate-90" : ""}`} />
          </button>
          <AnimatePresence>
            {jdOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here for more personalised emails..."
                  rows={5}
                  className="w-full mt-3 p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none placeholder:text-muted-foreground/50"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Three Panel Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ minHeight: "520px" }}>

        {/* Panel 1 — Contacts */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-4 glass rounded-2xl border border-border flex flex-col overflow-hidden"
        >
          <div className="flex items-center gap-2 p-4 border-b border-border/60">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-black text-foreground flex-1">Contacts Found</h3>
            {contacts.length > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {contacts.length} found
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {findingContacts ? (
              <SearchingState company={company || "company"} />
            ) : contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4 border border-border">
                  <User className="w-7 h-7 text-muted-foreground/30" />
                </div>
                <p className="text-sm font-bold text-foreground mb-1">No contacts yet</p>
                <p className="text-xs text-muted-foreground">
                  {hasSetup ? "Click Find Contacts above" : "Fill in company details & domain first"}
                </p>
              </div>
            ) : (
              contacts.map((c, i) => (
                <ContactCard
                  key={i}
                  contact={c}
                  selected={selectedContact?.email === c.email}
                  onClick={() => setSelectedContact(c)}
                />
              ))
            )}
          </div>

          {selectedContact && !findingContacts && (
            <div className="p-3 border-t border-border/60">
              <button
                onClick={handleGenerateEmail}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white text-xs font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 active:scale-[0.98]"
              >
                {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
                {generating ? "Generating..." : `Generate Email for ${selectedContact.name.split(" ")[0]}`}
              </button>
            </div>
          )}
        </motion.div>

        {/* Panel 2 — Email Composer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 glass rounded-2xl border border-border flex flex-col overflow-hidden"
        >
          <div className="flex items-center gap-2 p-4 border-b border-border/60">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-3.5 h-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-black text-foreground flex-1">Email Composer</h3>
            {emailSent && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" /> Email Sent!
              </div>
            )}
          </div>

          <div className="flex-1 p-5 overflow-y-auto">
            {generating ? (
              <GeneratingState contactName={selectedContact?.name || "contact"} />
            ) : !draft.body ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-5 border border-border">
                  <Mail className="w-10 h-10 text-muted-foreground/20" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">Ready to craft your email</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  Select a contact from the left panel, then click &quot;Generate Email&quot; to create a personalised AI cold email.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md">
                  {[
                    { icon: Bot, title: "AI Personalised", desc: "Crafted using your resume" },
                    { icon: Shield, title: "Non-Generic", desc: "Unique for each contact" },
                    { icon: CheckCircle2, title: "High Open Rate", desc: "Subject lines that work" },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex flex-col items-center p-3 rounded-xl bg-muted/50 border border-border/60 text-center">
                      <Icon className="w-5 h-5 text-primary mb-2" />
                      <p className="text-xs font-bold text-foreground">{title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmailEditorPanel
                draft={draft}
                onChange={setDraft}
                onSend={handleSendEmail}
                sending={sending}
                tailoring={tailoring}
                onTailor={handleTailorResume}
                tailorChanges={tailorChanges}
                tailoredResumeData={tailoredResumeData}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ColdMailPage() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "missing-client-id";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Suspense fallback={<div className="flex h-full items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
        <ColdMailPageContent />
      </Suspense>
    </GoogleOAuthProvider>
  );
}
