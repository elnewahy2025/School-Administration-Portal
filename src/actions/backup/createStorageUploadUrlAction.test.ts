import { describe, it, expect, vi, beforeEach } from "vitest";
import { createStorageUploadUrlAction } from "./createStorageUploadUrlAction";
import * as assertCanManageBackupModule from "@/lib/backup/assertCanManageBackup";

const mockCreateSignedUploadUrl = vi.fn();
vi.mock("@/lib/supabase", () => ({
  createSupabaseAdminClient: vi.fn().mockReturnValue({
    storage: {
      from: vi.fn().mockReturnValue({
        createSignedUploadUrl: (...args: unknown[]) => mockCreateSignedUploadUrl(...args),
      }),
    },
  }),
}));

describe("createStorageUploadUrlAction", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockCreateSignedUploadUrl.mockReset();
  });

  it("returns error if caller is unauthorized", async () => {
    vi.spyOn(assertCanManageBackupModule, "assertCanManageBackup").mockResolvedValue({
      allowed: false,
      isOwner: false,
      schoolId: null,
      userId: null,
      userEmail: null,
    });

    const res = await createStorageUploadUrlAction({
      bucket: "public-assets",
      path: "school-1/logo.png",
    });
    expect(res.success).toBe(false);
    expect(res.error).toContain("Unauthorized");
  });

  it("rejects unpermitted bucket", async () => {
    vi.spyOn(assertCanManageBackupModule, "assertCanManageBackup").mockResolvedValue({
      allowed: true,
      isOwner: true,
      schoolId: "school-1",
      userId: "user-1",
      userEmail: "owner@example.com",
    });

    const res = await createStorageUploadUrlAction({
      bucket: "other-bucket",
      path: "school-1/logo.png",
    });
    expect(res.success).toBe(false);
    expect(res.error).toContain("Invalid or unpermitted storage bucket");
  });

  it("rejects path traversal", async () => {
    vi.spyOn(assertCanManageBackupModule, "assertCanManageBackup").mockResolvedValue({
      allowed: true,
      isOwner: true,
      schoolId: "school-1",
      userId: "user-1",
      userEmail: "owner@example.com",
    });

    const res = await createStorageUploadUrlAction({
      bucket: "public-assets",
      path: "../malicious/path.png",
    });
    expect(res.success).toBe(false);
    expect(res.error).toContain("Invalid storage file path");
  });

  it("rejects file belonging to another school when operator has school scope", async () => {
    vi.spyOn(assertCanManageBackupModule, "assertCanManageBackup").mockResolvedValue({
      allowed: true,
      isOwner: false,
      schoolId: "school-1",
      userId: "user-1",
      userEmail: "principal@example.com",
    });

    const res = await createStorageUploadUrlAction({
      bucket: "public-assets",
      path: "school-999/logo.png",
    });
    expect(res.success).toBe(false);
    expect(res.error).toContain("outside the assigned school");
  });

  it("creates signed upload url successfully when authorized", async () => {
    vi.spyOn(assertCanManageBackupModule, "assertCanManageBackup").mockResolvedValue({
      allowed: true,
      isOwner: true,
      schoolId: "school-1",
      userId: "user-1",
      userEmail: "owner@example.com",
    });

    mockCreateSignedUploadUrl.mockResolvedValue({
      data: {
        signedUrl: "https://storage.example.com/upload/sign",
        token: "upload-token-123",
        path: "school-1/logo.png",
      },
      error: null,
    });

    const res = await createStorageUploadUrlAction({
      bucket: "public-assets",
      path: "school-1/logo.png",
    });

    expect(res.success).toBe(true);
    if (!res.success) throw new Error("Expected success");
    expect(res.signedUrl).toBe("https://storage.example.com/upload/sign");
    expect(res.token).toBe("upload-token-123");
  });
});
