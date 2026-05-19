"use client";

import { useEffect, useState } from 'react';
import { 
  Sparkles, 
  LogOut, 
  FileText, 
  Send, 
  CheckCircle, 
  Briefcase, 
  Plus, 
  TrendingUp, 
  Compass, 
  Settings, 
  User as UserIcon, 
  Bell, 
  Search,
  ArrowUpRight
} from 'lucide-react';

interface User {
  id: number;
  email: string;
  name: string;
}

export default function DashboardHome() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3000';

  useEffect(() => {
    // 1. Check URL for token
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');

    let activeToken = urlToken;

    if (urlToken) {
      // Save it
      localStorage.setItem('token', urlToken);
      // Clean the URL without reloading
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } else {
      // Check localStorage
      activeToken = localStorage.getItem('token');
    }

    if (!activeToken) {
      // Redirect back to landing page login
      window.location.href = `${landingUrl}/login`;
      return;
    }

    setToken(activeToken);

    // Mock/Fetch user details from token (decode JWT or call an API)
    // Since we don't have a verify route right now, we can extract from token payload or mock
    try {
      const base64Url = activeToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      setUser({
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name || 'Professional User',
      });
    } catch (e) {
      // Fallback
      setUser({
        id: 1,
        email: 'user@example.com',
        name: 'Professional User',
      });
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = `${landingUrl}/login`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-semibold text-muted-foreground animate-pulse">Initializing smart session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1e1e24] bg-[#0c0c0e] p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight">Auto Apply</span>
              <span className="text-primary font-black text-lg">.AI</span>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { icon: Briefcase, label: 'Applications', active: true },
              { icon: Compass, label: 'Job Search', active: false },
              { icon: FileText, label: 'Resumes', active: false },
              { icon: Settings, label: 'Settings', active: false },
            ].map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
                  item.active 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-muted-foreground hover:bg-[#151518] hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#1e1e24] space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-blue-600 rounded-xl flex items-center justify-center font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-red-500/10 transition-all text-sm"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Welcome back, {user?.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground mt-1 font-medium">Here's what's happening with your job search today.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Quick search..."
                className="pl-9 pr-4 py-2 bg-[#121214] border border-[#1e1e24] rounded-xl text-sm focus:outline-none focus:border-primary w-48 transition-all font-semibold"
              />
            </div>
            <button className="p-3 bg-[#121214] border border-[#1e1e24] rounded-xl hover:bg-[#18181c] transition-all">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={handleLogout}
              className="md:hidden p-3 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {[
            { label: 'Total Applications', val: '42', icon: Briefcase, color: 'text-primary bg-primary/10 border-primary/20' },
            { label: 'Pending Response', val: '18', icon: Send, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
            { label: 'Interviews Scheduled', val: '4', icon: TrendingUp, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
            { label: 'Success Verification', val: '98%', icon: CheckCircle, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#0c0c0e] border border-[#1e1e24] p-6 rounded-2xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl border ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  +12% <ArrowUpRight className="w-3 h-3 text-green-400" />
                </span>
              </div>
              <p className="text-3xl font-black tracking-tight">{stat.val}</p>
              <p className="text-xs text-muted-foreground font-bold mt-2 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Dynamic section: Active applications */}
        <section className="bg-[#0c0c0e] border border-[#1e1e24] rounded-3xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Active Applications</h2>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg">
              <Plus className="w-4 h-4" /> Add Application
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1e1e24] text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="py-4">Company</th>
                  <th className="py-4">Role</th>
                  <th className="py-4">Date Applied</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]/50">
                {[
                  { company: 'Google', role: 'Frontend Engineer', date: 'May 15, 2026', status: 'Applied', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                  { company: 'Meta', role: 'Software Engineer', date: 'May 12, 2026', status: 'Interviewing', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                  { company: 'Stripe', role: 'Fullstack developer', date: 'May 10, 2026', status: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' }
                ].map((row, idx) => (
                  <tr key={idx} className="group hover:bg-[#121214]/30 transition-colors">
                    <td className="py-4 font-bold">{row.company}</td>
                    <td className="py-4 text-muted-foreground font-semibold text-sm">{row.role}</td>
                    <td className="py-4 text-muted-foreground font-semibold text-sm">{row.date}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-sm font-bold text-primary hover:underline">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
