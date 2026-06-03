"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  ClipboardList,
  CalendarDays,
  BarChart2,
  User,
  Settings,

  ChevronRight,
  MessageSquare,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Jobs", icon: Briefcase, href: "/jobs" },
  { label: "Applications", icon: ClipboardList, href: "/applications" },
  { label: "Resume Upload", icon: FileText, href: "/resume" },
  { label: "Interviews", icon: CalendarDays, href: "/interviews" },
  { label: "Mock Interviews", icon: MessageSquare, href: "/mock-interviews" },
  { label: "Analytics", icon: BarChart2, href: "/analytics" },
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a0f1e] border-r border-white/5 flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">Auto Apply</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-violet-600/20 text-violet-400 border border-violet-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
              }`}
            >
              <item.icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"
                }`}
              />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">User</p>
            <p className="text-xs text-slate-500 truncate">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
