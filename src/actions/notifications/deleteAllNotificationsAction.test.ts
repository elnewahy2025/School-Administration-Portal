import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteAllNotificationsAction } from "./deleteAllNotificationsAction";

const mockDelete = vi.fn();
const mockEqUser = vi.fn();
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

describe("deleteAllNotificationsAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockEqUser.mockResolvedValue({ error: null });
    mockDelete.mockReturnValue({ eq: mockEqUser });
    mockFrom.mockReturnValue({ delete: mockDelete });
  });

  it("fails when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error("Unauthorized") });

    const res = await deleteAllNotificationsAction();
    expect(res.success).toBe(false);
    expect(res.error).toBe("Unauthorized");
  });

  it("deletes all notifications scoped to the authenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-123" } }, error: null });

    const res = await deleteAllNotificationsAction();

    expect(res.success).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("notifications");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEqUser).toHaveBeenCalledWith("user_id", "user-123");
  });

  it("handles database errors gracefully", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-123" } }, error: null });
    mockEqUser.mockResolvedValue({ error: { message: "DB Error", code: "500" } });

    const res = await deleteAllNotificationsAction();
    expect(res.success).toBe(false);
    expect(res.error).toBe("A database error occurred");
  });
});
