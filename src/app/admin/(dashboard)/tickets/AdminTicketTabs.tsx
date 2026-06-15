"use client";

import { useState, useEffect } from "react";
import { Ticket, CheckCircle, Search, MoreVertical, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { updateTicketStatusAction } from "@/app/actions/admin";

export default function AdminTicketTabs({ initialTickets }: { initialTickets: any[] }) {
  const [activeTab, setActiveTab] = useState<"pending" | "open" | "resolved">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Realistically this would be refetched from server on update, but for this demo we'll just filter the prop
  // In a real app we'd use useRouter().refresh() after the server action
  const [tickets, setTickets] = useState(initialTickets);

  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  const filteredTickets = tickets.filter(t => 
    t.status === activeTab && 
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.authorName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleResolve = async (ticketId: string) => {
    await updateTicketStatusAction(ticketId, "resolved");
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: "resolved" } : t));
  };

  const handleReopen = async (ticketId: string) => {
    await updateTicketStatusAction(ticketId, "open");
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: "open" } : t));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex p-1 bg-black/40 border border-[var(--color-border)] rounded-xl w-max">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "pending" 
                ? "bg-purple-600 text-white shadow-lg" 
                : "text-[var(--color-text-muted)] hover:text-white hover:bg-white/5"
            }`}
          >
            <Ticket className="w-4 h-4" />
            Pending
          </button>
          <button
            onClick={() => setActiveTab("open")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "open" 
                ? "bg-purple-600 text-white shadow-lg" 
                : "text-[var(--color-text-muted)] hover:text-white hover:bg-white/5"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Open
          </button>
          <button
            onClick={() => setActiveTab("resolved")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "resolved" 
                ? "bg-purple-600 text-white shadow-lg" 
                : "text-[var(--color-text-muted)] hover:text-white hover:bg-white/5"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Resolved
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-black/20 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white placeholder-[var(--color-text-muted)]"
          />
        </div>
      </div>

      {/* Ticket List */}
      <div className="colorful-border rounded-2xl overflow-hidden bg-[var(--color-bg-panel)]">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider bg-black/20">
          <div className="col-span-5">Ticket Info</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          <AnimatePresence mode="popLayout">
            {filteredTickets.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-12 text-center text-[var(--color-text-muted)]">
                No tickets found in this category.
              </motion.div>
            ) : (
              filteredTickets.map((ticket) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={ticket.id} 
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group"
                >
                  <div className="col-span-5 flex items-start gap-3">
                    <div className={`mt-0.5 w-2 h-2 rounded-full ${ticket.status === 'pending' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : ticket.status === 'open' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`} />
                    <div>
                      <h4 className="font-medium text-white truncate max-w-sm" title={ticket.title}>{ticket.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[var(--color-text-muted)]">
                        <MessageCircle className="w-3 h-3" />
                        {ticket.replies?.length || 0} Replies
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-3">
                    <div className="font-medium text-white text-sm">{ticket.authorName}</div>
                    {ticket.discordUsername && (
                      <div className="text-xs text-[#5865F2] mt-0.5">{ticket.discordUsername}</div>
                    )}
                  </div>
                  
                  <div className="col-span-2 text-sm text-[var(--color-text-muted)]">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    {activeTab !== "resolved" ? (
                      <button 
                        onClick={() => handleResolve(ticket.id)}
                        className="px-3 py-1.5 text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 rounded-lg transition-colors"
                      >
                        Resolve
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleReopen(ticket.id)}
                        className="px-3 py-1.5 text-xs font-medium bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg transition-colors"
                      >
                        Reopen
                      </button>
                    )}
                    
                    <Link 
                      href={`/admin/tickets?view-ticket=${ticket.id}`}
                      className="px-3 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors shadow-lg"
                    >
                      View
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
