"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Mail, Building2, User, ChevronRight, CheckCircle2, Clock, X, FileText, Send, Star, MessageSquare } from "lucide-react";
import { ResumePreview } from "../../components/ResumePreview";

interface HistoryRecord {
  email: {
    id: number;
    subject: string;
    body: string;
    status: string;
    sentAt: string | null;
    createdAt: string;
    tailoredResumeJson: string;
  };
  target: {
    companyName: string;
    contactName: string | null;
    contactEmail: string | null;
    jobTitle: string | null;
    status: string;
    responseSentiment: string | null;
    replyBody: string | null;
  } | null;
  campaign: {
    id: number;
  } | null;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"email" | "resume">("email");

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    fetch("/api/outreach/history", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-full min-h-0 bg-background">
      {/* ── Left Sidebar (List) ── */}
      <div className={`flex flex-col border-r border-border bg-muted/10 transition-all duration-300 ${selectedRecord ? "w-1/3 min-w-[320px]" : "w-full max-w-4xl mx-auto"}`}>
        <div className="p-6 border-b border-border flex items-center justify-between shrink-0 glass">
          <div>
            <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
              <History className="w-6 h-6 text-primary" /> Outreach History
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Review your automated and manual emails.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="text-sm text-muted-foreground text-center mt-10">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center mt-10">No outreach history found. Start a campaign!</div>
          ) : (
            history.map((record) => {
              const isSelected = selectedRecord?.email.id === record.email.id;
              return (
                <button
                  key={record.email.id}
                  onClick={() => { setSelectedRecord(record); setActiveTab("email"); }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all group ${
                    isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-white hover:border-primary/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold text-sm ${isSelected ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                      {record.target?.companyName || "Manual Outreach"}
                    </h3>
                    {record.target?.status === "interview" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-200">
                        <CheckCircle2 className="w-3 h-3" /> Interview
                      </span>
                    ) : record.target?.status === "selected" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-yellow-600 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-200">
                        <Star className="w-3 h-3" /> Selected
                      </span>
                    ) : record.target?.status === "not_selected" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-200">
                        <X className="w-3 h-3" /> Not Selected
                      </span>
                    ) : record.target?.status === "replied" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-200">
                        <Mail className="w-3 h-3" /> Replied
                      </span>
                    ) : record.target?.status === "applied" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-200">
                        <CheckCircle2 className="w-3 h-3" /> Auto-Applied
                      </span>
                    ) : record.email.status === "sent" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <Send className="w-3 h-3" /> Sent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-col gap-1">
                    {record.target?.contactName ? (
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {record.target.contactName} ({record.target.contactEmail})</span>
                    ) : (
                      <span className="flex items-center gap-1.5 truncate"><Mail className="w-3 h-3" /> Subject: {record.email.subject || "No Subject"}</span>
                    )}
                    <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {record.target?.jobTitle || "General Application"}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                    <span>{new Date(record.email.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1">View Details <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right Panel (Details) ── */}
      <AnimatePresence>
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col bg-background min-w-0"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border glass shrink-0">
              <div className="flex gap-2 p-1 bg-muted rounded-xl">
                <button
                  onClick={() => setActiveTab("email")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === "email" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Mail className="w-4 h-4" /> Email Draft
                </button>
                <button
                  onClick={() => setActiveTab("resume")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === "resume" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="w-4 h-4" /> Tailored Resume
                </button>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
              <AnimatePresence mode="wait">
                {activeTab === "email" ? (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-3xl mx-auto space-y-4"
                  >
                    {/* Sent Email */}
                    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                      <h4 className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border">Your Cold Email</h4>
                      <div className="mb-4 space-y-2">
                        <div className="flex gap-4 items-center">
                          <span className="w-16 text-xs font-bold text-muted-foreground uppercase tracking-wider">To:</span>
                          <span className="text-sm font-medium">{selectedRecord.target?.contactEmail || "Unknown"}</span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <span className="w-16 text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject:</span>
                          <span className="text-sm font-bold text-foreground">{selectedRecord.email.subject}</span>
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed p-4 bg-muted/20 rounded-xl border border-border/50">
                        {selectedRecord.email.body}
                      </div>
                    </div>

                    {/* Replies / Threads */}
                    {selectedRecord.target?.replyBody && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6"
                      >
                        <div className="flex items-center gap-2 mb-3 px-1">
                          <MessageSquare className="w-4 h-4 text-primary" />
                          <h4 className="text-sm font-bold text-foreground">Email Thread</h4>
                        </div>
                        <div className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed bg-white p-4 rounded-xl border border-border shadow-sm">
                          {selectedRecord.target.replyBody}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="resume"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {selectedRecord.email.tailoredResumeJson ? (
                      <ResumePreview data={JSON.parse(selectedRecord.email.tailoredResumeJson)} />
                    ) : (
                      <div className="text-center text-muted-foreground mt-10 text-sm">No tailored resume available for this email.</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
