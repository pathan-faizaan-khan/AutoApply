"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Briefcase, FileText, ClipboardList,
  CalendarDays, BarChart2, User, Settings, MessageSquare,
  LogOut, ChevronLeft, ChevronRight, UserCheck, Mail, Sparkles, History
} from "lucide-react";
import { ThemeToggle } from "./ui/ThemeToggle";

const NAV = [
  { label: "Overview", icon: LayoutDashboard, href: "/" },
  { label: "Jobs", icon: Briefcase, href: "/jobs" },
  { label: "Applications", icon: ClipboardList, href: "/applications" },
  { label: "Resume", icon: FileText, href: "/resume" },
  { label: "Job Analysis", icon: Sparkles, href: "/job-analysis" },
  { label: "Outreach", icon: UserCheck, href: "/referrals" },
  { label: "Cold Mail", icon: Mail, href: "/cold-mail" },
  { label: "Outreach History", icon: History, href: "/history" },
  { label: "Interviews", icon: CalendarDays, href: "/interviews" },
  { label: "AI Practice", icon: MessageSquare, href: "/mock-interviews" },
  { label: "Analytics", icon: BarChart2, href: "/analytics" },
];

const BOTTOM = [
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const EXPANDED = 240;
const COLLAPSED = 68;

function NavLink({ item, collapsed, isActive }: { item: (typeof NAV)[0]; collapsed: boolean; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 group overflow-hidden
        ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
    >
      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      {!isActive && (
        <div className="absolute inset-0 bg-muted rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
      <item.icon className={`w-[18px] h-[18px] relative z-10 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

export function SidebarWithContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const sidebarW = collapsed ? COLLAPSED : EXPANDED;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000/login";
  };

  return (
    <div className="flex h-full">
      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: sidebarW }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full z-50 flex flex-col glass border-r border-border overflow-hidden hidden md:flex shrink-0"
      >
        {/* Logo — name only, no electric icon, theme toggle pinned top-right */}
        <div className="flex items-center h-16 px-4 border-b border-border shrink-0">
          <AnimatePresence>
            {!collapsed ? (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-between w-full gap-2 overflow-hidden"
              >
                {/* Project name — no icon */}
                <span className="font-black text-base tracking-tight text-foreground whitespace-nowrap leading-none">
                  Auto<span className="text-primary">Apply</span>
                  <span className="text-primary font-black">.AI</span>
                </span>

                {/* Theme toggle — top right next to name */}
                <div className="shrink-0">
                  <ThemeToggle />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-toggle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center w-full"
              >
                <ThemeToggle />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {NAV.map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} isActive={pathname === item.href} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-3 pt-3 border-t border-border shrink-0 space-y-0.5">
          {BOTTOM.map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} isActive={pathname === item.href} />
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            title={collapsed ? "Log Out" : undefined}
            className="w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:text-red-600 group overflow-hidden transition-colors"
          >
            <div className="absolute inset-0 bg-red-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <LogOut className="w-[18px] h-[18px] relative z-10 shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 whitespace-nowrap"
                >
                  Log Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 mt-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            {collapsed
              ? <ChevronRight className="w-4 h-4" />
              : <ChevronLeft className="w-4 h-4" />
            }
          </button>
        </div>
      </motion.aside>

      {/* ── Main Content ── */}
      <motion.div
        animate={{ marginLeft: sidebarW }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 h-full overflow-y-auto min-w-0"
      >
        {children}
      </motion.div>
    </div>
  );
}
