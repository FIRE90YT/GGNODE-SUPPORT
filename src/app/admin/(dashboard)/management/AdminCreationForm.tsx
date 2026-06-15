"use client";

import { useState, useTransition } from "react";
import { UserPlus, Mail, Lock, User, Loader2 } from "lucide-react";
import { createAdminUserAction } from "@/app/actions/admin";

export default function AdminCreationForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;

    startTransition(async () => {
      const result = await createAdminUserAction(formData);
      if (result?.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: "Admin account created successfully!" });
        form.reset();
      }
    });
  };

  return (
    <div className="colorful-border rounded-2xl overflow-hidden bg-[var(--color-bg-panel)] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
      
      <div className="p-6 border-b border-[var(--color-border)] flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Create New Admin</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5 relative z-10">
        {message && (
          <div className={`p-3 rounded-xl border text-sm text-center ${
            message.type === 'error' 
              ? 'bg-red-500/10 border-red-500/20 text-red-400' 
              : 'bg-green-500/10 border-green-500/20 text-green-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--color-text-muted)] pl-1">Full Name</label>
          <div className="relative group/input">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-[var(--color-text-muted)] group-focus-within/input:text-purple-400 transition-colors" />
            </div>
            <input
              type="text"
              name="name"
              required
              className="block w-full pl-11 pr-4 py-2.5 bg-black/20 border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="Admin Name"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--color-text-muted)] pl-1">Email Address</label>
          <div className="relative group/input">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-[var(--color-text-muted)] group-focus-within/input:text-purple-400 transition-colors" />
            </div>
            <input
              type="email"
              name="email"
              required
              className="block w-full pl-11 pr-4 py-2.5 bg-black/20 border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="admin@ggnodes.com"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--color-text-muted)] pl-1">Temporary Password</label>
          <div className="relative group/input">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-[var(--color-text-muted)] group-focus-within/input:text-purple-400 transition-colors" />
            </div>
            <input
              type="password"
              name="password"
              required
              className="block w-full pl-11 pr-4 py-2.5 bg-black/20 border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50 mt-4"
        >
          {isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</>
          ) : (
            <><UserPlus className="w-4 h-4" /> Create Administrator</>
          )}
        </button>
      </form>
    </div>
  );
}
