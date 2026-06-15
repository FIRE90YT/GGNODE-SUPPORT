import { getCurrentUser } from "@/app/actions/auth";
import { getAllUsers } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import AdminCreationForm from "./AdminCreationForm";
import { ShieldAlert, User, ShieldCheck } from "lucide-react";

export default async function AdminManagementPage() {
  const user = await getCurrentUser();
  
  if (!user || !user.isRoot) {
    redirect("/admin"); // Redirect non-root admins back to overview
  }

  const allUsers = await getAllUsers();
  const adminUsers = allUsers.filter((u: any) => u.role === "admin");

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-red-500" />
          Root Management
        </h1>
        <p className="text-[var(--color-text-muted)]">Exclusive access for the Root Administrator. Manage platform administrators.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AdminCreationForm />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="colorful-border rounded-2xl overflow-hidden bg-[var(--color-bg-panel)]">
            <div className="p-6 border-b border-[var(--color-border)] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Current Administrators</h2>
            </div>
            
            <div className="divide-y divide-[var(--color-border)]">
              {adminUsers.map((admin: any) => (
                <div key={admin.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 overflow-hidden bg-purple-500/10 flex items-center justify-center">
                      {admin.photo ? (
                        <img src={admin.photo} alt={admin.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-purple-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white flex items-center gap-2">
                        {admin.name || "Unnamed Admin"}
                        {admin.email === user.email && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 rounded-md border border-red-500/30">You (Root)</span>
                        )}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)]">{admin.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[var(--color-text-muted)]">ID: {admin.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
