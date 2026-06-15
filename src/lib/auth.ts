import { cookies } from "next/headers";
import { getDb } from "@/lib/db";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;
  if (!sessionId) return null;
  
  const db = getDb();
  return db.users.find((u: any) => u.id === sessionId) || null;
}
