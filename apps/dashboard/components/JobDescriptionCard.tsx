import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface JobDescriptionCardProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  handleAnalyze: () => void;
  isAnalyzing: boolean;
}

export const JobDescriptionCard: React.FC<JobDescriptionCardProps> = ({
  jobDescription,
  setJobDescription,
  handleAnalyze,
  isAnalyzing,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 mb-12 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="bg-slate-800 text-slate-300 w-7 h-7 rounded-full flex items-center justify-center text-xs">2</span>
        Target Job Description
      </h3>
      <textarea
        className="w-full h-48 bg-slate-950 text-slate-300 p-5 rounded-2xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none custom-scrollbar"
        placeholder="Paste the full job description here to analyze your match..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !jobDescription.trim()}
        className="mt-6 w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all rounded-2xl text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-900/20 flex justify-center items-center gap-3"
      >
        {isAnalyzing ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
        {isAnalyzing ? 'Running AI Engine (Semantic Match & ATS Optimization)...' : 'Analyze & Optimize Resume'}
      </button>
    </div>
  );
};
