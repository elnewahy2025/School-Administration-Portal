import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateMaintenanceRequestAction } from "./updateMaintenanceRequestAction";

const {
  mockGetCurrentProfile,
  mockIsPlatformOwner,
  mockHasPermission,
  mockGetMaintenanceRequestById,
  mockSupabaseAdmin,
} = vi.hoisted(() => {
  const updateFn = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
  const insertFn = vi.fn().mockResolvedValue({ error: null });
  return {
    mockGetCurrentProfile: vi.fn(),
    mockIsPlatformOwner: vi.fn(),
    mockHasPermission: vi.fn(),
    mockGetMaintenanceRequestById: vi.fn(),
    mockSupabaseAdmin: {
      from: vi.fn((table: string) => {
        if (table === "maintenance_requests") {
          return { update: updateFn };
        }
        return { insert: insertFn };
      }),
    },
  };
});

vi.mock("@/lib/auth/getCurrentProfile", () => ({
  getCurrentProfile: () => mockGetCurrentProfile(),
}));

vi.mock("@/lib/auth/isPlatformOwner", () => ({
  isPlatformOwner: (...args: unknown[]) => mockIsPlatformOwner(...args),
}));

vi.mock("@/lib/rbac/hasPermission", () => ({
  hasPermission: (...args: unknown[]) => mockHasPermission(...args),
}));

vi.mock("@/lib/maintenance/getMaintenanceRequestById", () => ({
  getMaintenanceRequestById: (...args: unknown[]) => mockGetMaintenanceRequestById(...args),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createSupabaseServerClient: vi.fn().mockResolvedValue({}),
  createSupabaseAdminClient: vi.fn().mockReturnValue(mockSupabaseAdmin),
}));

describe("updateMaintenanceRequestAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPayload = {
    requestId: "req-1",
    title: "Updated Title",
    description: "Updated Description",
    category: "plumbing",
  };

  it("fails when not authenticated", async () => {
    mockGetCurrentProfile.mockResolvedValue(null);
    const res = await updateMaintenanceRequestAction(validPayload);
    expect(res.success).toBe(false);
    expect(res.error).toBe("Authentication required");
  });

  it("fails when validation fails", async () => {
    mockGetCurrentProfile.mockResolvedValue({ id: "user-1" });
    const res = await updateMaintenanceRequestAction({ ...validPayload, title: " " });
    expect(res.success).toBe(false);
    expect(res.error).toBe("Title must be at least 2 characters long");
  });

  it("fails when ticket not found", async () => {
    mockGetCurrentProfile.mockResolvedValue({ id: "user-1", school_id: "school-1" });
    mockGetMaintenanceRequestById.mockResolvedValue(null);
    const res = await updateMaintenanceRequestAction(validPayload);
    expect(res.success).toBe(false);
    expect(res.error).toBe("Maintenance request not found");
  });

  it("fails when unauthorized", async () => {
    mockGetCurrentProfile.mockResolvedValue({ id: "user-1", school_id: "school-1" });
    mockGetMaintenanceRequestById.mockResolvedValue({
      id: "req-1",
      school_id: "school-1",
      reporter_id: "other-user",
    });
    mockIsPlatformOwner.mockResolvedValue(false);
    mockHasPermission.mockResolvedValue(false);

    const res = await updateMaintenanceRequestAction(validPayload);
    expect(res.success).toBe(false);
    expect(res.error).toBe("Unauthorized to update maintenance request");
  });

  it("succeeds when user is reporter", async () => {
    mockGetCurrentProfile.mockResolvedValue({ id: "user-1", school_id: "school-1" });
    mockGetMaintenanceRequestById.mockResolvedValue({
      id: "req-1",
      school_id: "school-1",
      reporter_id: "user-1",
    });
    mockIsPlatformOwner.mockResolvedValue(false);
    mockHasPermission.mockResolvedValue(false);

    const res = await updateMaintenanceRequestAction(validPayload);
    expect(res.success).toBe(true);
  });

  it("succeeds when user is platform owner", async () => {
    mockGetCurrentProfile.mockResolvedValue({ id: "owner-1", school_id: "school-1" });
    mockGetMaintenanceRequestById.mockResolvedValue({
      id: "req-1",
      school_id: "school-1",
      reporter_id: "other-user",
    });
    mockIsPlatformOwner.mockResolvedValue(true);

    const res = await updateMaintenanceRequestAction(validPayload);
    expect(res.success).toBe(true);
  });
});
