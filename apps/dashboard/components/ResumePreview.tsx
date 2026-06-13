export function ResumePreview({ data }: { data: any }) {
  if (!data) return null;
  const { personalInfo, summary, experience, skills, projects, education } = data;
  return (
    <div className="font-sans text-sm text-foreground space-y-6 max-w-2xl mx-auto p-4 bg-white border border-border rounded-md shadow-sm">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold uppercase tracking-tight">{personalInfo?.name || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
          {personalInfo?.linkedin && <a href={personalInfo.linkedin} className="text-primary hover:underline">LinkedIn</a>}
          {personalInfo?.github && <a href={personalInfo.github} className="text-primary hover:underline">GitHub</a>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div>
          <h2 className="text-xs font-bold border-b pb-1 mb-2 uppercase tracking-wider">Summary</h2>
          <p className="text-xs text-muted-foreground leading-relaxed text-justify">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div>
          <h2 className="text-xs font-bold border-b pb-1 mb-2 uppercase tracking-wider">Skills</h2>
          <p className="text-xs text-muted-foreground">{skills.join(", ")}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div>
          <h2 className="text-xs font-bold border-b pb-1 mb-3 uppercase tracking-wider">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-xs">{exp.role || exp.jobTitle}</h3>
                  <span className="text-[10px] text-muted-foreground font-medium">{exp.duration || ""}</span>
                </div>
                <div className="text-[11px] font-medium text-foreground mb-1 italic">{exp.company || exp.companyName}</div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div>
          <h2 className="text-xs font-bold border-b pb-1 mb-3 uppercase tracking-wider">Projects</h2>
          <div className="space-y-4">
            {projects.map((proj: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-xs">{proj.name}</h3>
                </div>
                <div className="text-[11px] font-medium text-foreground mb-1 italic">{Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}</div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div>
          <h2 className="text-xs font-bold border-b pb-1 mb-3 uppercase tracking-wider">Education</h2>
          <div className="space-y-3">
            {education.map((edu: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-xs">{edu.degree}</h3>
                  <span className="text-[10px] text-muted-foreground font-medium">{edu.year || edu.date || ""}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{edu.school || edu.institution}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
