"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, CalendarDays, Users, ExternalLink } from "lucide-react";

export interface ScrapedJob {
  id: number;
  title: string;
  companyName: string;
  jobUrl: string;
  location: string | null;
  description: string | null;
  launchDate: string | null;
  endDate: string | null;
  appliedPeoples: number | null;
  createdAt: string;
  updatedAt: string;
}

export function JobCard({ job, index }: { job: ScrapedJob; index: number }) {
  const launchDate = job.launchDate ? new Date(job.launchDate).toLocaleDateString() : "Recent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative flex flex-col justify-between p-5 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mt-1">
              <Building2 className="w-4 h-4" />
              <span className="line-clamp-1">{job.companyName}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:rotate-6 transition-transform duration-300">
            <span className="text-primary font-bold text-lg">
              {job.companyName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground/80 line-clamp-2 mb-4">
          {job.description || "Exciting opportunity at " + job.companyName + ". Click to learn more about the role and requirements."}
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md bg-secondary/50 text-secondary-foreground border border-border">
            <MapPin className="w-3 h-3" />
            {job.location || "Remote"}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md bg-secondary/50 text-secondary-foreground border border-border">
            <CalendarDays className="w-3 h-3" />
            {launchDate}
          </div>
          {job.appliedPeoples !== null && job.appliedPeoples > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md bg-secondary/50 text-secondary-foreground border border-border">
              <Users className="w-3 h-3" />
              {job.appliedPeoples} applied
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 pt-4 border-t border-border/50 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
          View Details
        </span>
        <a 
          href={job.jobUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all group-hover:shadow-primary/40 active:scale-95"
        >
          Apply Now
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
