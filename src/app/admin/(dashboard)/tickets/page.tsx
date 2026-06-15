import { getAllTickets } from "@/app/actions/admin";
import AdminTicketTabs from "./AdminTicketTabs";

export default async function AdminTicketsPage() {
  const tickets = await getAllTickets();
  // Sort by newest first
  const sortedTickets = tickets.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Support Tickets</h1>
        <p className="text-[var(--color-text-muted)]">Manage customer inquiries and track resolution times.</p>
      </div>

      <AdminTicketTabs initialTickets={sortedTickets} />
    </div>
  );
}
