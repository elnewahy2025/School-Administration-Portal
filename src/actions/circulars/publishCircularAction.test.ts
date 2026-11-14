import { describe, it, expect, vi, beforeEach } from "vitest";
import { publishCircularAction } from "./publishCircularAction";

const { mockGetCurrentProfile, mockHasPermission, mockDispatchCircularNotification } = vi.hoisted(
  () => ({
    mockGetCurrentProfile: vi.fn(),
    mockHasPermission: vi.fn(),
    mockDispatchCircularNotification: vi.fn(),
  }),
);

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth/getCurrentProfile", () => ({
  getCurrentProfile: () => mockGetCurrentProfile(),
}));

vi.mock("@/lib/rbac/hasPermission", () => ({
  hasPermission: (perm: string, schoolId: string) => mockHasPermission(perm, schoolId),
}));

vi.mock("@/lib/circulars/dispatchCircularNotification", () => ({
  dispatchCircularNotification: (sb: unknown, params: unknown) =>
    mockDispatchCircularNotification(sb, params),
}));

const mockUpdate = vi.fn();
vi.mock("@/lib/supabase", () => ({
  createSupabaseServerClient: vi.fn().mockResolvedValue({
    from: () => ({
      update: (...args: unknown[]) => mockUpdate(...args),
    }),
  }),
}));

describe("publishCircularAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws authentication error if no profile or school_id", async () => {
    mockGetCurrentProfile.mockResolvedValueOnce(null);

    const result = await publishCircularAction("circ-1");
    expect(result.success).toBe(false);
    expect(result.error).toContain("No school associated with profile");
  });

  it("throws forbidden error if user lacks circular.publish permission", async () => {
    mockGetCurrentProfile.mockResolvedValueOnce({ id: "user-1", school_id: "school-1" });
    mockHasPermission.mockResolvedValueOnce(false);

    const result = await publishCircularAction("circ-1");
    expect(result.success).toBe(false);
    expect(result.error).toContain("Unauthorized");
  });

  it("publishes circular and triggers notification dispatch", async () => {
    mockGetCurrentProfile.mockResolvedValueOnce({ id: "user-1", school_id: "school-1" });
    mockHasPermission.mockResolvedValueOnce(true);
    mockUpdate.mockReturnValueOnce({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    });

    const result = await publishCircularAction("circ-1");
    expect(result.success).toBe(true);
    expect(mockDispatchCircularNotification).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        schoolId: "school-1",
        circularId: "circ-1",
        publisherId: "user-1",
      }),
    );
  });
});
