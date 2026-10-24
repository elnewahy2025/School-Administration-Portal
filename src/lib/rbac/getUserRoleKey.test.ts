import { describe, expect, it, vi } from "vitest";
import { getUserRoleKey } from "./getUserRoleKey";
import { createSupabaseServerClient } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
  createSupabaseServerClient: vi.fn(),
}));

describe("getUserRoleKey", () => {
  it("returns null if userId is missing", async () => {
    const res = await getUserRoleKey(null);
    expect(res).toBeNull();
  });

  it("returns the role key when found", async () => {
    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: { roles: { key: "department_head" } },
    });
    const limitMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const eqSchoolMock = vi.fn().mockReturnValue({ limit: limitMock });
    const eqUserMock = vi.fn().mockReturnValue({ eq: eqSchoolMock, limit: limitMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqUserMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.mocked(createSupabaseServerClient).mockResolvedValueOnce({
      from: fromMock,
    } as unknown as Awaited<ReturnType<typeof createSupabaseServerClient>>);

    const res = await getUserRoleKey("user-1", "school-1");
    expect(res).toBe("department_head");
  });

  it("returns null if assignment not found", async () => {
    const maybeSingleMock = vi.fn().mockResolvedValue({ data: null });
    const limitMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const eqUserMock = vi.fn().mockReturnValue({ limit: limitMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqUserMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.mocked(createSupabaseServerClient).mockResolvedValueOnce({
      from: fromMock,
    } as unknown as Awaited<ReturnType<typeof createSupabaseServerClient>>);

    const res = await getUserRoleKey("user-2");
    expect(res).toBeNull();
  });
});
