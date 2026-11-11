import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAdminStorageRemove = vi.fn();
vi.mock("@/lib/supabase", () => ({
  createSupabaseAdminClient: () => ({
    storage: {
      from: vi.fn(() => ({
        remove: mockAdminStorageRemove,
      })),
    },
  }),
}));

import { removeCalendarEventImage } from "./removeCalendarEventImage";

describe("removeCalendarEventImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does nothing if imagePath is empty", async () => {
    const mockSupabase = {
      storage: {
        from: vi.fn(),
      },
    } as never;

    await removeCalendarEventImage(mockSupabase, "", "usr-1");
    expect(mockSupabase.storage.from).not.toHaveBeenCalled();
    expect(mockAdminStorageRemove).not.toHaveBeenCalled();
  });

  it("deletes image via regular client when permitted", async () => {
    const mockRemove = vi.fn().mockResolvedValue({
      data: [{ name: "sch-1/calendar/pic.png" }],
      error: null,
    });
    const mockSupabase = {
      storage: {
        from: vi.fn(() => ({
          remove: mockRemove,
        })),
      },
    } as never;

    await removeCalendarEventImage(mockSupabase, "sch-1/calendar/pic.png", "usr-1");
    expect(mockRemove).toHaveBeenCalledWith(["sch-1/calendar/pic.png"]);
    expect(mockAdminStorageRemove).not.toHaveBeenCalled();
  });

  it("falls back to admin client when regular client returns empty data due to RLS suppression", async () => {
    const mockRemove = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    mockAdminStorageRemove.mockResolvedValue({
      data: [{ name: "sch-1/calendar/pic.png" }],
      error: null,
    });

    const mockSupabase = {
      storage: {
        from: vi.fn(() => ({
          remove: mockRemove,
        })),
      },
    } as never;

    await removeCalendarEventImage(mockSupabase, "/public-assets/sch-1/calendar/pic.png", "usr-1");
    expect(mockRemove).toHaveBeenCalledWith(["sch-1/calendar/pic.png"]);
    expect(mockAdminStorageRemove).toHaveBeenCalledWith(["sch-1/calendar/pic.png"]);
  });

  it("falls back to admin client when regular client throws storage error", async () => {
    const mockRemove = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Permission denied" },
    });
    mockAdminStorageRemove.mockResolvedValue({
      data: [{ name: "sch-1/calendar/pic.png" }],
      error: null,
    });

    const mockSupabase = {
      storage: {
        from: vi.fn(() => ({
          remove: mockRemove,
        })),
      },
    } as never;

    await removeCalendarEventImage(mockSupabase, "sch-1/calendar/pic.png", "usr-1");
    expect(mockRemove).toHaveBeenCalledWith(["sch-1/calendar/pic.png"]);
    expect(mockAdminStorageRemove).toHaveBeenCalledWith(["sch-1/calendar/pic.png"]);
  });
});
