import { describe, expect, it, vi } from "vitest";
import { assertCanManageCalendar } from "./assertCanManageCalendar";
import { AuthenticationError } from "@/lib/errors/AuthenticationError";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";

vi.mock("@/lib/auth/getCurrentProfile", () => ({
  getCurrentProfile: vi.fn(),
}));

vi.mock("@/lib/auth/isPlatformOwner", () => ({
  isPlatformOwner: vi.fn(),
}));

vi.mock("@/lib/school/resolveSchoolForCaller", () => ({
  resolveSchoolForCaller: vi.fn(),
}));

vi.mock("@/lib/rbac/hasPermission", () => ({
  hasPermission: vi.fn(),
}));

import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { resolveSchoolForCaller } from "@/lib/school/resolveSchoolForCaller";
import { hasPermission } from "@/lib/rbac/hasPermission";

function makeProfile(partial: Partial<ProfileRow> & { id: string }): ProfileRow {
  return {
    full_name: "Test User",
    email: "test@example.com",
    job_title: null,
    school_id: null,
    department_id: null,
    is_active: true,
    ...partial,
  };
}

describe("assertCanManageCalendar", () => {
  it("throws AuthenticationError if profile is null", async () => {
    vi.mocked(getCurrentProfile).mockResolvedValue(null);
    await expect(assertCanManageCalendar()).rejects.toThrow(AuthenticationError);
  });

  it("throws AuthenticationError if no school can be resolved", async () => {
    vi.mocked(getCurrentProfile).mockResolvedValue(makeProfile({ id: "user-1", school_id: null }));
    vi.mocked(resolveSchoolForCaller).mockResolvedValue(null);
    await expect(assertCanManageCalendar()).rejects.toThrow(AuthenticationError);
  });

  it("throws ForbiddenError if caller lacks permission and is not owner", async () => {
    vi.mocked(getCurrentProfile).mockResolvedValue(
      makeProfile({
        id: "staff-1",
        school_id: "school-1",
        department_id: "dept-1",
      }),
    );
    vi.mocked(resolveSchoolForCaller).mockResolvedValue("school-1");
    vi.mocked(isPlatformOwner).mockResolvedValue(false);
    vi.mocked(hasPermission).mockResolvedValue(false);

    await expect(assertCanManageCalendar()).rejects.toThrow(ForbiddenError);
  });

  it("allows regular user with calendar.manage permission", async () => {
    vi.mocked(getCurrentProfile).mockResolvedValue(
      makeProfile({
        id: "staff-1",
        school_id: "school-1",
        department_id: "dept-1",
      }),
    );
    vi.mocked(resolveSchoolForCaller).mockResolvedValue("school-1");
    vi.mocked(isPlatformOwner).mockResolvedValue(false);
    vi.mocked(hasPermission).mockResolvedValue(true);

    const res = await assertCanManageCalendar();
    expect(res).toEqual({ schoolId: "school-1", profileId: "staff-1" });
  });

  it("allows platform owner without school_id by resolving first active school", async () => {
    vi.mocked(getCurrentProfile).mockResolvedValue(makeProfile({ id: "owner-1", school_id: null }));
    vi.mocked(resolveSchoolForCaller).mockResolvedValue("school-active-1");
    vi.mocked(isPlatformOwner).mockResolvedValue(true);

    const res = await assertCanManageCalendar();
    expect(res).toEqual({ schoolId: "school-active-1", profileId: "owner-1" });
    expect(hasPermission).not.toHaveBeenCalled();
  });
});
