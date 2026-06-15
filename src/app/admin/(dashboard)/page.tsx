import { getAdminStats, getAllTickets } from "@/app/actions/admin";
import { Users, Ticket, CheckCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();
  const allTickets = await getAllTickets();
  
  const recentTickets = allTickets.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Platform Overview</h1>
        <p className="text-purple-400">High-level statistics and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="colorful-border rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-24 h-24" />
          </div>
          <p className="text-[var(--color-text-muted)] font-medium mb-1">Total Users</p>
          <p className="text-4xl font-bold text-white">{stats.totalUsers}</p>
        </div>

        <div className="colorful-border rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Ticket className="w-24 h-24" />
          </div>
          <p className="text-[var(--color-text-muted)] font-medium mb-1">Open Tickets</p>
          <p className="text-4xl font-bold text-white">{stats.openTickets}</p>
        </div>

        <div className="colorful-border rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckCircle className="w-24 h-24" />
          </div>
          <p className="text-[var(--color-text-muted)] font-medium mb-1">Resolved Tickets</p>
          <p className="text-4xl font-bold text-white">{stats.resolvedTickets}</p>
        </div>
      </div>

      <div className="colorful-border rounded-3xl overflow-hidden mt-8">
        <div className="bg-[var(--color-bg-panel)]/80 backdrop-blur-xl p-6 border-b border-[var(--color-border)] flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-purple-400" />
            Recent Tickets
          </h2>
          <Link href="/admin/tickets" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
            View All →
          </Link>
        </div>
        
        <div className="p-6">
          {recentTickets.length === 0 ? (
            <div className="text-center py-10 text-[var(--color-text-muted)]">No tickets found on the platform.</div>
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket: any) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-[var(--color-border)] hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${ticket.status === 'open' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{ticket.title}</h3>
                      <p className="text-xs text-[var(--color-text-muted)]">By {ticket.authorName} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-md border capitalize ${
                      ticket.status === 'pending'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : ticket.status === 'open' 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                          : 'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}>
                      {ticket.status}
                    </span>
                    <Link href={`/admin/tickets?view-ticket=${ticket.id}`} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
