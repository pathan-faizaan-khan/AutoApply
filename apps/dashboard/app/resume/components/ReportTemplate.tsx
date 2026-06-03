import React from "react";

export const ReportTemplate = React.forwardRef<HTMLDivElement, any>(({ matchData, atsData, optData }, ref) => {
  return (
    <div className="fixed top-0 left-[-9999px] z-[-9999] opacity-0 pointer-events-none w-[210mm]">
      <div ref={ref} className="bg-slate-950 text-slate-200">
        {/* Page 1: Executive Summary */}
        <div className="w-[210mm] h-[297mm] p-16 flex flex-col justify-center items-center bg-slate-950 relative">
          <div className="absolute top-0 left-0 w-full h-4 bg-indigo-500"></div>
          <h1 className="text-5xl font-black text-white mb-6">AI Resume Analysis Report</h1>
          <p className="text-xl text-slate-400 mb-12">Confidential Candidate Assessment</p>
          <div className="bg-slate-900 p-10 rounded-2xl shadow-xl w-full border border-slate-800 text-center">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">Hiring Recommendation</h2>
            <div className="text-4xl font-black mb-6 text-white">{matchData?.hiringRecommendation || "Evaluating..."}</div>
            <p className="text-slate-300 leading-relaxed text-lg">
              {matchData?.summary}
            </p>
          </div>
        </div>

        {/* Page 2: Match Analysis */}
        <div className="w-[210mm] h-[297mm] p-16 bg-slate-950 relative">
          <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">1. Semantic Job Match</h2>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="font-semibold text-slate-400 mb-2">Overall Match</h3>
              <div className="text-5xl font-bold text-indigo-400">{matchData?.overallMatchPercentage || 0}%</div>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="font-semibold text-slate-400 mb-2">Skills Score</h3>
              <div className="text-5xl font-bold text-emerald-400">{matchData?.skillsMatchScore || 0}/100</div>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="font-bold text-xl mb-4 text-emerald-400">Top Strengths</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              {matchData?.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4 text-rose-400">Weaknesses</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              {matchData?.weaknesses?.map((w: string, i: number) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>

        {/* Page 3: ATS Compatibility */}
        <div className="w-[210mm] h-[297mm] p-16 bg-slate-950 relative">
          <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">2. ATS Diagnostics</h2>
          <div className="bg-blue-900/20 p-8 rounded-xl border border-blue-500/30 mb-8 text-center">
             <div className="text-6xl font-black text-blue-400 mb-2">{atsData?.atsScore || 0}</div>
             <div className="text-blue-300 font-medium">Total ATS Compatibility Score</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {Object.entries(atsData?.sectionScores || {}).map(([key, val]: any, i) => (
              <div key={i} className="flex justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="font-medium text-slate-300">{key}</span>
                <span className="font-bold text-indigo-400">{val}%</span>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4 text-slate-200">Critical Improvements</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              {atsData?.suggestions?.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>

        {/* Page 4: Keywords & Skills */}
        <div className="w-[210mm] h-[297mm] p-16 bg-slate-950 relative">
          <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">3. Keyword Deep Dive</h2>
          <div className="mb-8">
             <h3 className="font-bold text-emerald-400 mb-4 text-xl">Found Keywords</h3>
             <div className="flex flex-wrap gap-2">
               {matchData?.foundKeywords?.map((k: string, i: number) => (
                 <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm">{k}</span>
               ))}
             </div>
          </div>
          <div>
             <h3 className="font-bold text-rose-400 mb-4 text-xl">Missing Keywords</h3>
             <div className="flex flex-wrap gap-2">
               {matchData?.missingKeywords?.map((k: string, i: number) => (
                 <span key={i} className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-sm">{k}</span>
               ))}
             </div>
          </div>
        </div>

        {/* Page 5: Optimization Results */}
        <div className="w-[210mm] h-[297mm] p-16 bg-slate-950 relative">
          <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">4. AI Optimizations</h2>
          <div className="mb-8">
            <h3 className="font-bold text-indigo-400 text-xl mb-4">Rewritten Executive Summary</h3>
            <p className="p-6 bg-indigo-900/10 border border-indigo-500/20 rounded-xl text-slate-300 italic">
              "{optData?.optimizedResume?.summary}"
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white text-xl mb-4">Achievement-Based Bullet Rewrites</h3>
            <div className="space-y-6">
              {optData?.comparisons?.experience?.map((exp: any, i: number) => (
                <div key={i} className="border border-slate-700 rounded-xl overflow-hidden">
                   <div className="bg-slate-900 p-4 border-b border-slate-700">
                     <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Before</span>
                     <p className="text-sm text-slate-300">{exp.original}</p>
                   </div>
                   <div className="bg-emerald-900/10 p-4">
                     <span className="text-xs font-bold text-emerald-500 uppercase block mb-1">After</span>
                     <p className="text-sm font-medium text-emerald-300">{exp.optimized}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
ReportTemplate.displayName = "ReportTemplate";
