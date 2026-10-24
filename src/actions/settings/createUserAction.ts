"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { provisionAuthUser } from "./provisionAuthUser";

export type CreateUserInput = {
  fullName: string;
  email: string;
  password: string;
  jobTitle?: string | null;
  departmentId?: string | null;
  roleKey: string;
};

export async function createUserAction(input: CreateUserInput) {
  const profile = await getCurrentProfile();
  const schoolId = profile?.school_id;
  if (!schoolId) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("users.manage", schoolId);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const trimmedName = input.fullName.trim();
  const trimmedEmail = input.email.trim().toLowerCase();
  const roleKey = input.roleKey || "staff";

  if (!trimmedName || !trimmedEmail.includes("@")) {
    return { success: false, error: "Valid full name and email are required" };
  }

  if (input.password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  if (roleKey === "owner") {
    return { success: false, error: "Cannot create platform owner" };
  }

  const res = await provisionAuthUser({
    fullName: trimmedName,
    email: trimmedEmail,
    password: input.password,
    jobTitle: input.jobTitle,
    departmentId: input.departmentId,
    roleKey,
    schoolId,
    callerId: profile.id,
  });

  if (res.success) {
    revalidatePath("/[locale]/settings/users", "page");
  }
  return res;
}
