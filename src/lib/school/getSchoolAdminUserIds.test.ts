import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSchoolAdminUserIds } from "./getSchoolAdminUserIds";

describe("getSchoolAdminUserIds", () => {
  it("returns unique user IDs of active school admins and owners", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      data: [
        { user_id: "admin-1", roles: { key: "school_admin" } },
        { user_id: "owner-1", roles: { key: "owner" } },
        { user_id: "admin-1", roles: { key: "school_admin" } },
      ],
      error: null,
    });
    const mockIn = vi.fn().mockReturnValue({ eq: mockEq });
    const mockOr = vi.fn().mockReturnValue({ in: mockIn });
    const mockSelect = vi.fn().mockReturnValue({ or: mockOr });

    const mockSupabase = {
      from: vi.fn().mockReturnValue({ select: mockSelect }),
    } as unknown as SupabaseClient;

    const result = await getSchoolAdminUserIds(mockSupabase, "school-1");

    expect(result).toEqual(["admin-1", "owner-1"]);
    expect(mockSupabase.from).toHaveBeenCalledWith("user_role_assignments");
    expect(mockIn).toHaveBeenCalledWith("roles.key", ["school_admin", "owner"]);
  });

  it("returns empty array on database error", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "DB failure" },
    });
    const mockIn = vi.fn().mockReturnValue({ eq: mockEq });
    const mockOr = vi.fn().mockReturnValue({ in: mockIn });
    const mockSelect = vi.fn().mockReturnValue({ or: mockOr });

    const mockSupabase = {
      from: vi.fn().mockReturnValue({ select: mockSelect }),
    } as unknown as SupabaseClient;

    const result = await getSchoolAdminUserIds(mockSupabase, "school-1");
    expect(result).toEqual([]);
  });
});
