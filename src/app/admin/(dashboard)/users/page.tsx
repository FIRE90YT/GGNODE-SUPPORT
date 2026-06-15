import { getAllUsers } from "@/app/actions/admin";
import { User, Mail, Phone, Building, Globe, ShieldAlert } from "lucide-react";
import Image from "next/image";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">User Directory</h1>
        <p className="text-[var(--color-text-muted)]">View and manage all registered users on the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u: any) => (
          <div key={u.id} className="colorful-border rounded-2xl overflow-hidden flex flex-col group">
            <div className="bg-[var(--color-bg-panel)] p-6 flex flex-col items-center flex-1">
              <div className="w-20 h-20 rounded-full border-2 border-purple-500/50 p-1 mb-4 relative shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                {u.photo ? (
                  <img src={u.photo} alt={u.name || "User"} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-purple-500/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-purple-400" />
                  </div>
                )}
                
                {u.role === "admin" && (
                  <div className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-1 border border-purple-400/50 shadow-lg">
                    <ShieldAlert className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-white text-center">{u.name || "Unnamed User"}</h3>
              {u.role === "admin" ? (
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest mt-1">Admin</span>
              ) : (
                <span className="text-xs font-medium text-[var(--color-text-muted)] mt-1">Standard User</span>
              )}

              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                  <Mail className="w-4 h-4 text-purple-400/70" />
                  <span className="truncate">{u.email}</span>
                </div>
                
                {u.phone && (
                  <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                    <Phone className="w-4 h-4 text-purple-400/70" />
                    <span>{u.phone}</span>
                  </div>
                )}
                
                {u.company && (
                  <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                    <Building className="w-4 h-4 text-purple-400/70" />
                    <span className="truncate">{u.company}</span>
                  </div>
                )}
                
                {u.timezone && (
                  <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                    <Globe className="w-4 h-4 text-purple-400/70" />
                    <span>{u.timezone}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-black/30 p-4 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)] group-hover:bg-purple-500/10 transition-colors">
              User ID: {u.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
