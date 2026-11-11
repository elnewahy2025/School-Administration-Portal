import { describe, expect, it, vi } from "vitest";
import { assertCanManageMaintenanceRequest } from "./assertCanManageMaintenanceRequest";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";
import type { MaintenanceRequestRow } from "./types";

vi.mock("@/lib/auth/isPlatformOwner", () => ({
  isPlatformOwner: vi.fn(),
}));

vi.mock("@/lib/rbac/hasPermission", () => ({
  hasPermission: vi.fn(),
}));

import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { hasPermission } from "@/lib/rbac/hasPermission";

function makeProfile(partial: Partial<ProfileRow> & { id: string }): ProfileRow {
  return {
    full_name: "Test User",
    email: "test@example.com",
    job_title: null,
    school_id: "school-1",
    department_id: null,
    is_active: true,
    ...partial,
  };
}

function makeTicket(partial: Partial<MaintenanceRequestRow> & { id: string }): MaintenanceRequestRow {
  return {
    school_id: "school-1",
    ticket_number: "T-100",
    title: "Leak",
    description: "Water leak",
    category: "plumbing",
    location_id: null,
    area: null,
    asset_ref: null,
    priority: "medium",
    status: "submitted",
    reporter_id: "reporter-1",
    reporter_department_id: "dept-math",
    assigned_operator_id: null,
    target_response_at: null,
    target_resolution_at: null,
    first_response_at: null,
    resolved_at: null,
    rejection_reason: null,
    reopen_reason: null,
    closed_at: null,
    closed_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...partial,
  };
}

describe("assertCanManageMaintenanceRequest", () => {
  it("allows platform owner immediately", async () => {
    vi.mocked(isPlatformOwner).mockResolvedValue(true);
    const profile = makeProfile({ id: "owner-1", school_id: null });
    const ticket = makeTicket({ id: "t-1", school_id: "school-2" });

    await expect(assertCanManageMaintenanceRequest(profile, ticket)).resolves.toBeUndefined();
    expect(hasPermission).not.toHaveBeenCalled();
  });

  it("throws ForbiddenError for cross-tenant ticket", async () => {
    vi.mocked(isPlatformOwner).mockResolvedValue(false);
    const profile = makeProfile({ id: "user-1", school_id: "school-1" });
    const ticket = makeTicket({ id: "t-1", school_id: "school-2" });

    await expect(assertCanManageMaintenanceRequest(profile, ticket)).rejects.toThrow(ForbiddenError);
  });

  it("allows ticket reporter to manage their own ticket", async () => {
    vi.mocked(isPlatformOwner).mockResolvedValue(false);
    const profile = makeProfile({ id: "reporter-1", school_id: "school-1" });
    const ticket = makeTicket({ id: "t-1", reporter_id: "reporter-1" });

    await expect(assertCanManageMaintenanceRequest(profile, ticket)).resolves.toBeUndefined();
    expect(hasPermission).not.toHaveBeenCalled();
  });

  it("checks ticket reporter_department_id rather than caller own department", async () => {
    vi.mocked(isPlatformOwner).mockResolvedValue(false);
    vi.mocked(hasPermission).mockImplementation(async (perm, _s, dept) => {
      // Caller only has permission for dept-math, but ticket is in dept-science
      return dept === "dept-math";
    });

    const profile = makeProfile({ id: "user-1", school_id: "school-1", department_id: "dept-math" });
    const ticket = makeTicket({ id: "t-1", reporter_id: "other-user", reporter_department_id: "dept-science" });

    await expect(assertCanManageMaintenanceRequest(profile, ticket)).rejects.toThrow(ForbiddenError);
    expect(hasPermission).toHaveBeenCalledWith("maintenance.close", "school-1", "dept-science");
  });

  it("allows manager with matching department permission for the ticket", async () => {
    vi.mocked(isPlatformOwner).mockResolvedValue(false);
    vi.mocked(hasPermission).mockImplementation(async (perm, _s, dept) => {
      return perm === "maintenance.assign" && dept === "dept-math";
    });

    const profile = makeProfile({ id: "mgr-1", school_id: "school-1", department_id: "dept-math" });
    const ticket = makeTicket({ id: "t-1", reporter_id: "other-user", reporter_department_id: "dept-math" });

    await expect(assertCanManageMaintenanceRequest(profile, ticket)).resolves.toBeUndefined();
  });
});
