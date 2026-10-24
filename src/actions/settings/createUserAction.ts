"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { sanitizeError, formatActionErrorResult } from "@/lib/errors";
import { provisionAuthUser } from "./provisionAuthUser";
import { validateCreateUserInput } from "./validateCreateUserInput";

export type CreateUserInput = {
  fullName: string;
  email: string;
  password: string;
  jobTitle?: string | null;
  departmentId?: string | null;
  roleKey: string;
};

export async function createUserAction(input: CreateUserInput) {
  try {
    const profile = await getCurrentProfile();
    const schoolId = profile?.school_id;
    if (!schoolId) {
      return { success: false, error: "No school associated with profile" };
    }

    const allowed = await hasPermission("users.manage", schoolId);
    if (!allowed) {
      return { success: false, error: "Unauthorized" };
    }

    const val = validateCreateUserInput(
      input.fullName,
      input.email,
      input.password,
      input.roleKey || "staff",
    );
    if (!val.valid) {
      return { success: false, error: val.error };
    }

    const res = await provisionAuthUser({
      fullName: val.trimmedName,
      email: val.trimmedEmail,
      password: input.password,
      jobTitle: input.jobTitle,
      departmentId: input.departmentId,
      roleKey: input.roleKey || "staff",
      schoolId,
      callerId: profile.id,
    });

    if (res.success) {
      revalidatePath("/[locale]/settings/users", "page");
    }
    return res;
  } catch (err: unknown) {
    const sanitized = sanitizeError(err, { action: "createUserAction", email: input.email });
    return formatActionErrorResult(sanitized);
  }
}
