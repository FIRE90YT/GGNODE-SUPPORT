"use client";

import { useState, useTransition, useRef } from "react";
import { motion } from "framer-motion";
import { User, Lock, Mail, ShieldAlert, Save, Loader2, Key, Image as ImageIcon, Phone, Building, Globe } from "lucide-react";
import { updateProfileAction } from "@/app/actions/auth";

export default function SettingsForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMsg("");
    
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.success) {
        setSuccessMsg("Settings updated successfully.");
        // Clear password fields after update
        if (formRef.current) {
          const pass1 = formRef.current.querySelector('input[name="password"]') as HTMLInputElement;
          const pass2 = formRef.current.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
          if (pass1) pass1.value = "";
          if (pass2) pass2.value = "";
        }
      } else {
        setSuccessMsg(result.error || "Failed to update settings.");
      }
    });
  };

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-[var(--color-text-muted)]">Manage your account preferences, profile details, and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Info Card (Left Column) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="colorful-border rounded-3xl overflow-hidden">
            <div className="bg-[var(--color-bg-panel)]/80 backdrop-blur-xl p-8 flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(0,240,255,0.2)] relative overflow-hidden group">
                {user.photo ? (
                  <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-[var(--color-brand)]" />
                )}
                
                {user.role === "admin" && (
                  <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white p-1.5 rounded-full border border-purple-300 z-10">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{user.name || user.email.split('@')[0]}</h2>
              <p className="text-[var(--color-text-muted)] text-sm mb-5">{user.email}</p>
              
              <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border bg-black/40 border-[var(--color-border)] inline-block">
                Role: <span className={user.role === "admin" ? "text-purple-400" : "text-[var(--color-brand)]"}>{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Forms (Right Column) */}
        <div className="lg:col-span-2">
          <div className="colorful-border rounded-3xl overflow-hidden">
            <div className="bg-[var(--color-bg-panel)]/80 backdrop-blur-xl p-8">
              <form ref={formRef} onSubmit={handleUpdate} className="space-y-8">
                
                {/* Profile Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border)]">
                    <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                      <User className="w-5 h-5 text-[var(--color-brand)]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Public Profile</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5 ml-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-[var(--color-text-muted)]" />
                        </div>
                        <input 
                          type="text" 
                          name="name"
                          defaultValue={user.name}
                          placeholder="e.g., John Doe"
                          className="w-full pl-11 pr-4 py-3 bg-black/20 border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors text-white placeholder-[var(--color-text-muted)]/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5 ml-1">Profile Photo URL</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <ImageIcon className="h-5 w-5 text-[var(--color-text-muted)]" />
                        </div>
                        <input 
                          type="url" 
                          name="photo"
                          defaultValue={user.photo}
                          placeholder="https://example.com/photo.jpg"
                          className="w-full pl-11 pr-4 py-3 bg-black/20 border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors text-white placeholder-[var(--color-text-muted)]/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5 ml-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-[var(--color-text-muted)]" />
                        </div>
                        <input 
                          type="tel" 
                          name="phone"
                          defaultValue={user.phone}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-11 pr-4 py-3 bg-black/20 border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors text-white placeholder-[var(--color-text-muted)]/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5 ml-1">Company</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-[var(--color-text-muted)]" />
                        </div>
                        <input 
                          type="text" 
                          name="company"
                          defaultValue={user.company}
                          placeholder="e.g., Acme Corp"
                          className="w-full pl-11 pr-4 py-3 bg-black/20 border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors text-white placeholder-[var(--color-text-muted)]/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="pt-4">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border)]">
                    <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Security & Account</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5 ml-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-[var(--color-text-muted)]" />
                        </div>
                        <input 
                          type="email" 
                          value={user.email}
                          disabled
                          className="w-full pl-11 pr-4 py-3 bg-black/40 border border-[var(--color-border)] rounded-2xl text-[var(--color-text-muted)] cursor-not-allowed opacity-70"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5 ml-1">Timezone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-[var(--color-text-muted)]" />
                        </div>
                        <select 
                          name="timezone"
                          defaultValue={user.timezone || "UTC"}
                          className="w-full pl-11 pr-4 py-3 bg-black/20 border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors text-white appearance-none"
                        >
                          <option value="UTC" className="bg-[#0f0a19]">UTC</option>
                          <option value="EST" className="bg-[#0f0a19]">Eastern Time (EST)</option>
                          <option value="CST" className="bg-[#0f0a19]">Central Time (CST)</option>
                          <option value="PST" className="bg-[#0f0a19]">Pacific Time (PST)</option>
                          <option value="GMT" className="bg-[#0f0a19]">Greenwich Mean Time (GMT)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5 ml-1">New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Key className="h-5 w-5 text-[var(--color-text-muted)]" />
                        </div>
                        <input 
                          type="password" 
                          name="password"
                          placeholder="Leave blank to keep current"
                          className="w-full pl-11 pr-4 py-3 bg-black/20 border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors text-white placeholder-[var(--color-text-muted)]/50"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5 ml-1">Confirm New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Key className="h-5 w-5 text-[var(--color-text-muted)]" />
                        </div>
                        <input 
                          type="password" 
                          name="confirmPassword"
                          placeholder="Confirm new password"
                          className="w-full pl-11 pr-4 py-3 bg-black/20 border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors text-white placeholder-[var(--color-text-muted)]/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {successMsg && (
                  <div className={`p-4 rounded-2xl text-sm flex items-center gap-2 ${successMsg.includes("success") ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
                    <ShieldAlert className="w-4 h-4" /> {successMsg}
                  </div>
                )}

                <div className="pt-4 flex justify-end border-t border-[var(--color-border)]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 bg-[var(--color-brand)] text-[var(--color-bg-base)] px-8 py-3.5 rounded-2xl font-bold hover:bg-[#00c3ff] shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all disabled:opacity-70 text-lg"
                  >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isPending ? "Saving..." : "Save Changes"}
                  </motion.button>
                </div>

              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
