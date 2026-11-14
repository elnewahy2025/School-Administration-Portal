import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getCircularPublishRecipients } from "./getCircularPublishRecipients";

const { mockGetDepartmentMemberUserIds } = vi.hoisted(() => ({
  mockGetDepartmentMemberUserIds: vi.fn(),
}));

vi.mock("./getDepartmentMemberUserIds", () => ({
  getDepartmentMemberUserIds: (sb: unknown, sId: string, dIds: string[]) =>
    mockGetDepartmentMemberUserIds(sb, sId, dIds),
}));

describe("getCircularPublishRecipients", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("notifies all active school profiles when circular has no targets", async () => {
    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "circular_targets") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          };
        }
        if (table === "profiles") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [{ id: "u-1" }, { id: "u-2" }, { id: "publisher-1" }],
                  error: null,
                }),
              }),
            }),
          };
        }
        return {};
      }),
    } as unknown as SupabaseClient;

    const result = await getCircularPublishRecipients(
      mockSupabase,
      "school-1",
      "circ-1",
      "publisher-1",
    );

    expect(result).toEqual(["u-1", "u-2"]);
  });

  it("notifies department members and department heads for targeted departments", async () => {
    mockGetDepartmentMemberUserIds.mockResolvedValueOnce(["member-1", "member-2"]);

    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "circular_targets") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [
                  {
                    department_id: "dept-1",
                    role_key: null,
                    department: { head_profile_id: "head-1" },
                  },
                ],
                error: null,
              }),
            }),
          };
        }
        return {};
      }),
    } as unknown as SupabaseClient;

    const result = await getCircularPublishRecipients(
      mockSupabase,
      "school-1",
      "circ-1",
      "member-1",
    );

    expect(mockGetDepartmentMemberUserIds).toHaveBeenCalledWith(mockSupabase, "school-1", [
      "dept-1",
    ]);
    expect(result).toEqual(["member-2", "head-1"]);
  });

  it("excludes publisher from the recipient list", async () => {
    mockGetDepartmentMemberUserIds.mockResolvedValueOnce(["publisher-id", "other-teacher"]);

    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "circular_targets") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [
                  {
                    department_id: "dept-1",
                    role_key: null,
                    department: { head_profile_id: null },
                  },
                ],
                error: null,
              }),
            }),
          };
        }
        return {};
      }),
    } as unknown as SupabaseClient;

    const result = await getCircularPublishRecipients(
      mockSupabase,
      "school-1",
      "circ-1",
      "publisher-id",
    );

    expect(result).toEqual(["other-teacher"]);
  });
});
