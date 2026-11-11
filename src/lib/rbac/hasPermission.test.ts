import { describe, expect, it, vi, beforeEach } from "vitest";

const mockRpc = vi.fn();
vi.mock("@/lib/supabase", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    rpc: mockRpc,
  })),
}));

vi.mock("./getEffectivePermissions", () => ({
  getEffectivePermissions: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logError: vi.fn(),
}));

import { hasPermission } from "./hasPermission";
import { getEffectivePermissions } from "./getEffectivePermissions";

describe("hasPermission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes schoolId and departmentId to has_permission RPC", async () => {
    mockRpc.mockResolvedValue({ data: true, error: null });

    const result = await hasPermission("users.manage", "school-1", "dept-1");

    expect(result).toBe(true);
    expect(mockRpc).toHaveBeenCalledWith("has_permission", {
      p_permission: "users.manage",
      p_school: "school-1",
      p_department: "dept-1",
    });
  });

  it("passes null for missing schoolId and departmentId on school-scoped checks", async () => {
    mockRpc.mockResolvedValue({ data: false, error: null });
    vi.mocked(getEffectivePermissions).mockResolvedValue([]);

    const result = await hasPermission("roles.manage");

    expect(result).toBe(false);
    expect(mockRpc).toHaveBeenCalledWith("has_permission", {
      p_permission: "roles.manage",
      p_school: null,
      p_department: null,
    });
  });

  it("falls back to getEffectivePermissions when departmentId is omitted and RPC returns false", async () => {
    mockRpc.mockResolvedValue({ data: false, error: null });
    vi.mocked(getEffectivePermissions).mockResolvedValue(["maintenance.assign"]);

    const result = await hasPermission("maintenance.assign", "school-1");

    expect(result).toBe(true);
    expect(getEffectivePermissions).toHaveBeenCalledWith("school-1");
  });

  it("does not fall back to getEffectivePermissions when departmentId is provided", async () => {
    mockRpc.mockResolvedValue({ data: false, error: null });

    const result = await hasPermission("maintenance.assign", "school-1", "dept-1");

    expect(result).toBe(false);
    expect(getEffectivePermissions).not.toHaveBeenCalled();
  });

  it("throws mapped database error if RPC fails and fallback does not match", async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: "DB timeout", code: "50000" } });
    vi.mocked(getEffectivePermissions).mockResolvedValue([]);

    await expect(hasPermission("users.manage", "school-1")).rejects.toThrow();
  });
});
