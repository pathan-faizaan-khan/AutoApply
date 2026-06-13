import React from "react";

export const OptimizedResumeTemplate = React.forwardRef<HTMLDivElement, any>(({ resumeData }, ref) => {
  if (!resumeData) return null;

  return (
    <div className="fixed top-0 left-[-9999px] z-[-9999] opacity-0 pointer-events-none w-[210mm]">
      <div ref={ref} className="bg-white text-black p-[20mm] font-serif w-[210mm] min-h-[297mm]">
        {/* Header */}
        <div className="text-center mb-6 border-b-2 border-black pb-4">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{resumeData.name || "Candidate Name"}</h1>
          <div className="text-sm flex justify-center gap-4 text-gray-700">
            {resumeData.email && <span>{resumeData.email}</span>}
            {resumeData.phone && <span>{resumeData.phone}</span>}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-2 border-b border-gray-300 pb-1">Professional Summary</h2>
            <p className="text-sm leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {/* Skills */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-2 border-b border-gray-300 pb-1">Technical Skills</h2>
            <p className="text-sm leading-relaxed">
              {resumeData.skills.join(" • ")}
            </p>
          </div>
        )}

        {/* Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b border-gray-300 pb-1">Professional Experience</h2>
            <div className="space-y-5">
              {resumeData.experience.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base">{exp.title || "Role"}</h3>
                    <span className="text-sm text-gray-600">{exp.dates || "Dates"}</span>
                  </div>
                  <div className="italic text-sm mb-2">{exp.company || "Company"}</div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1">
                      {exp.bullets.map((b: string, j: number) => (
                        <li key={j} className="text-sm leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-3 border-b border-gray-300 pb-1">Education</h2>
            <div className="space-y-3">
              {resumeData.education.map((edu: any, i: number) => (
                <div key={i}>
                  <p className="text-sm leading-relaxed">{typeof edu === 'string' ? edu : JSON.stringify(edu)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
OptimizedResumeTemplate.displayName = "OptimizedResumeTemplate";
