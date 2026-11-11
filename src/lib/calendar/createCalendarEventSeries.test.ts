import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createCalendarEventSeries } from "./createCalendarEventSeries";

describe("createCalendarEventSeries", () => {
  it("returns error when instances array is empty", async () => {
    const mockSupabase = {} as never;
    const res = await createCalendarEventSeries(mockSupabase, {
      schoolId: "sch-1",
      titleAr: "ورشة عمل",
      titleEn: null,
      description: null,
      category: "meeting",
      allDay: false,
      visibility: "internal",
      location: null,
      imagePath: null,
      createdBy: "usr-1",
      instances: [],
    });

    expect(res.error).toBe("No event occurrences specified");
  });

  it("inserts all rows and returns event IDs", async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [{ id: "ev-1" }, { id: "ev-2" }],
      error: null,
    });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
    const mockSupabase = { from: mockFrom } as never;

    const res = await createCalendarEventSeries(mockSupabase, {
      schoolId: "sch-1",
      titleAr: "اجتماع القسم",
      titleEn: "Dept Meeting",
      description: "Meeting description",
      category: "meeting",
      allDay: false,
      visibility: "internal",
      location: "Room 101",
      imagePath: null,
      createdBy: "usr-1",
      instances: [
        { startsAt: "2026-11-01T08:00:00Z", endsAt: "2026-11-01T09:00:00Z" },
        { startsAt: "2026-11-08T08:00:00Z", endsAt: "2026-11-08T09:00:00Z" },
      ],
    });

    expect(mockFrom).toHaveBeenCalledWith("calendar_events");
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(res.eventIds).toEqual(["ev-1", "ev-2"]);
    expect(res.firstEventId).toBe("ev-1");
  });

  it("sets status to published and adds published_at when requested", async () => {
    let insertedRows: Record<string, unknown>[] = [];
    const mockSelect = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        data: [{ id: "ev-pub" }],
        error: null,
      });
    });
    const mockInsert = vi.fn().mockImplementation((rows) => {
      insertedRows = rows;
      return { select: mockSelect };
    });
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
    const mockSupabase = { from: mockFrom } as never;

    const res = await createCalendarEventSeries(mockSupabase, {
      schoolId: "sch-1",
      titleAr: "حفل تخرج",
      titleEn: "Graduation",
      description: null,
      category: "event",
      allDay: true,
      visibility: "public",
      status: "published",
      location: "Main Hall",
      imagePath: null,
      createdBy: "usr-1",
      instances: [{ startsAt: "2026-11-20T08:00:00Z", endsAt: "2026-11-20T12:00:00Z" }],
    });

    expect(res.firstEventId).toBe("ev-pub");
    expect(insertedRows).toHaveLength(1);
    expect(insertedRows[0].status).toBe("published");
    expect(typeof insertedRows[0].published_at).toBe("string");
  });

  it("returns database error message on insert failure", async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Database connection failed" },
    });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
    const mockSupabase = { from: mockFrom } as never;

    const res = await createCalendarEventSeries(mockSupabase, {
      schoolId: "sch-1",
      titleAr: "اجتماع",
      titleEn: null,
      description: null,
      category: "meeting",
      allDay: false,
      visibility: "internal",
      location: null,
      imagePath: null,
      createdBy: "usr-1",
      instances: [{ startsAt: "2026-11-01T08:00:00Z", endsAt: "2026-11-01T09:00:00Z" }],
    });

    expect(res.error).toBe("Database connection failed");
  });
});
