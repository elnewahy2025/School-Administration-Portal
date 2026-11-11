import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth/isCurrentUserPlatformOwner", () => ({
  isCurrentUserPlatformOwner: vi.fn(),
}));

vi.mock("@/lib/rbac/hasPermission", () => ({
  hasPermission: vi.fn(),
}));

import { isCurrentUserPlatformOwner } from "@/lib/auth/isCurrentUserPlatformOwner";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { resolveMaintenanceDetailPermissions } from "./resolveMaintenanceDetailPermissions";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";
import type { MaintenanceRequestRow } from "./types";

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

function makeTicket(partial: Partial<MaintenanceRequestRow> & { id: string }): MaintenanceRequestRow {
  return {
    school_id: "school-1",
    ticket_number: "T-100",
    reporter_id: "reporter-1",
    assigned_operator_id: null,
    category: "general",
    priority: "medium",
    status: "submitted",
    title: "Fix A/C",
    description: "Leaking",
    location_id: null,
    area: "Room 101",
    asset_ref: null,
    reporter_department_id: "dept-A",
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

describe("resolveMaintenanceDetailPermissions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("grants full access to platform owner", async () => {
    vi.mocked(isCurrentUserPlatformOwner).mockResolvedValue(true);
    const profile = makeProfile({ id: "owner-1" });
    const ticket = makeTicket({ id: "ticket-1" });

    const res = await resolveMaintenanceDetailPermissions(profile, ticket);

    expect(res).toEqual({
      canAssign: true,
      canClose: true,
      isReporter: false,
      isOperator: false,
      isParticipant: true,
      canManage: true,
    });
    expect(hasPermission).not.toHaveBeenCalled();
  });

  it("identifies reporter correctly and grants management of own ticket", async () => {
    vi.mocked(isCurrentUserPlatformOwner).mockResolvedValue(false);
    vi.mocked(hasPermission).mockResolvedValue(false);

    const profile = makeProfile({ id: "reporter-1" });
    const ticket = makeTicket({ id: "ticket-1", reporter_id: "reporter-1" });

    const res = await resolveMaintenanceDetailPermissions(profile, ticket);

    expect(res.isReporter).toBe(true);
    expect(res.canManage).toBe(true);
    expect(res.isParticipant).toBe(true);
  });

  it("identifies assigned operator as participant without assignment permissions", async () => {
    vi.mocked(isCurrentUserPlatformOwner).mockResolvedValue(false);
    vi.mocked(hasPermission).mockResolvedValue(false);

    const profile = makeProfile({ id: "operator-1" });
    const ticket = makeTicket({ id: "ticket-1", assigned_operator_id: "operator-1" });

    const res = await resolveMaintenanceDetailPermissions(profile, ticket);

    expect(res.isOperator).toBe(true);
    expect(res.isParticipant).toBe(true);
    expect(res.canAssign).toBe(false);
  });

  it("checks permissions against ticket reporter_department_id rather than caller department", async () => {
    vi.mocked(isCurrentUserPlatformOwner).mockResolvedValue(false);
    vi.mocked(hasPermission).mockResolvedValue(false);

    const profile = makeProfile({ id: "head-B", department_id: "dept-B" });
    const ticket = makeTicket({ id: "ticket-1", reporter_department_id: "dept-A" });

    await resolveMaintenanceDetailPermissions(profile, ticket);

    expect(hasPermission).toHaveBeenCalledWith("maintenance.assign", "school-1", "dept-A");
    expect(hasPermission).toHaveBeenCalledWith("maintenance.close", "school-1", "dept-A");
    expect(hasPermission).toHaveBeenCalledWith("users.manage", "school-1", "dept-A");
  });

  it("grants assign and close when hasPermission returns true for ticket department", async () => {
    vi.mocked(isCurrentUserPlatformOwner).mockResolvedValue(false);
    vi.mocked(hasPermission).mockImplementation(async (perm, _s, dept) => {
      if (dept === "dept-A") return true;
      return false;
    });

    const profile = makeProfile({ id: "head-A", department_id: "dept-A" });
    const ticket = makeTicket({ id: "ticket-1", reporter_department_id: "dept-A" });

    const res = await resolveMaintenanceDetailPermissions(profile, ticket);

    expect(res.canAssign).toBe(true);
    expect(res.canClose).toBe(true);
    expect(res.canManage).toBe(true);
  });
});
