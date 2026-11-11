import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAdminSelect = vi.fn();
const mockAdminStorageRemove = vi.fn();
const mockCreateSupabaseAdminClient = vi.fn(() => ({
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        })),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: mockAdminSelect,
        })),
        select: mockAdminSelect,
      })),
    })),
  })),
  storage: {
    from: vi.fn(() => ({
      remove: mockAdminStorageRemove,
    })),
  },
}));

vi.mock("@/lib/supabase", () => ({
  createSupabaseAdminClient: () => mockCreateSupabaseAdminClient(),
}));

import { deleteCalendarEventRecord } from "./deleteCalendarEventRecord";

describe("deleteCalendarEventRecord", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error if event not found", async () => {
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            })),
          })),
        })),
      })),
      storage: {
        from: vi.fn(() => ({
          remove: vi.fn().mockResolvedValue({ error: null }),
        })),
      },
    } as never;

    const res = await deleteCalendarEventRecord(mockSupabase, {
      eventId: "missing-ev",
      schoolId: "sch-1",
      actorId: "usr-1",
    });

    expect(res.success).toBe(false);
    expect(res.error).toBe("Event not found or access denied");
  });

  it("deletes event without image successfully via regular client", async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [{ id: "ev-1" }],
      error: null,
    });
    const mockDelete = vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: mockSelect,
        })),
      })),
    }));

    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "calendar_events") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: { id: "ev-1", school_id: "sch-1", image_path: null },
                    error: null,
                  }),
                })),
              })),
            })),
            delete: mockDelete,
          };
        }
        return {};
      }),
      storage: {
        from: vi.fn(() => ({
          remove: vi.fn().mockResolvedValue({ error: null }),
        })),
      },
    } as never;

    const res = await deleteCalendarEventRecord(mockSupabase, {
      eventId: "ev-1",
      schoolId: "sch-1",
      actorId: "usr-1",
    });

    expect(res.success).toBe(true);
  });

  it("removes storage image and deletes event row successfully", async () => {
    const mockRemove = vi.fn().mockResolvedValue({ error: null });
    const mockSelect = vi.fn().mockResolvedValue({
      data: [{ id: "ev-2" }],
      error: null,
    });
    const mockDelete = vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: mockSelect,
        })),
      })),
    }));

    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { id: "ev-2", school_id: "sch-1", image_path: "sch-1/calendar/pic.png" },
                error: null,
              }),
            })),
          })),
        })),
        delete: mockDelete,
      })),
      storage: {
        from: vi.fn(() => ({
          remove: mockRemove,
        })),
      },
    } as never;

    const res = await deleteCalendarEventRecord(mockSupabase, {
      eventId: "ev-2",
      schoolId: "sch-1",
      actorId: "usr-1",
    });

    expect(res.success).toBe(true);
    expect(mockRemove).toHaveBeenCalledWith(["sch-1/calendar/pic.png"]);
  });
});
