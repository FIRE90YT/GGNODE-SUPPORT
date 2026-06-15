import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import AdminSidebar from "./AdminSidebar";
import ViewTicketModal from "@/components/ViewTicketModal";
import { Suspense } from "react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/admin/login");
  }

  if (user.role !== "admin") {
    // If a regular user tries to access the admin panel, kick them back to their dashboard
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] flex text-[var(--color-text-main)] font-sans">
      <AdminSidebar user={user} />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        {/* Admin specific background glow (Purple/Red to differentiate from cyan user dashboard) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none -z-10" />
        
        <div className="p-8 flex-1 overflow-y-auto z-10">
          {children}
        </div>

        <Suspense fallback={null}>
          <ViewTicketModal />
        </Suspense>
      </main>
    </div>
  );
}
