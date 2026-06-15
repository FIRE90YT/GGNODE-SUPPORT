"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Ticket, FileText, Settings, LogOut, Server } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import CreateTicketModal from "@/components/CreateTicketModal";
import ViewTicketModal from "@/components/ViewTicketModal";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Tickets", href: "/dashboard/tickets", icon: Ticket },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] flex text-[var(--color-text-main)] font-sans">
      {/* Left Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-64 border-r border-[var(--color-border)] glass-panel flex flex-col h-screen sticky top-0 z-20"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-[var(--color-brand)]/20 rounded-xl">
            <Server className="w-6 h-6 text-[var(--color-brand)]" />
          </div>
          <span className="font-bold text-xl tracking-tight">GGNODES</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-border)]/50 hover:text-[var(--color-text-main)]"}`}>
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-8 bg-[var(--color-brand)] rounded-r-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </form>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-brand)]/5 blur-[150px] rounded-full pointer-events-none -z-10" />
        
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>

        <Suspense fallback={null}>
          <CreateTicketModal />
          <ViewTicketModal />
        </Suspense>
      </main>
    </div>
  );
}
