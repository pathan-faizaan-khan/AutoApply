"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";

interface ResumeOptimizationProps {
  data: any;
}

export default function ResumeOptimization({ data }: ResumeOptimizationProps) {
  if (!data) return null;

  const chartData = [
    {
      name: "Skills",
      Before: data.charts?.skillsScore?.before || 0,
      After: data.charts?.skillsScore?.after || 0,
    },
    {
      name: "Keywords",
      Before: data.charts?.keywordCoverage?.before || 0,
      After: data.charts?.keywordCoverage?.after || 0,
    },
    {
      name: "ATS Score",
      Before: data.charts?.atsScore?.before || 0,
      After: data.charts?.atsScore?.after || 0,
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-8">
        <Sparkles size={32} className="text-violet-400" />
        <div>
          <h2 className="text-3xl font-bold text-white">AI Resume Optimization</h2>
          <p className="text-slate-400">Your resume magically rewritten to beat the ATS and wow recruiters.</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800">
          <h3 className="text-lg font-medium text-slate-300 mb-6 text-center">Score Improvements</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }} 
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Before" fill="#475569" radius={[4, 4, 0, 0]} maxBarSize={50} />
                <Bar dataKey="After" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-400" /> Added ATS Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.addedKeywords?.map((kw: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm rounded-lg shadow-sm">
                  + {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-indigo-900/10 rounded-2xl p-6 border border-indigo-500/20">
            <h3 className="text-lg font-medium text-white mb-3">Optimized Executive Summary</h3>
            <p className="text-sm text-indigo-200/90 leading-relaxed italic">
              "{data.optimizedResume?.summary}"
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Experience Bullet Rewrites</h3>
        <div className="space-y-6">
          {data.comparisons?.experience?.map((exp: any, i: number) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 items-stretch group">
              <div className="flex-1 bg-slate-800/40 p-5 rounded-2xl border border-slate-700 transition-colors">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Original</span>
                <p className="text-sm text-slate-300">{exp.original}</p>
              </div>
              
              <div className="flex items-center justify-center md:px-2">
                <div className="bg-slate-800 p-2 rounded-full text-slate-400">
                  <ArrowRight size={20} className="hidden md:block" />
                </div>
              </div>
              
              <div className="flex-1 bg-emerald-900/10 p-5 rounded-2xl border border-emerald-500/30 transition-colors">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3 block">Optimized (Achievement-Based)</span>
                <p className="text-sm text-emerald-100/90 leading-relaxed">{exp.optimized}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
