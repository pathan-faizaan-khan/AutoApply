"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function ApplicationsTable() {
  const applications = [
    { company: 'Google', role: 'Frontend Engineer', date: 'May 15, 2026', status: 'Applied', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { company: 'Meta', role: 'Software Engineer', date: 'May 12, 2026', status: 'Interviewing', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    { company: 'Stripe', role: 'Fullstack developer', date: 'May 10, 2026', status: 'Pending', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-secondary/30 border border-border rounded-3xl p-6 md:p-8 shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Active Applications</h2>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <th className="py-4 px-2">Company</th>
              <th className="py-4 px-2">Role</th>
              <th className="py-4 px-2">Date Applied</th>
              <th className="py-4 px-2">Status</th>
              <th className="py-4 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.map((row, idx) => (
              <motion.tr 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
                key={idx} 
                className="group hover:bg-secondary/50 transition-colors"
              >
                <td className="py-4 px-2 font-bold text-foreground">{row.company}</td>
                <td className="py-4 px-2 text-muted-foreground font-semibold text-sm">{row.role}</td>
                <td className="py-4 px-2 text-muted-foreground font-semibold text-sm">{row.date}</td>
                <td className="py-4 px-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${row.color}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-2 text-right">
                  <button className="text-sm font-bold text-primary hover:underline underline-offset-4">View Details</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
