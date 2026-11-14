import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { markEntityNotificationsRead } from "./markEntityNotificationsRead";

describe("markEntityNotificationsRead", () => {
  it("updates unread notifications for the specified entity", async () => {
    const mockIs = vi.fn().mockResolvedValue({ error: null });
    const mockEqId = vi.fn().mockReturnValue({ is: mockIs });
    const mockEqType = vi.fn().mockReturnValue({ eq: mockEqId });
    const mockEqUser = vi.fn().mockReturnValue({ eq: mockEqType });
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEqUser });

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        update: mockUpdate,
      }),
    } as unknown as SupabaseClient;

    await markEntityNotificationsRead(mockSupabase, {
      userId: "user-1",
      entityType: "circular",
      entityId: "circ-10",
    });

    expect(mockSupabase.from).toHaveBeenCalledWith("notifications");
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        read_at: expect.any(String),
      }),
    );
    expect(mockEqUser).toHaveBeenCalledWith("user_id", "user-1");
    expect(mockEqType).toHaveBeenCalledWith("entity_type", "circular");
    expect(mockEqId).toHaveBeenCalledWith("entity_id", "circ-10");
    expect(mockIs).toHaveBeenCalledWith("read_at", null);
  });
});
