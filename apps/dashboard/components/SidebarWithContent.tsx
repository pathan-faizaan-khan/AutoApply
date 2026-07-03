"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Briefcase, FileText,
  CalendarDays, User, MessageSquare,
  LogOut, ChevronLeft, ChevronRight, UserCheck, Mail, History,
  Trophy
} from "lucide-react";
import { ThemeToggle } from "./ui/ThemeToggle";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

const NAV: NavItem[] = [
  { label: "Overview",         icon: LayoutDashboard, href: "/" },
  { label: "Resume",          icon: FileText,        href: "/resume" },
  { label: "Jobs",             icon: Briefcase,       href: "/jobs" },
  { label: "Outreach",        icon: UserCheck,       href: "/referrals" },
  { label: "Cold Mail",       icon: Mail,            href: "/cold-mail" },
  { label: "Selected", icon: Trophy, href: "/selected" },
  { label: "Outreach History",icon: History,         href: "/history" },
  { label: "Interviews",      icon: CalendarDays,    href: "/interviews" },
  { label: "AI Practice",     icon: MessageSquare,   href: "/mock-interviews" },
];

const BOTTOM: NavItem[] = [
  { label: "Profile", icon: User, href: "/profile" },
];

const EXPANDED = 240;
const COLLAPSED = 68;

// Mobile tabs shown in bottom bar
const MOBILE_TABS: NavItem[] = [NAV[0]!, NAV[1]!, NAV[2]!, BOTTOM[0]!];

function NavLink({ item, collapsed, isActive }: { item: NavItem; collapsed: boolean; isActive: boolean }) {
  const Icon = item.icon;
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
        <div className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
      <Icon className={`w-[18px] h-[18px] relative z-10 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
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
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();
  const sidebarW = collapsed ? COLLAPSED : EXPANDED;

  // Detect desktop after mount to avoid SSR mismatch
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auth check — runs only on client
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      window.location.href = process.env.NEXT_PUBLIC_LANDING_URL || "https://autoapply-web-ochre.vercel.app/login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = process.env.NEXT_PUBLIC_LANDING_URL || "https://autoapply-web-ochre.vercel.app/login";
  };

  // Only offset on desktop — avoids window.innerWidth during SSR
  const contentMargin = isDesktop ? sidebarW + 16 : 0;

  return (
    <div className="flex h-full bg-background relative overflow-hidden">
      {/* ── Background Gradients ── */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Desktop Sidebar (Floating Glass Pill) ── */}
      <motion.aside
        animate={{ width: sidebarW }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-4 top-4 bottom-4 z-50 flex-col glass rounded-[32px] overflow-hidden hidden md:flex shrink-0 shadow-2xl"
      >
        {/* Logo */}
        <div className="flex items-center h-[72px] px-5 border-b border-black/5 dark:border-white/5 shrink-0">
          <AnimatePresence>
            {!collapsed ? (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-between w-full gap-2 overflow-hidden"
              >
                <span className="font-bold text-[17px] tracking-tight text-foreground whitespace-nowrap leading-none">
                  Auto<span className="text-primary">Apply</span>
                </span>
                <div className="shrink-0"><ThemeToggle /></div>
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
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
          {NAV.map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} isActive={pathname === item.href} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 pt-4 border-t border-black/5 dark:border-white/5 shrink-0 space-y-1">
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
            className="w-full flex items-center justify-center py-2 mt-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </motion.aside>

      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 ios-tab-bar z-50 flex items-center justify-between px-4">
        <span className="font-bold text-[17px] tracking-tight text-foreground whitespace-nowrap leading-none">
          Auto<span className="text-primary">Apply</span>
        </span>
        <ThemeToggle />
      </div>

      {/* ── Mobile Bottom Tab Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[84px] ios-tab-bar z-50 flex items-center justify-around px-2 pb-6 pt-2">
        {MOBILE_TABS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center gap-1 w-16">
              <Icon className={`w-[22px] h-[22px] ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ── Main Content ── */}
      <motion.div
        animate={{ marginLeft: contentMargin }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 h-full overflow-y-auto min-w-0 pt-16 pb-[84px] md:pt-0 md:pb-0 z-10"
      >
        <div className="p-4 md:p-8 md:pl-6 h-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
