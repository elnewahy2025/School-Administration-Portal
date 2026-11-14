import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { notifyCircularResponseSubmission } from "./notifyCircularResponseSubmission";

const { mockFetchCircularBaseRow, mockGetSchoolAdminUserIds, mockDispatchModuleNotification } =
  vi.hoisted(() => ({
    mockFetchCircularBaseRow: vi.fn(),
    mockGetSchoolAdminUserIds: vi.fn(),
    mockDispatchModuleNotification: vi.fn(),
  }));

vi.mock("./fetchCircularBaseRow", () => ({
  fetchCircularBaseRow: () => mockFetchCircularBaseRow(),
}));

vi.mock("@/lib/school/getSchoolAdminUserIds", () => ({
  getSchoolAdminUserIds: () => mockGetSchoolAdminUserIds(),
}));

vi.mock("@/lib/notifications/dispatchModuleNotification", () => ({
  dispatchModuleNotification: (args: unknown) => mockDispatchModuleNotification(args),
}));

describe("notifyCircularResponseSubmission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("notifies creator and admins with circular_response_received when not all have responded", async () => {
    mockFetchCircularBaseRow.mockResolvedValueOnce({
      id: "circ-1",
      created_by: "creator-admin",
    });
    mockGetSchoolAdminUserIds.mockResolvedValueOnce(["creator-admin", "other-admin"]);
    mockDispatchModuleNotification.mockResolvedValueOnce({ delivered: 2 });

    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "circular_targets") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [{ department_id: "dept-1" }, { department_id: "dept-2" }],
              }),
            }),
          };
        }
        if (table === "circular_responses") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [{ department_id: "dept-1" }],
                }),
              }),
            }),
          };
        }
        return {};
      }),
    } as unknown as SupabaseClient;

    const res = await notifyCircularResponseSubmission(mockSupabase, {
      circularId: "circ-1",
      schoolId: "school-1",
      responderId: "teacher-1",
    });

    expect(res.delivered).toBe(2);
    expect(mockDispatchModuleNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientUserIds: ["creator-admin", "other-admin"],
        title: "circular_response_received",
      }),
    );
  });

  it("notifies with circular_all_responded when all targeted departments have responded", async () => {
    mockFetchCircularBaseRow.mockResolvedValueOnce({
      id: "circ-1",
      created_by: "creator-admin",
    });
    mockGetSchoolAdminUserIds.mockResolvedValueOnce(["creator-admin"]);
    mockDispatchModuleNotification.mockResolvedValueOnce({ delivered: 1 });

    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "circular_targets") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [{ department_id: "dept-1" }],
              }),
            }),
          };
        }
        if (table === "circular_responses") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [{ department_id: "dept-1" }],
                }),
              }),
            }),
          };
        }
        return {};
      }),
    } as unknown as SupabaseClient;

    const res = await notifyCircularResponseSubmission(mockSupabase, {
      circularId: "circ-1",
      schoolId: "school-1",
      responderId: "teacher-1",
    });

    expect(res.delivered).toBe(1);
    expect(mockDispatchModuleNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientUserIds: ["creator-admin"],
        title: "circular_all_responded",
      }),
    );
  });
});
