"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  ClipboardList,
  CalendarDays,
  BarChart2,
  User,
  Settings,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  UserCheck,
  Mail,
  History,
} from "lucide-react";
import { ThemeToggle } from "./ui/ThemeToggle";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/" },
  { label: "Jobs", icon: Briefcase, href: "/jobs" },
  { label: "Applications", icon: ClipboardList, href: "/applications" },
  { label: "Resume", icon: FileText, href: "/resume" },
  { label: "Outreach", icon: UserCheck, href: "/referrals" },
  { label: "Cold Mail", icon: Mail, href: "/cold-mail" },
  { label: "Outreach History", icon: History, href: "/history" },
  { label: "Interviews", icon: CalendarDays, href: "/interviews" },
  { label: "AI Practice", icon: MessageSquare, href: "/mock-interviews" },
  { label: "Analytics", icon: BarChart2, href: "/analytics" },
];

const bottomItems = [
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href =
      process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000/login";
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col overflow-hidden glass sidebar-transition hidden md:flex"
    >
      {/* Logo — name only, theme toggle top-right */}
      <div className="flex items-center h-16 px-4 border-b border-border shrink-0">
        <AnimatePresence>
          {!collapsed ? (
            <motion.div
              key="expanded-header"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-between w-full gap-2 overflow-hidden"
            >
              {/* Project name only — no icon */}
              <span className="font-black text-base tracking-tight text-foreground whitespace-nowrap leading-none">
                Auto<span className="text-primary">Apply</span>
                <span className="text-primary font-black">.AI</span>
              </span>
              {/* Theme toggle top-right */}
              <div className="shrink-0">
                <ThemeToggle />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-header"
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

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group overflow-hidden
                ${isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {!isActive && (
                <div className="absolute inset-0 bg-muted rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              )}
              <item.icon
                className={`w-[18px] h-[18px] relative z-10 shrink-0 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
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
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 space-y-1 border-t border-border pt-3 shrink-0">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group overflow-hidden
                ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}
              `}
            >
              {!isActive && (
                <div className="absolute inset-0 bg-muted rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              )}
              <item.icon className="w-[18px] h-[18px] relative z-10 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

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
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.aside>
  );
}
