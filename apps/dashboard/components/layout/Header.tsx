"use client";

import { Search, Bell, Menu } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex h-16 items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-4 md:hidden">
          <button className="p-2 text-foreground hover:bg-secondary rounded-xl transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 hidden md:flex">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Quick search..."
              className="pl-9 pr-4 py-2 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all font-medium text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button className="p-2.5 bg-secondary border border-border rounded-xl hover:bg-secondary/80 transition-all text-foreground">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="hidden md:flex items-center gap-3 pl-4 ml-2 border-l border-border">
            <div className="w-9 h-9 bg-gradient-to-tr from-primary to-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md">
              U
            </div>
            <div className="hidden lg:block text-sm">
              <p className="font-bold text-foreground">Test User</p>
              <p className="text-xs text-muted-foreground font-medium">test@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
