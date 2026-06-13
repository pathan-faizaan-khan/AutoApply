"use client";

import { motion } from "framer-motion";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  val: string | number;
  icon: LucideIcon;
  colorClass: string;
  trend?: string;
  delay?: number;
}

export default function StatCard({ label, val, icon: Icon, colorClass, trend = "+12%", delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-secondary/40 border border-border p-6 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-colors shadow-sm"
    >
      {/* Decorative gradient blur */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl border ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 group-hover:text-foreground transition-colors">
          {trend} <ArrowUpRight className="w-3 h-3 text-green-500" />
        </span>
      </div>
      
      <div className="relative z-10">
        <p className="text-3xl font-black tracking-tight text-foreground">{val}</p>
        <p className="text-xs text-muted-foreground font-bold mt-2 uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  );
}
