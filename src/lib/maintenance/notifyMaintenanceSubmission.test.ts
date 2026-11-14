import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { notifyMaintenanceSubmission } from "./notifyMaintenanceSubmission";

const { mockGetSchoolAdminUserIds, mockDispatchModuleNotification } = vi.hoisted(() => ({
  mockGetSchoolAdminUserIds: vi.fn(),
  mockDispatchModuleNotification: vi.fn(),
}));

vi.mock("@/lib/school/getSchoolAdminUserIds", () => ({
  getSchoolAdminUserIds: () => mockGetSchoolAdminUserIds(),
}));

vi.mock("@/lib/notifications/dispatchModuleNotification", () => ({
  dispatchModuleNotification: (args: unknown) => mockDispatchModuleNotification(args),
}));

describe("notifyMaintenanceSubmission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("dispatches maintenance_submitted to school admins excluding reporter", async () => {
    mockGetSchoolAdminUserIds.mockResolvedValueOnce(["admin-1", "reporter-user"]);
    mockDispatchModuleNotification.mockResolvedValueOnce({ delivered: 1 });

    const mockSupabase = {} as SupabaseClient;
    const res = await notifyMaintenanceSubmission(mockSupabase, {
      schoolId: "school-1",
      requestId: "req-1",
      reporterId: "reporter-user",
    });

    expect(res.delivered).toBe(1);
    expect(mockDispatchModuleNotification).toHaveBeenCalledWith({
      recipientUserIds: ["admin-1"],
      schoolId: "school-1",
      type: "maintenance",
      title: "maintenance_submitted",
      body: "maintenance_submitted",
      entityType: "maintenance_request",
      entityId: "req-1",
      skipThrottle: true,
    });
  });

  it("returns delivered 0 when no admins are found to notify", async () => {
    mockGetSchoolAdminUserIds.mockResolvedValueOnce(["reporter-user"]);

    const mockSupabase = {} as SupabaseClient;
    const res = await notifyMaintenanceSubmission(mockSupabase, {
      schoolId: "school-1",
      requestId: "req-1",
      reporterId: "reporter-user",
    });

    expect(res.delivered).toBe(0);
    expect(mockDispatchModuleNotification).not.toHaveBeenCalled();
  });
});
