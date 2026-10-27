import { describe, expect, it, vi } from "vitest";
import { getPlatformOwnerUserIds } from "./getPlatformOwnerUserIds";
import { createSupabaseAdminClient } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

describe("getPlatformOwnerUserIds", () => {
  it("returns set of owner user IDs when found", async () => {
    const eqMock = vi.fn().mockResolvedValue({
      data: [{ user_id: "owner-1" }, { user_id: "owner-2" }],
      error: null,
    });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.mocked(createSupabaseAdminClient).mockReturnValue({
      from: fromMock,
    } as unknown as ReturnType<typeof createSupabaseAdminClient>);

    const res = await getPlatformOwnerUserIds();
    expect(res.size).toBe(2);
    expect(res.has("owner-1")).toBe(true);
    expect(res.has("owner-2")).toBe(true);
  });

  it("returns empty set on error or no data", async () => {
    const eqMock = vi.fn().mockResolvedValue({
      data: null,
      error: new Error("DB Error"),
    });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.mocked(createSupabaseAdminClient).mockReturnValue({
      from: fromMock,
    } as unknown as ReturnType<typeof createSupabaseAdminClient>);

    const res = await getPlatformOwnerUserIds();
    expect(res.size).toBe(0);
  });
});
