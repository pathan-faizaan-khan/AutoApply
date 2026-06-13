"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip as RechartsTooltip } from "recharts";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, FileSearch, ShieldCheck } from "lucide-react";

interface AtsCheckProps {
  data: any;
}

export default function AtsCheck({ data }: AtsCheckProps) {
  if (!data) return null;

  const score = data.atsScore || 0;
  
  let color = "#10b981"; // emerald
  let Icon = ShieldCheck;
  let statusText = "Highly Compatible";
  
  if (score < 60) {
    color = "#f43f5e"; // rose
    Icon = XCircle;
    statusText = "Poor Compatibility";
  } else if (score < 80) {
    color = "#eab308"; // yellow
    Icon = AlertTriangle;
    statusText = "Moderate Compatibility";
  }

  const gaugeData = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-8">
        <FileSearch size={32} className="text-blue-400" />
        <div>
          <h2 className="text-3xl font-bold text-white">ATS Compatibility Check</h2>
          <p className="text-slate-400">Analyzed against standard Applicant Tracking System parsers.</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        
        {/* Left Col: Gauge & Radar */}
        <div className="space-y-6">
          <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center relative">
            <h3 className="text-lg font-medium text-slate-300 self-start mb-2">Total ATS Score</h3>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="100%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={80}
                    outerRadius={100}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={5}
                  >
                    <Cell fill={color} />
                    <Cell fill="#1e293b" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 top-1/4 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white">{score}</span>
                <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700" style={{ color }}>
                  <Icon size={14} />
                  <span className="font-semibold text-sm">{statusText}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-medium text-slate-300 mb-2">Resume Quality Radar</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.radarData || []}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Section Scores & Suggestions */}
        <div className="space-y-6 flex flex-col h-full">
          <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-medium text-slate-300 mb-4">Section Diagnostics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(data.sectionScores || {}).map(([key, value]: [string, any], i: number) => {
                const isGood = value >= 80;
                const isWarn = value >= 60 && value < 80;
                const valColor = isGood ? "text-emerald-400" : isWarn ? "text-amber-400" : "text-rose-400";
                
                return (
                  <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col">
                    <span className="text-xs text-slate-400 mb-2 leading-tight">{key}</span>
                    <span className={`text-2xl font-bold ${valColor}`}>{value}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-900/10 rounded-2xl p-6 border border-blue-500/20 flex-1">
            <h3 className="text-lg font-medium text-blue-300 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} /> Fix Suggestions
            </h3>
            <ul className="space-y-3">
              {data.suggestions?.map((sug: string, i: number) => (
                <li key={i} className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <div className="mt-0.5 bg-blue-500/20 p-1 rounded-full shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                  </div>
                  <span className="text-sm text-slate-300 leading-relaxed">{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
