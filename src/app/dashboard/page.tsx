"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { TicketCheck, MessageSquarePlus, Clock, CheckCircle2, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    { label: "Open Tickets", value: "0", icon: TicketCheck, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "bg-blue-500" },
    { label: "Pending Replies", value: "0", icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", glow: "bg-orange-500" },
    { label: "Resolved", value: "0", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", glow: "bg-green-500" },
  ];

  const recentTickets: any[] = []; 

  // Mouse tracking for Glare Effect on Button
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePos({ x, y });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-main)]">Support Overview</h1>
          <p className="text-[var(--color-text-muted)] mt-2">Manage your support requests and track their status.</p>
        </div>
        <Link href="?modal=create-ticket">
          <motion.button 
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center gap-2 px-6 py-3 bg-[var(--color-brand)] text-white font-medium rounded-xl border border-white/10 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all overflow-hidden"
          >
            {/* Dynamic Glare Effect that follows mouse */}
            <div 
              className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`
              }}
            />
            {/* Ambient inner glow */}
            <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-xl z-0 pointer-events-none" />
            
            <Plus className="w-5 h-5 relative z-10 drop-shadow-md" />
            <span className="relative z-10 drop-shadow-md">Create Ticket</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.4)" 
              }}
              className={`relative p-6 rounded-3xl colorful-border overflow-hidden group cursor-pointer`}
            >
              {/* Dynamic background glow on hover */}
              <div className={`absolute -inset-x-20 -bottom-20 h-40 ${stat.glow}/0 group-hover:${stat.glow}/20 blur-3xl transition-colors duration-500 rounded-full z-0`} />
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider group-hover:text-white transition-colors">{stat.label}</p>
                  <motion.p 
                    className="text-4xl font-bold mt-2 text-[var(--color-text-main)] group-hover:text-white transition-colors"
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div 
                  whileHover={{ rotate: 15, scale: 1.15 }}
                  className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-inner transition-colors group-hover:bg-opacity-20`}
                >
                  <Icon className="w-7 h-7" />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity / Tickets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.1)" }}
        className="rounded-3xl colorful-border overflow-hidden transition-all duration-300 mt-12"
      >
        <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-black/10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Recent Tickets
          </h2>
          <Link href="/dashboard/tickets">
            <motion.div 
              whileHover={{ x: 5 }}
              className="text-sm font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] flex items-center gap-1 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-[var(--color-brand)]/10"
            >
              View All <ChevronRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </div>

        {recentTickets.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[var(--color-bg-base)] to-[var(--color-bg-panel)] border border-[var(--color-border)] flex items-center justify-center mb-6 shadow-2xl"
            >
              <div className="absolute inset-0 bg-[var(--color-brand)]/10 blur-xl rounded-[2rem]" />
              <MessageSquarePlus className="w-10 h-10 text-[var(--color-text-muted)] relative z-10" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-3">No tickets yet</h3>
            <p className="text-[var(--color-text-muted)] max-w-md mx-auto text-lg leading-relaxed">
              You haven't opened any support requests. If you need help with your hosting services, our team is ready to assist you.
            </p>
            <Link href="?modal=create-ticket">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5 text-[var(--color-brand)]" /> Open your first ticket
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {/* Ticket list will go here */}
          </div>
        )}
      </motion.div>
    </div>
  );
}
