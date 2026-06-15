"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, ShieldAlert, Paperclip, Loader2 } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getTicketById, replyToTicketAction } from "@/app/actions/tickets";

export default function ViewTicketModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const ticketId = searchParams.get("view-ticket");

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch ticket data when modal opens
  useEffect(() => {
    if (ticketId) {
      setLoading(true);
      getTicketById(ticketId).then((data) => {
        setTicket(data);
        setLoading(false);
        setTimeout(() => scrollToBottom(), 100);
      });
    } else {
      setTicket(null);
    }
  }, [ticketId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("view-ticket");
    router.push(`?${params.toString()}`);
  };

  const handleReply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ticket) return;
    const formData = new FormData(e.currentTarget);
    formData.append("ticketId", ticket.id);
    startTransition(async () => {
      const result = await replyToTicketAction(formData);
      if (result.success) {
        if (formRef.current) formRef.current.reset();
        // Refresh ticket data
        const updatedTicket = await getTicketById(ticket.id);
        setTicket(updatedTicket);
        setTimeout(() => scrollToBottom(), 100);
      }
    });
  };

  if (!ticketId) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="w-full max-w-3xl h-[85vh] colorful-border rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col relative z-10"
        >
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-[var(--color-brand)] mb-4" />
              <p className="text-[var(--color-text-muted)]">Loading ticket...</p>
            </div>
          ) : ticket ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-[var(--color-border)] bg-black/20">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-[var(--color-text-main)]">{ticket.title}</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--color-brand)]/20 text-[var(--color-brand)] border border-[var(--color-brand)]/30">
                      #{ticket.id}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">Status: <span className="font-medium text-white capitalize">{ticket.status}</span></p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-[var(--color-border)] text-[var(--color-text-muted)] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[var(--color-bg-base)]">
                {/* Initial Ticket Message */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                    <User className="w-5 h-5 text-[var(--color-brand)]" />
                  </div>
                  <div className="flex-1 max-w-[85%]">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-[var(--color-text-main)]">{ticket.authorName || "User"}</span>
                      {ticket.discordUsername && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/30 ml-1">
                          {ticket.discordUsername}
                        </span>
                      )}
                      <span className="text-xs text-[var(--color-text-muted)] font-medium tracking-wide">
                        {new Date(ticket.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "numeric" })}
                      </span>
                    </div>
                    <div className="p-5 rounded-2xl rounded-tl-sm bg-[var(--color-bg-panel)] border border-[var(--color-border)] text-[var(--color-text-main)] text-sm leading-relaxed whitespace-pre-wrap shadow-md">
                      {ticket.description}
                    </div>
                    
                    {/* Attachments if any */}
                    {ticket.files && ticket.files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {ticket.files.map((file: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-muted)] cursor-pointer hover:text-white hover:border-[var(--color-brand)]/50 transition-all">
                            <Paperclip className="w-3.5 h-3.5 text-[var(--color-brand)]" /> {file}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="h-px bg-[var(--color-border)] flex-1"></div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Thread Start</span>
                  <div className="h-px bg-[var(--color-border)] flex-1"></div>
                </div>

                {/* Replies */}
                {ticket.replies?.map((reply: any) => (
                  <div key={reply.id} className={`flex gap-4 ${!reply.isAdmin ? "flex-row-reverse" : ""}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${reply.isAdmin ? "bg-purple-500/10 border border-purple-500/30 text-purple-400" : "bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 text-[var(--color-brand)]"}`}>
                      {reply.isAdmin ? <ShieldAlert className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div className={`flex-1 flex flex-col max-w-[85%] ${!reply.isAdmin ? "items-end" : "items-start"}`}>
                      <div className={`flex items-baseline gap-2 mb-1 ${!reply.isAdmin ? "flex-row-reverse" : ""}`}>
                        <span className="font-semibold text-[var(--color-text-main)]">
                          {reply.isAdmin 
                            ? (pathname?.startsWith('/admin') ? `${reply.authorName} (Admin)` : "Support Team") 
                            : reply.authorName}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)] font-medium tracking-wide">
                          {new Date(reply.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "numeric" })}
                        </span>
                      </div>
                      <div className={`inline-block p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-md text-left ${
                        !reply.isAdmin 
                          ? "rounded-tr-sm bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/20 text-white" 
                          : "rounded-tl-sm bg-[var(--color-bg-panel)] border border-[var(--color-border)] text-[var(--color-text-main)]"
                      }`}>
                        {reply.message}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} className="h-2" />
              </div>

              {/* Reply Input Area */}
              <div className="p-5 border-t border-[var(--color-border)] bg-[var(--color-bg-base)]">
                <form ref={formRef} onSubmit={handleReply} className="flex flex-col gap-3">
                  <div className="relative flex items-end bg-[var(--color-bg-panel)] border border-[var(--color-border)] rounded-2xl p-2 focus-within:border-[var(--color-brand)] focus-within:ring-1 focus-within:ring-[var(--color-brand)] transition-all shadow-inner">
                    <button type="button" className="p-2.5 text-[var(--color-text-muted)] hover:text-white transition-colors shrink-0 rounded-xl hover:bg-white/5 mb-0.5">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <textarea 
                      name="message"
                      required
                      rows={1}
                      placeholder="Type your reply to the team..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-3 resize-none min-h-[44px] max-h-[150px] text-[var(--color-text-main)] placeholder-[var(--color-text-muted)]"
                      style={{ outline: 'none', boxShadow: 'none' }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (formRef.current) formRef.current.requestSubmit();
                        }
                      }}
                    />
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isPending}
                      className="p-2.5 bg-[var(--color-brand)] text-[var(--color-bg-base)] rounded-xl hover:bg-[#00c3ff] shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all shrink-0 mb-0.5 disabled:opacity-50 ml-2"
                    >
                      {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </motion.button>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
                      GGNODES Support Secure Chat
                    </p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      <kbd className="font-mono bg-[var(--color-border)]/50 px-1.5 py-0.5 rounded border border-[var(--color-border)]">Enter</kbd> to send
                    </p>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold">Ticket not found</h3>
              <p className="text-[var(--color-text-muted)] mt-2">This ticket may have been deleted or doesn't exist.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
