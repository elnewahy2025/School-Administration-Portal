import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSchoolStorageFilesAction } from "./getSchoolStorageFilesAction";
import * as assertCanManageBackupModule from "@/lib/backup/assertCanManageBackup";
import * as listStorageFilesModule from "@/lib/backup/listSchoolStorageFiles";

vi.mock("@/lib/supabase", () => ({
  createSupabaseAdminClient: vi.fn().mockReturnValue({}),
}));

describe("getSchoolStorageFilesAction", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns error if caller is unauthorized", async () => {
    vi.spyOn(assertCanManageBackupModule, "assertCanManageBackup").mockResolvedValue({
      allowed: false,
      isOwner: false,
      schoolId: null,
      userId: null,
      userEmail: null,
    });

    const result = await getSchoolStorageFilesAction();
    expect(result.success).toBe(false);
    expect(result.error).toContain("Unauthorized");
  });

  it("returns signed files if caller is authorized platform owner", async () => {
    vi.spyOn(assertCanManageBackupModule, "assertCanManageBackup").mockResolvedValue({
      allowed: true,
      isOwner: true,
      schoolId: "school-123",
      userId: "user-1",
      userEmail: "owner@example.com",
    });

    vi.spyOn(listStorageFilesModule, "listSchoolStorageFiles").mockResolvedValue([
      {
        bucket: "public-assets",
        path: "school-123/logo.png",
        signedUrl: "https://example.com/logo.png",
        size: 500,
      },
    ]);

    const result = await getSchoolStorageFilesAction();
    expect(result.success).toBe(true);
    expect(result.files).toHaveLength(1);
    expect(result.files?.[0].path).toBe("school-123/logo.png");
  });
});
