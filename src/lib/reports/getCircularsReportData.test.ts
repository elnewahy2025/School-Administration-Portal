import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCircularsReportData } from "./getCircularsReportData";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getSchoolDepartments } from "@/lib/school/getSchoolDepartments";
import { DatabaseError } from "@/lib/errors/DatabaseError";

vi.mock("@/lib/supabase", () => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("@/lib/supabase/warnOnDataTruncation", () => ({
  warnOnDataTruncation: vi.fn(),
}));

vi.mock("@/lib/school/getSchoolDepartments", () => ({
  getSchoolDepartments: vi.fn(),
}));

type MockServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

describe("getCircularsReportData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSchoolDepartments).mockResolvedValue([
      { id: "dept-1", school_id: "school-1", name_ar: "قسم 1", name_en: "Dept 1", is_active: true, created_at: "" },
    ]);
  });

  it("throws DatabaseError when circulars base query fails", async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue(
            Promise.resolve({
              data: null,
              error: { message: "connection failed", code: "PGRST000" },
            }),
          ),
        }),
      }),
    });

    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      from: mockFrom,
    } as unknown as MockServerClient);

    await expect(getCircularsReportData("school-1")).rejects.toThrow(DatabaseError);
  });

  it("chunks large sets of circular IDs and aggregates targets and responses", async () => {
    const mockCirculars = Array.from({ length: 150 }, (_, i) => ({
      id: `circ-${i}`,
      ref_number: `REF-${i}`,
      title: `Title ${i}`,
      category: "admin",
      priority: "normal",
      status: "published",
      publish_at: null,
      due_at: null,
      created_at: "2026-01-01",
    }));

    const inTargetsSpy = vi.fn().mockResolvedValue({
      data: [{ circular_id: "circ-0", department_id: "dept-1" }],
      error: null,
    });

    const inResponsesSpy = vi.fn().mockResolvedValue({
      data: [{ circular_id: "circ-0", department_id: "dept-1", status: "read" }],
      error: null,
    });

    const mockFrom = vi.fn((table: string) => {
      if (table === "circulars") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue(
                Promise.resolve({
                  data: mockCirculars,
                  error: null,
                }),
              ),
            }),
          }),
        };
      }
      if (table === "circular_targets") {
        return {
          select: vi.fn().mockReturnValue({
            in: inTargetsSpy,
          }),
        };
      }
      if (table === "circular_responses") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              in: inResponsesSpy,
            }),
          }),
        };
      }
      return {};
    });

    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      from: mockFrom,
    } as unknown as MockServerClient);

    const report = await getCircularsReportData("school-1");

    expect(report.totalCirculars).toBe(150);
    expect(inTargetsSpy).toHaveBeenCalledTimes(2);
    expect(inTargetsSpy.mock.calls[0][1].length).toBe(100);
    expect(inTargetsSpy.mock.calls[1][1].length).toBe(50);
    expect(inResponsesSpy).toHaveBeenCalledTimes(2);
  });

  it("throws DatabaseError when targets batch query fails", async () => {
    const mockFrom = vi.fn((table: string) => {
      if (table === "circulars") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue(
                Promise.resolve({
                  data: [{ id: "c1", status: "published" }],
                  error: null,
                }),
              ),
            }),
          }),
        };
      }
      if (table === "circular_targets") {
        return {
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "timeout", code: "PGRST001" },
            }),
          }),
        };
      }
      return {};
    });

    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      from: mockFrom,
    } as unknown as MockServerClient);

    await expect(getCircularsReportData("school-1")).rejects.toThrow(DatabaseError);
  });
});
