"use server";

import { getDb, saveDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createTicketAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const discordUsername = formData.get("discordUsername") as string;
  // Handling files is complex for a simple JSON db, so we'll just store names or fake URLs for now
  const fileNames = formData.getAll("files").map((f: any) => f.name || "Unknown File").filter(n => n !== "Unknown File");

  const newTicket = {
    id: Math.random().toString(36).substr(2, 9).toUpperCase(),
    userId: user.id,
    authorName: user.name || user.email.split('@')[0],
    authorPhoto: user.photo || "",
    discordUsername,
    title,
    description,
    status: "pending",
    files: fileNames,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replies: []
  };

  const db = getDb();
  db.tickets.push(newTicket);
  saveDb(db);

  // Revalidate dashboard routes to show new data
  revalidatePath("/", "layout");

  return { success: true, ticketId: newTicket.id };
}

export async function getTicketById(id: string) {
  const db = getDb();
  return db.tickets.find((t: any) => t.id === id) || null;
}

export async function replyToTicketAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const ticketId = formData.get("ticketId") as string;
  const message = formData.get("message") as string;

  const db = getDb();
  const ticketIndex = db.tickets.findIndex((t: any) => t.id === ticketId);
  
  if (ticketIndex === -1) return { error: "Ticket not found" };

  const newReply = {
    id: Math.random().toString(36).substr(2, 9),
    authorName: user.name || user.email.split('@')[0],
    authorPhoto: user.photo || "",
    message,
    isAdmin: user.role === "admin",
    createdAt: new Date().toISOString()
  };

  db.tickets[ticketIndex].replies.push(newReply);
  db.tickets[ticketIndex].updatedAt = new Date().toISOString();
  // Change status to open if admin replies (awaiting user), or pending if user replies (needs attention)
  db.tickets[ticketIndex].status = user.role === "admin" ? "open" : "pending";
  
  saveDb(db);
  revalidatePath("/", "layout");

  return { success: true };
}
