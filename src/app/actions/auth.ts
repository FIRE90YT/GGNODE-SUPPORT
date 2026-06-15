"use server";

import { getDb, saveDb } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const db = getDb();
  const user = db.users.find((u: any) => u.email === email && u.password === password);

  if (user) {
    const cookieStore = await cookies();
    cookieStore.set("auth_session", user.id, { httpOnly: true, secure: true, path: "/" });
    redirect("/dashboard");
  } else {
    return { error: "Invalid email or password." };
  }
}

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const db = getDb();
  if (db.users.find((u: any) => u.email === email)) {
    return { error: "Email already in use." };
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password, // Storing in plain text as per simple local DB requirement
    role: "user"
  };

  db.users.push(newUser);
  saveDb(db);

  const cookieStore = await cookies();
  cookieStore.set("auth_session", newUser.id, { httpOnly: true, secure: true, path: "/" });
  
  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  redirect("/login");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;
  if (!sessionId) return null;

  try {
    const db = getDb();
    const dbUser = db.users.find((u: any) => u.id === sessionId);
    
    if (dbUser) {
      // Determine if they are the root admin (the very first user ever created)
      const isRoot = db.users.length > 0 && db.users[0].id === dbUser.id;
      return { ...dbUser, isRoot };
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

export async function updateProfileAction(formData: FormData) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;
  if (!sessionId) return { error: "Not authenticated" };

  const db = getDb();
  const userIndex = db.users.findIndex((u: any) => u.id === sessionId);
  if (userIndex === -1) return { error: "User not found" };

  const name = formData.get("name") as string;
  const photo = formData.get("photo") as string;
  const phone = formData.get("phone") as string;
  const company = formData.get("company") as string;
  const timezone = formData.get("timezone") as string;
  const password = formData.get("password") as string;

  if (name) db.users[userIndex].name = name;
  if (photo) db.users[userIndex].photo = photo;
  if (phone) db.users[userIndex].phone = phone;
  if (company) db.users[userIndex].company = company;
  if (timezone) db.users[userIndex].timezone = timezone;
  if (password) db.users[userIndex].password = password; // Only update if provided

  saveDb(db);
  return { success: true };
}
