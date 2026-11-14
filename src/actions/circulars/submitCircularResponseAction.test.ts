import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { submitCircularResponseAction } from "./submitCircularResponseAction";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { createSupabaseServerClient } from "@/lib/supabase";
import { markEntityNotificationsRead } from "@/lib/notifications/markEntityNotificationsRead";
import { notifyCircularResponseSubmission } from "@/lib/circulars/notifyCircularResponseSubmission";

vi.mock("@/lib/auth/getCurrentProfile", () => ({
  getCurrentProfile: vi.fn(),
}));

vi.mock("@/lib/rbac/hasPermission", () => ({
  hasPermission: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("@/lib/notifications/markEntityNotificationsRead", () => ({
  markEntityNotificationsRead: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/circulars/notifyCircularResponseSubmission", () => ({
  notifyCircularResponseSubmission: vi.fn().mockResolvedValue({ delivered: 1 }),
}));

describe("submitCircularResponseAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits response via transactional RPC", async () => {
    vi.mocked(getCurrentProfile).mockResolvedValue({
      id: "usr-1",
      school_id: "sch-1",
      department_id: "dept-1",
      full_name: "Staff User",
      email: "staff@example.com",
      role: "staff",
      is_active: true,
      created_at: "2026-01-01T00:00:00Z",
    } as unknown as Awaited<ReturnType<typeof getCurrentProfile>>);

    vi.mocked(hasPermission).mockResolvedValue(true);

    const rpcMock = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      rpc: rpcMock,
    } as unknown as Awaited<ReturnType<typeof createSupabaseServerClient>>);

    const result = await submitCircularResponseAction({
      circularId: "circ-1",
      responseType: "acknowledgement",
      status: "acknowledged",
    });

    expect(result).toEqual({ success: true });
    expect(markEntityNotificationsRead).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        userId: "usr-1",
        entityType: "circular",
        entityId: "circ-1",
      }),
    );
    expect(notifyCircularResponseSubmission).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        circularId: "circ-1",
        schoolId: "sch-1",
        responderId: "usr-1",
      }),
    );
    expect(rpcMock).toHaveBeenCalledWith("submit_circular_response", {
      p_circular_id: "circ-1",
      p_school_id: "sch-1",
      p_department_id: "dept-1",
      p_response_type: "acknowledgement",
      p_status: "acknowledged",
      p_reason: null,
    });
  });

  it("fails with validation error when rejection reason is missing", async () => {
    vi.mocked(getCurrentProfile).mockResolvedValue({
      id: "usr-1",
      school_id: "sch-1",
      department_id: "dept-1",
      full_name: "Staff User",
      email: "staff@example.com",
      role: "staff",
      is_active: true,
      created_at: "2026-01-01T00:00:00Z",
    } as unknown as Awaited<ReturnType<typeof getCurrentProfile>>);

    vi.mocked(hasPermission).mockResolvedValue(true);

    const result = await submitCircularResponseAction({
      circularId: "circ-1",
      responseType: "acknowledgement",
      status: "rejected",
      reason: "   ",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
