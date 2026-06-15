"use client";

import { motion } from "framer-motion";
import { Ticket as TicketIcon, Search, Plus, MessageSquarePlus, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TicketsList({ tickets }: { tickets: any[] }) {
  const [search, setSearch] = useState("");

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.id.includes(search)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case "open": return { icon: AlertCircle, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", label: "Open" };
      case "pending": return { icon: Clock, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", label: "Pending Reply" };
      case "resolved": return { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", label: "Resolved" };
      default: return { icon: TicketIcon, color: "text-gray-400", bg: "bg-gray-400/10", border: "border-gray-400/20", label: status };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-main)]">My Tickets</h1>
          <p className="text-[var(--color-text-muted)] mt-1">View and manage your support history.</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-brand)] transition-colors" />
            <input 
              type="text" 
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[var(--color-bg-panel)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/50 focus:border-[var(--color-brand)] transition-all w-full sm:w-64"
            />
          </div>
          <Link href="?modal=create-ticket">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-brand)] text-white text-sm font-medium rounded-xl border border-white/10 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> New Ticket
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Ticket List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="colorful-border rounded-3xl overflow-hidden mt-6"
      >
        {filteredTickets.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-full bg-[var(--color-bg-base)] border border-[var(--color-border)] flex items-center justify-center mb-6 shadow-inner"
            >
              <MessageSquarePlus className="w-10 h-10 text-[var(--color-text-muted)]/50" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">No tickets found</h3>
            <p className="text-[var(--color-text-muted)] max-w-sm mx-auto">
              {search ? "We couldn't find any tickets matching your search." : "You haven't opened any support tickets yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filteredTickets.map((ticket) => {
              const status = getStatusConfig(ticket.status);
              const StatusIcon = status.icon;
              
              return (
                <Link key={ticket.id} href={`?view-ticket=${ticket.id}`}>
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.02)", x: 4 }}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-2 rounded-xl ${status.bg} ${status.color} border ${status.border}`}>
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[var(--color-text-main)] group-hover:text-[var(--color-brand)] transition-colors line-clamp-1">
                          {ticket.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[var(--color-text-muted)]">
                          <span className="font-mono bg-[var(--color-bg-base)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                            #{ticket.id}
                          </span>
                          <span>Opened on {new Date(ticket.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                          <span>•</span>
                          <span>Last updated {new Date(ticket.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-14 sm:pl-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.border} ${status.color} ${status.bg}`}>
                        {status.label}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
