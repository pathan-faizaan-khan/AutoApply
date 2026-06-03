"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  ClipboardList,
  CalendarDays,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total Applications", value: "48", icon: ClipboardList, color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Interviews", value: "12", icon: CalendarDays, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Pending", value: "20", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Success Rate", value: "25%", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

const recentApplications = [
  { company: "Microsoft", role: "Software Engineer", status: "Interview", statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { company: "Google", role: "Frontend Developer", status: "Applied", statusColor: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  { company: "Amazon", role: "Backend Engineer", status: "Pending", statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { company: "Meta", role: "React Developer", status: "Rejected", statusColor: "text-red-400 bg-red-500/10 border-red-500/20" },
];

const quickActions = [
  { label: "Upload Resume", icon: FileText, href: "/resume", desc: "Upload your resume", color: "from-green-600 to-emerald-600" },
  { label: "ATS Checker", icon: Shield, href: "/ats-checker", desc: "Check resume compatibility", color: "from-violet-600 to-indigo-600" },
  { label: "Browse Jobs", icon: Briefcase, href: "/jobs", desc: "Find matching jobs", color: "from-blue-600 to-cyan-600" },
  { label: "My Applications", icon: ClipboardList, href: "/applications", desc: "Track your progress", color: "from-emerald-600 to-teal-600" },
];

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-white mb-1">Welcome back 👋</h1>
        <p className="text-slate-400 text-sm">Here&apos;s what&apos;s happening with your job search today.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group relative bg-slate-900/50 border border-slate-800/60 rounded-2xl p-5 hover:border-slate-600/60 transition-all duration-200 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-white font-semibold text-sm">{action.label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{action.desc}</p>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Recent Applications</h2>
          <Link href="/applications" className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">
            View all →
          </Link>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl overflow-hidden">
          {recentApplications.map((app, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-5 py-4 ${i !== recentApplications.length - 1 ? "border-b border-slate-800/60" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold text-sm">
                  {app.company[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">{app.role}</p>
                  <p className="text-xs text-slate-500">{app.company}</p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${app.statusColor}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
