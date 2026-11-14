import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { dispatchCircularNotification } from "./dispatchCircularNotification";

const { mockGetRecipients, mockDispatchNotification } = vi.hoisted(() => ({
  mockGetRecipients: vi.fn(),
  mockDispatchNotification: vi.fn(),
}));

vi.mock("./getCircularPublishRecipients", () => ({
  getCircularPublishRecipients: (sb: unknown, sId: string, cId: string, pId?: string | null) =>
    mockGetRecipients(sb, sId, cId, pId),
}));

vi.mock("@/lib/notifications/dispatchModuleNotification", () => ({
  dispatchModuleNotification: (args: unknown) => mockDispatchNotification(args),
}));

describe("dispatchCircularNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("dispatches circular_published notifications to recipients", async () => {
    mockGetRecipients.mockResolvedValueOnce(["teacher-1", "teacher-2"]);
    mockDispatchNotification.mockResolvedValueOnce({ delivered: 2 });

    const mockSupabase = {} as SupabaseClient;
    const res = await dispatchCircularNotification(mockSupabase, {
      schoolId: "school-1",
      circularId: "circ-10",
      publisherId: "admin-1",
    });

    expect(res.delivered).toBe(2);
    expect(mockDispatchNotification).toHaveBeenCalledWith({
      recipientUserIds: ["teacher-1", "teacher-2"],
      schoolId: "school-1",
      type: "circular",
      title: "circular_published",
      body: "circular_published",
      entityType: "circular",
      entityId: "circ-10",
    });
  });

  it("returns delivered 0 when no recipients are found", async () => {
    mockGetRecipients.mockResolvedValueOnce([]);

    const mockSupabase = {} as SupabaseClient;
    const res = await dispatchCircularNotification(mockSupabase, {
      schoolId: "school-1",
      circularId: "circ-10",
      publisherId: "admin-1",
    });

    expect(res.delivered).toBe(0);
    expect(mockDispatchNotification).not.toHaveBeenCalled();
  });
});
