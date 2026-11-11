import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth/isCurrentUserPlatformOwner", () => ({
  isCurrentUserPlatformOwner: vi.fn(),
}));

vi.mock("@/lib/rbac/hasPermission", () => ({
  hasPermission: vi.fn(),
}));

import { isCurrentUserPlatformOwner } from "@/lib/auth/isCurrentUserPlatformOwner";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { resolveMaintenanceListPermissions } from "./resolveMaintenanceListPermissions";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";

function makeProfile(partial: Partial<ProfileRow> & { id: string }): ProfileRow {
  return {
    full_name: "Test User",
    email: "test@example.com",
    job_title: null,
    school_id: "school-1",
    department_id: "dept-1",
    is_active: true,
    ...partial,
  };
}

describe("resolveMaintenanceListPermissions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all false if profile is null", async () => {
    const res = await resolveMaintenanceListPermissions(null);
    expect(res).toEqual({ canCreate: false, canManageAll: false });
  });

  it("grants full permissions to platform owner", async () => {
    vi.mocked(isCurrentUserPlatformOwner).mockResolvedValue(true);
    const profile = makeProfile({ id: "owner-1", school_id: null });

    const res = await resolveMaintenanceListPermissions(profile);

    expect(res).toEqual({ canCreate: true, canManageAll: true });
    expect(hasPermission).not.toHaveBeenCalled();
  });

  it("returns all false if profile has no school_id", async () => {
    vi.mocked(isCurrentUserPlatformOwner).mockResolvedValue(false);
    const profile = makeProfile({ id: "user-1", school_id: null });

    const res = await resolveMaintenanceListPermissions(profile);

    expect(res).toEqual({ canCreate: false, canManageAll: false });
  });

  it("checks create with departmentId but administrative permissions school-wide", async () => {
    vi.mocked(isCurrentUserPlatformOwner).mockResolvedValue(false);
    vi.mocked(hasPermission).mockImplementation(async (perm, _school, dept) => {
      if (perm === "maintenance.create" && dept === "dept-1") return true;
      return false;
    });

    const profile = makeProfile({ id: "staff-1", school_id: "school-1", department_id: "dept-1" });
    const res = await resolveMaintenanceListPermissions(profile);

    expect(res).toEqual({ canCreate: true, canManageAll: false });
    expect(hasPermission).toHaveBeenCalledWith("maintenance.create", "school-1", "dept-1");
    expect(hasPermission).toHaveBeenCalledWith("maintenance.assign", "school-1");
    expect(hasPermission).toHaveBeenCalledWith("maintenance.close", "school-1");
    expect(hasPermission).toHaveBeenCalledWith("users.manage", "school-1");
  });

  it("grants canManageAll if user holds school-wide maintenance.assign", async () => {
    vi.mocked(isCurrentUserPlatformOwner).mockResolvedValue(false);
    vi.mocked(hasPermission).mockImplementation(async (perm, _school, dept) => {
      if (perm === "maintenance.assign" && dept === undefined) return true;
      return false;
    });

    const profile = makeProfile({ id: "admin-1", school_id: "school-1", department_id: null });
    const res = await resolveMaintenanceListPermissions(profile);

    expect(res.canManageAll).toBe(true);
  });
});
