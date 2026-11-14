import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { markCircularNotificationReadIfPresent } from "./markCircularNotificationReadIfPresent";
import * as markModule from "@/lib/notifications/markEntityNotificationsRead";

describe("markCircularNotificationReadIfPresent", () => {
  it("does nothing when userId is missing", async () => {
    const spy = vi.spyOn(markModule, "markEntityNotificationsRead");
    await markCircularNotificationReadIfPresent({} as SupabaseClient, undefined, "circ-1");
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("calls markEntityNotificationsRead when userId is provided", async () => {
    const spy = vi.spyOn(markModule, "markEntityNotificationsRead").mockResolvedValue();
    await markCircularNotificationReadIfPresent({} as SupabaseClient, "user-1", "circ-1");
    expect(spy).toHaveBeenCalledWith(expect.anything(), {
      userId: "user-1",
      entityType: "circular",
      entityId: "circ-1",
    });
    spy.mockRestore();
  });
});
