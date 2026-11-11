import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAssertCanManageCalendar, mockIsPlatformOwner, mockDeleteCalendarEventRecord } =
  vi.hoisted(() => ({
    mockAssertCanManageCalendar: vi.fn(),
    mockIsPlatformOwner: vi.fn(),
    mockDeleteCalendarEventRecord: vi.fn(),
  }));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createSupabaseServerClient: vi.fn().mockResolvedValue({}),
}));

vi.mock("@/lib/calendar/assertCanManageCalendar", () => ({
  assertCanManageCalendar: () => mockAssertCanManageCalendar(),
}));

vi.mock("@/lib/auth/isPlatformOwner", () => ({
  isPlatformOwner: () => mockIsPlatformOwner(),
}));

vi.mock("@/lib/calendar/deleteCalendarEventRecord", () => ({
  deleteCalendarEventRecord: (...args: unknown[]) => mockDeleteCalendarEventRecord(...args),
}));

import { deleteCalendarEventAction } from "./deleteCalendarEventAction";

describe("deleteCalendarEventAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns validation error when eventId is missing", async () => {
    const res = await deleteCalendarEventAction("");
    expect(res.success).toBe(false);
    expect(res.error).toBe("Event ID is required");
  });

  it("returns error when deleteCalendarEventRecord fails", async () => {
    mockAssertCanManageCalendar.mockResolvedValue({
      schoolId: "sch-1",
      profileId: "usr-1",
    });
    mockIsPlatformOwner.mockResolvedValue(false);
    mockDeleteCalendarEventRecord.mockResolvedValue({
      success: false,
      error: "Event not found or access denied",
    });

    const res = await deleteCalendarEventAction("ev-123");
    expect(res.success).toBe(false);
    expect(res.error).toBe("Event not found or access denied");
  });

  it("successfully deletes event and returns success: true", async () => {
    mockAssertCanManageCalendar.mockResolvedValue({
      schoolId: "sch-1",
      profileId: "usr-1",
    });
    mockIsPlatformOwner.mockResolvedValue(true);
    mockDeleteCalendarEventRecord.mockResolvedValue({
      success: true,
    });

    const res = await deleteCalendarEventAction("ev-123");
    expect(res.success).toBe(true);
    expect(mockDeleteCalendarEventRecord).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        eventId: "ev-123",
        schoolId: "sch-1",
        actorId: "usr-1",
        isOwner: true,
      }),
    );
  });
});
