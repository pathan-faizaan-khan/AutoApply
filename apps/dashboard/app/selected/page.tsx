"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useCachedFetch } from "../../hooks/useCachedFetch";
import { Trophy, Star, Mail, Building2, User2, Briefcase, ExternalLink, Sparkles, PartyPopper } from "lucide-react";

interface SelectedRecord {
  target: {
    id: number;
    companyName: string;
    contactName: string | null;
    contactEmail: string | null;
    contactTitle: string | null;
    jobTitle: string | null;
    replyBody: string | null;
    updatedAt: string;
  };
  email: {
    subject: string | null;
    sentAt: string | null;
  } | null;
  campaign: {
    id: number;
  } | null;
}

// ── Confetti Particle ─────────────────────────────────────────────────────────
const ConfettiCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#0ea5e9", "#f97316"];
    const particles: {
      x: number; y: number; vx: number; vy: number;
      color: string; size: number; alpha: number; decay: number; angle: number; spin: number;
    }[] = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: 1 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        alpha: 1,
        decay: 0.005 + Math.random() * 0.01,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.2,
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
const CompanyAvatar = ({ name, size = "lg" }: { name: string; size?: "sm" | "lg" }) => {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const colors = [
    ["#f59e0b", "#f97316"], ["#6366f1", "#8b5cf6"], ["#10b981", "#0ea5e9"],
    ["#ec4899", "#8b5cf6"], ["#0ea5e9", "#6366f1"],
  ];
  const idx = name.charCodeAt(0) % colors.length;
  const [from, to] = colors[idx];
  const sizeClass = size === "lg" ? "w-16 h-16 text-xl" : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-2xl flex items-center justify-center font-black text-white flex-shrink-0 shadow-lg`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials}
    </div>
  );
};

// ── Selected Card ─────────────────────────────────────────────────────────────
const SelectedCard = ({ record, index }: { record: SelectedRecord; index: number }) => {
  const { target, email } = record;
  const date = target.updatedAt ? new Date(target.updatedAt).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200, damping: 20 }}
      className="relative bg-card border border-yellow-500/20 rounded-3xl overflow-hidden shadow-xl hover:shadow-yellow-500/10 hover:border-yellow-500/40 transition-all group"
    >
      {/* Golden top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500" />

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-3xl" />

      <div className="p-6">
        {/* Header: Avatar + Company + Badge */}
        <div className="flex items-start gap-4 mb-5">
          <CompanyAvatar name={target.companyName} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-black text-foreground text-xl">{target.companyName}</h3>
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                <Trophy className="w-3 h-3" /> Selected
              </span>
            </div>
            {target.jobTitle && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-semibold">
                <Briefcase className="w-3.5 h-3.5 text-yellow-500/70" />
                {target.jobTitle}
              </div>
            )}
            {date && (
              <p className="text-xs text-muted-foreground/60 mt-1">Selected on {date}</p>
            )}
          </div>
        </div>

        {/* Contact info pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {target.contactName && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-muted/60 border border-border/50 text-muted-foreground px-3 py-1.5 rounded-xl font-semibold">
              <User2 className="w-3.5 h-3.5" /> {target.contactName}
              {target.contactTitle && <span className="text-muted-foreground/60">· {target.contactTitle}</span>}
            </span>
          )}
          {target.contactEmail && (
            <a
              href={`mailto:${target.contactEmail}`}
              className="inline-flex items-center gap-1.5 text-xs bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-xl font-semibold hover:bg-primary/20 transition-all"
            >
              <Mail className="w-3.5 h-3.5" /> {target.contactEmail}
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          )}
        </div>

        {/* Offer Letter / Reply */}
        {target.replyBody && (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-yellow-500/15 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-black uppercase tracking-wider text-yellow-400">
                Selection Email
              </span>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap font-sans">
                {target.replyBody}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SelectedPage() {
  const { data, loading } = useCachedFetch<{ selected: SelectedRecord[] }>("/api/outreach/selected", null);
  const selected = data?.selected || [];

  return (
    <div className="p-6 md:p-8 min-h-screen">
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden mb-8 border border-yellow-500/20"
        style={{ background: "linear-gradient(135deg, #1a1400 0%, #0f0b00 50%, #0a0a0a 100%)" }}
      >
        {/* Canvas Confetti */}
        {selected.length > 0 && <ConfettiCanvas />}

        {/* Content */}
        <div className="relative z-10 px-8 py-10 text-center">
          {/* Trophy icon */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-2xl shadow-yellow-500/40 mb-5"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl font-black text-white mb-2">
            Congratulations! 🎉
          </h1>
          <p className="text-yellow-300/80 text-base font-semibold max-w-md mx-auto">
            {selected.length > 0
              ? `You've been selected by ${selected.length} ${selected.length === 1 ? "company" : "companies"}. Your hard work paid off!`
              : "Your selected companies will appear here once recruiters reply positively to your cold emails."}
          </p>

          {/* Sparkle decorations */}
          {selected.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
              {selected.map((r, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="inline-flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-bold px-3 py-1.5 rounded-full"
                >
                  <Star className="w-3 h-3 fill-yellow-300" />
                  {r.target.companyName}
                </motion.span>
              ))}
            </div>
          )}
        </div>

        {/* Ambient glow bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
      </motion.div>

      {/* ── Cards ────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-64 bg-card border border-border rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : selected.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 border border-dashed border-border rounded-3xl"
        >
          <div className="inline-flex w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 items-center justify-center mb-4">
            <PartyPopper className="w-8 h-8 text-yellow-400/60" />
          </div>
          <p className="text-muted-foreground font-bold text-sm mb-1">No selections yet</p>
          <p className="text-muted-foreground/60 text-xs max-w-xs mx-auto">
            When a recruiter sends a positive reply to your cold email, they will automatically appear here.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {selected.map((record, i) => (
            <SelectedCard key={record.target.id} record={record} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
