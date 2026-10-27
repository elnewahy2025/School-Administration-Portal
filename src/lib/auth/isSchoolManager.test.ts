import { describe, expect, it, vi } from "vitest";
import { isSchoolManager } from "./isSchoolManager";
import { createSupabaseAdminClient } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

describe("isSchoolManager", () => {
  it("returns false if userId is missing", async () => {
    const res = await isSchoolManager(null);
    expect(res).toBe(false);
  });

  it("returns true when user has school_admin role", async () => {
    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: { id: "assign-1", roles: { key: "school_admin" } },
      error: null,
    });
    const limitMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const orMock = vi.fn().mockReturnValue({ limit: limitMock });
    const eqRoleMock = vi.fn().mockReturnValue({ or: orMock, limit: limitMock });
    const eqUserMock = vi.fn().mockReturnValue({ eq: eqRoleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqUserMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.mocked(createSupabaseAdminClient).mockReturnValue({
      from: fromMock,
    } as unknown as ReturnType<typeof createSupabaseAdminClient>);

    const res = await isSchoolManager("user-1", "school-1");
    expect(res).toBe(true);
  });

  it("returns false if user has no school_admin assignment", async () => {
    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: null,
      error: null,
    });
    const limitMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const eqRoleMock = vi.fn().mockReturnValue({ limit: limitMock });
    const eqUserMock = vi.fn().mockReturnValue({ eq: eqRoleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqUserMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.mocked(createSupabaseAdminClient).mockReturnValue({
      from: fromMock,
    } as unknown as ReturnType<typeof createSupabaseAdminClient>);

    const res = await isSchoolManager("user-2");
    expect(res).toBe(false);
  });
});
