"use server";

import { getDb, saveDb } from "@/lib/db";
import { getCurrentUser } from "./auth";
import { revalidatePath } from "next/cache";

export async function getAdminStats() { 
  const db = getDb();
  
  const totalUsers = db.users.length;
  const openTickets = db.tickets.filter((t: any) => t.status === "open").length;
  const resolvedTickets = db.tickets.filter((t: any) => t.status === "resolved").length;
  
  return { totalUsers, openTickets, resolvedTickets };
}

export async function getAllUsers() {
  const db = getDb();
  // Strip out passwords before sending to the client
  return db.users.map((u: any) => {
    const { password, ...safeUser } = u;
    return safeUser;
  });
}

export async function getAllTickets() {
  const db = getDb();
  return db.tickets;
}

export async function updateTicketStatusAction(ticketId: string, status: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return { error: "Unauthorized" };

  const db = getDb();
  const ticket = db.tickets.find((t: any) => t.id === ticketId);
  
  if (!ticket) return { error: "Ticket not found" };
  
  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();
  saveDb(db);
  
  revalidatePath("/admin");
  revalidatePath("/admin/tickets");
  revalidatePath("/dashboard"); // Also update user view
  
  return { success: true };
}

export async function createAdminUserAction(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.isRoot) return { error: "Unauthorized: Root access required" };

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const db = getDb();
  if (db.users.find((u: any) => u.email === email)) {
    return { error: "Email already exists" };
  }

  const newAdmin = {
    id: Date.now().toString(),
    email,
    password, // Plain text for local dev db only
    name,
    role: "admin",
    photo: "",
    phone: "",
    company: "",
    timezone: "UTC"
  };

  db.users.push(newAdmin);
  saveDb(db);

  revalidatePath("/admin/management");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function adminLoginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const db = getDb();
  const user = db.users.find((u: any) => u.email === email && u.password === password);

  if (user) {
    // If they are the very first user in the DB, they are the root admin.
    // If their role wasn't set to admin (e.g. created before admin update), upgrade them now.
    if (db.users[0].id === user.id && user.role !== "admin") {
      user.role = "admin";
      saveDb(db);
    }

    if (user.role !== "admin") {
      return { error: "Access Denied: You are not an admin." };
    }
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.set("auth_session", user.id, { httpOnly: true, secure: true, path: "/" });
    
    // Redirect to admin dashboard
    const { redirect } = await import("next/navigation");
    redirect("/admin");
  } else {
    return { error: "Invalid email or password." };
  }
}
