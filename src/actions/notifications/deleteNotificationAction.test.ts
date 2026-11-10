import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteNotificationAction } from "./deleteNotificationAction";

const mockDelete = vi.fn();
const mockEqUser = vi.fn();
const mockEqId = vi.fn();
const mockFrom = vi.fn();
const mockGetUser = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createSupabaseServerClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: () => mockGetUser(),
    },
  }),
  createSupabaseAdminClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

describe("deleteNotificationAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockEqUser.mockResolvedValue({ error: null });
    mockEqId.mockReturnValue({ eq: mockEqUser });
    mockDelete.mockReturnValue({ eq: mockEqId });
    mockFrom.mockReturnValue({ delete: mockDelete });
  });

  it("fails when notificationId is missing", async () => {
    const res = await deleteNotificationAction("");
    expect(res.success).toBe(false);
    expect(res.error).toBe("Notification ID is required");
  });

  it("fails when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error("Unauthorized") });

    const res = await deleteNotificationAction("notif-1");
    expect(res.success).toBe(false);
    expect(res.error).toBe("Unauthorized");
  });

  it("deletes notification scoped to the authenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-123" } }, error: null });

    const res = await deleteNotificationAction("notif-1");

    expect(res.success).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("notifications");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEqId).toHaveBeenCalledWith("id", "notif-1");
    expect(mockEqUser).toHaveBeenCalledWith("user_id", "user-123");
  });

  it("handles database errors gracefully", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-123" } }, error: null });
    mockEqUser.mockResolvedValue({ error: { message: "DB Error", code: "500" } });

    const res = await deleteNotificationAction("notif-1");
    expect(res.success).toBe(false);
    expect(res.error).toBe("A database error occurred");
  });
});
