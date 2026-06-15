import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { redirect } from "next/navigation";
import TicketsList from "./TicketsList";

export default async function TicketsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  const db = getDb();
  // Filter tickets that belong to the current user
  // If the user is admin, they might see all tickets, but for now we assume a regular user dashboard
  const userTickets = db.tickets.filter((t: any) => t.userId === user.id);
  
  // Sort by newest first
  userTickets.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return <TicketsList tickets={userTickets} />;
}
