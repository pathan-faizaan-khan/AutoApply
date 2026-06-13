"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, BookOpen, Briefcase, FileText } from "lucide-react";

interface MatchAnalysisProps {
  data: any;
}

export default function MatchAnalysis({ data }: MatchAnalysisProps) {
  if (!data) return null;

  const pieData = [
    { name: "Matched", value: data.overallMatchPercentage },
    { name: "Missing", value: 100 - data.overallMatchPercentage },
  ];

  const COLORS = ["#8b5cf6", "#1e293b"]; // violet-500, slate-800

  const getRecommendation = (rec: string) => {
    if (rec === "Strong Match") return { color: "text-emerald-400", bg: "bg-emerald-500/20", icon: CheckCircle2 };
    if (rec === "Moderate Match") return { color: "text-amber-400", bg: "bg-amber-500/20", icon: AlertTriangle };
    return { color: "text-rose-400", bg: "bg-rose-500/20", icon: XCircle };
  };

  const recData = getRecommendation(data.hiringRecommendation || "Moderate Match");
  const RecIcon = recData.icon;

  const keywordData = [
    { name: "Found", count: data.foundKeywords?.length || 0 },
    { name: "Missing", count: data.missingKeywords?.length || 0 }
  ];

  const scoreCards = [
    { title: "Skills Score", score: data.skillsMatchScore || 0, icon: TrendingUp },
    { title: "Experience Score", score: data.experienceMatchScore || 0, icon: Briefcase },
    { title: "Education Score", score: data.educationMatchScore || 0, icon: BookOpen },
    { title: "Keyword Score", score: data.keywordCoverageScore || 0, icon: FileText }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">AI Job Match Analysis</h2>
          <p className="text-slate-400">Deep semantic analysis of your resume against the job description.</p>
        </div>
        
        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full ${recData.bg} border border-slate-700/50 shadow-lg`}>
          <RecIcon size={24} className={recData.color} />
          <span className={`font-bold text-lg tracking-wide ${recData.color}`}>
            {data.hiringRecommendation}
          </span>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Gauge Chart */}
        <div className="col-span-1 bg-slate-950/50 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center relative shadow-inner">
          <h3 className="text-lg font-medium text-slate-300 mb-4 self-start">Overall Match</h3>
          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={8}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                {data.overallMatchPercentage}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Scores Grid */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {scoreCards.map((card, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50 flex flex-col justify-between shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-slate-300 font-medium">{card.title}</h4>
                <card.icon size={20} className="text-indigo-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{card.score}</span>
                <span className="text-sm text-slate-500">/100</span>
              </div>
              <div className="w-full bg-slate-700/50 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${card.score}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
            <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} /> Top Strengths
            </h4>
            <ul className="space-y-2">
              {data.strengths?.map((str: string, i: number) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span> {str}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
            <h4 className="text-rose-400 font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle size={18} /> Weaknesses to Address
            </h4>
            <ul className="space-y-2">
              {data.weaknesses?.map((weak: string, i: number) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-rose-500 mt-1">•</span> {weak}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 flex flex-col">
          <h4 className="text-indigo-400 font-semibold mb-4">Keyword Coverage Map</h4>
          <div className="h-48 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={keywordData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} 
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {keywordData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold mb-2 tracking-wider">Found Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {data.foundKeywords?.map((kw: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-md">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold mb-2 tracking-wider">Missing Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {data.missingKeywords?.map((kw: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-md">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-900/20 p-6 rounded-2xl border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
        <h4 className="text-indigo-300 font-bold mb-2 text-lg">AI Executive Summary</h4>
        <p className="text-indigo-100/80 leading-relaxed text-sm md:text-base">
          {data.summary}
        </p>
      </div>
    </motion.div>
  );
}
