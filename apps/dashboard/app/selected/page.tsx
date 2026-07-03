"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useCachedFetch } from "../../hooks/useCachedFetch";
import { Trophy, Star, Mail, User2, Briefcase, PartyPopper } from "lucide-react";

interface SelectionRecord {
  selection: {
    id: number;
    company: string;
    role: string | null;
    offerBody: string | null;
    recruiterName: string | null;
    recruiterEmail: string | null;
    receivedAt: string;
    createdAt: string;
    targetId: number | null;
    coldEmailId: number | null;
  };
  target: {
    id: number;
    companyName: string;
    contactName: string | null;
    contactTitle: string | null;
    jobTitle: string | null;
    companyDomain: string | null;
  } | null;
}

// ── Confetti Canvas ────────────────────────────────────────────────────────────
const ConfettiCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors: string[] = ["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#0ea5e9", "#f97316", "#a855f7"];
    const particles: {
      x: number; y: number; vx: number; vy: number;
      color: string; size: number; alpha: number; decay: number; angle: number; spin: number;
    }[] = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 300,
        vx: (Math.random() - 0.5) * 2.5,
        vy: 1.5 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)] ?? "#6366f1",
        size: 4 + Math.random() * 7,
        alpha: 1,
        decay: 0.004 + Math.random() * 0.008,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.25,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.angle += p.spin;
        if (p.alpha <= 0) continue;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        ctx.restore();
      }
      if (particles.some(p => p.alpha > 0)) {
        animId = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
};

// ── Company Avatar ─────────────────────────────────────────────────────────────
const CompanyAvatar = ({ name }: { name: string }) => {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const palettes: [string, string][] = [
    ["#f59e0b", "#f97316"], ["#6366f1", "#8b5cf6"],
    ["#10b981", "#0ea5e9"], ["#ec4899", "#8b5cf6"], ["#0ea5e9", "#6366f1"],
  ];
  const idx = name.charCodeAt(0) % palettes.length;
  const pair = palettes[idx] ?? ["#f59e0b", "#f97316"];
  const [from, to] = pair;
  return (
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-xl flex-shrink-0 shadow-lg"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials}
    </div>
  );
};

// ── Selection Card ─────────────────────────────────────────────────────────────
const SelectionCard = ({ record, index }: { record: SelectionRecord; index: number }) => {
  const { selection, target } = record;
  const companyName = selection.company || target?.companyName || "Unknown Company";
  const role = selection.role || target?.jobTitle || null;
  const recruiterName = selection.recruiterName || target?.contactName || null;
  const recruiterEmail = selection.recruiterEmail || null;

  const receivedDate = selection.receivedAt
    ? new Date(selection.receivedAt).toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.09, type: "spring", stiffness: 200, damping: 20 }}
      className="relative bg-card border border-yellow-500/20 rounded-3xl overflow-hidden shadow-xl hover:shadow-yellow-500/10 hover:border-yellow-500/40 transition-all duration-300 group"
    >
      {/* Golden accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500" />

      {/* Ambient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-3xl" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <CompanyAvatar name={companyName} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-black text-foreground text-xl">{companyName}</h3>
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                <Trophy className="w-3 h-3" /> Offer Received
              </span>
            </div>
            {role && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-semibold">
                <Briefcase className="w-3.5 h-3.5 text-yellow-500/70" />
                {role}
              </div>
            )}
            {receivedDate && (
              <p className="text-xs text-muted-foreground/50 mt-1">Received on {receivedDate}</p>
            )}
          </div>
        </div>

        {/* Recruiter Info Chips */}
        {(recruiterName || recruiterEmail) && (
          <div className="flex flex-wrap gap-2 mb-5">
            {recruiterName && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-muted/60 border border-border/50 text-muted-foreground px-3 py-1.5 rounded-xl font-semibold">
                <User2 className="w-3.5 h-3.5" />
                {recruiterName}
                {target?.contactTitle && (
                  <span className="text-muted-foreground/60">· {target.contactTitle}</span>
                )}
              </span>
            )}
            {recruiterEmail && (
              <a
                href={`mailto:${recruiterEmail}`}
                className="inline-flex items-center gap-1.5 text-xs bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-xl font-semibold hover:bg-yellow-500/20 transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                {recruiterEmail}
              </a>
            )}
          </div>
        )}

        {/* Offer Letter Body */}
        {selection.offerBody ? (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-yellow-500/15 flex items-center gap-2 bg-yellow-500/5">
              <Mail className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-black uppercase tracking-wider text-yellow-400">
                Offer / Selection Email
              </span>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap font-sans">
                {selection.offerBody}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/40 bg-muted/20 px-4 py-3 text-sm text-muted-foreground italic">
            Offer email body not available.
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SelectedPage() {
  const { data, loading } = useCachedFetch<{ selected: SelectionRecord[] }>("/api/outreach/selected", null);
  const selected = data?.selected || [];

  return (
    <div className="p-6 md:p-8 min-h-screen">
      {/* ── Celebration Hero ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden mb-8 border border-yellow-500/20"
        style={{ background: "linear-gradient(135deg, #1a1200 0%, #100c00 50%, #0a0a0a 100%)" }}
      >
        {selected.length > 0 && <ConfettiCanvas />}

        <div className="relative z-10 px-8 py-10 text-center">
          {/* Floating trophy */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-2xl shadow-yellow-500/40 mb-5"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            {selected.length > 0 ? "You Got Offers! 🎉" : "Offer Letters"}
          </h1>
          <p className="text-yellow-300/75 text-base font-semibold max-w-lg mx-auto">
            {selected.length > 0
              ? `${selected.length} ${selected.length === 1 ? "company has" : "companies have"} extended a job offer to you. Congratulations on your hard work!`
              : "When a company sends you a formal job offer or selection email, it will automatically appear here — separate from interview invites."}
          </p>

          {/* Company pill badges */}
          {selected.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
              {selected.map((r, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.12, type: "spring" }}
                  className="inline-flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-bold px-3 py-1.5 rounded-full"
                >
                  <Star className="w-3 h-3 fill-yellow-300" />
                  {r.selection.company || r.target?.companyName}
                </motion.span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent" />
      </motion.div>

      {/* ── How it works note (when empty) ──────────────────────────── */}
      {!loading && selected.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-dashed border-yellow-500/20 rounded-3xl py-20 px-8 text-center"
        >
          <div className="inline-flex w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 items-center justify-center mb-4">
            <PartyPopper className="w-8 h-8 text-yellow-400/60" />
          </div>
          <p className="text-muted-foreground font-bold text-sm mb-2">No offer letters yet</p>
          <p className="text-muted-foreground/60 text-xs max-w-sm mx-auto leading-relaxed">
            This page is separate from interview invites. Only{" "}
            <strong className="text-muted-foreground">formal job offers</strong>{" "}
            (e.g., &ldquo;We&apos;d like to extend an offer&rdquo;, &ldquo;Joining date&rdquo;, &ldquo;Offer Letter&rdquo;) will appear here.
          </p>
        </motion.div>
      )}

      {/* ── Loading State ────────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-5">
          {[1, 2].map(i => (
            <div key={i} className="h-64 bg-card border border-border rounded-3xl animate-pulse" />
          ))}
        </div>
      )}

      {/* ── Offer Cards ──────────────────────────────────────────────── */}
      {!loading && selected.length > 0 && (
        <div className="grid gap-5 lg:grid-cols-2">
          {selected.map((record, i) => (
            <SelectionCard key={record.selection.id} record={record} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
