"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Users, Ticket, Settings, LogOut, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const isRoot = user.id === "0"; // We'll set the root admin ID to "0" or just use email if preferred. We'll refine this. Let's just pass `user.isRoot`.
  // Wait, db.users[0] could be root. We'll compute `user.isRoot` in the backend and pass it.

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Tickets", href: "/admin/tickets", icon: Ticket },
  ];

  if (user.isRoot) {
    navItems.push({ name: "Management", href: "/admin/management", icon: Settings });
  }

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-64 border-r border-[var(--color-border)] glass-panel flex flex-col h-screen sticky top-0 z-20"
    >
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-500/20 blur-md" />
          <ShieldAlert className="w-6 h-6 text-purple-400 relative z-10" />
        </div>
        <div>
          <span className="font-bold text-xl tracking-tight block">GGNODES</span>
          <span className="text-[10px] uppercase font-bold text-purple-400 tracking-widest">Admin Portal</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[inset_0_0_15px_rgba(168,85,247,0.1)]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-border)]/50 hover:text-[var(--color-text-main)] border border-transparent"}`}>
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div layoutId="activeAdminNav" className="absolute left-0 w-1 h-8 bg-purple-500 rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--color-border)]">
        <form action={logoutAction}>
          <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-500 border border-transparent hover:border-red-500/20 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </form>
      </div>
    </motion.aside>
  );
}
