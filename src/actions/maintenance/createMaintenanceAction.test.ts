import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createMaintenanceAction } from "./createMaintenanceAction";
import * as authModule from "@/lib/maintenance/assertCanCreateMaintenance";
import * as recordModule from "@/lib/maintenance/createMaintenanceRecord";
import * as notifyModule from "@/lib/maintenance/notifyMaintenanceSubmission";

vi.mock("@/lib/supabase", () => ({
  createSupabaseServerClient: vi.fn().mockResolvedValue({}),
}));
vi.mock("@/lib/maintenance/handleOptionalPhoto", () => ({
  handleOptionalPhoto: vi.fn().mockResolvedValue({}),
}));
vi.mock("@/lib/maintenance/insertMaintenanceUpdate", () => ({
  insertMaintenanceUpdate: vi.fn().mockResolvedValue({}),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("createMaintenanceAction - upload validation upfront", () => {
  it("rejects invalid photo upfront and never creates a maintenance ticket", async () => {
    vi.spyOn(authModule, "assertCanCreateMaintenance").mockResolvedValue({
      profileId: "user-1",
      schoolId: "school-1",
      departmentId: "dept-1",
    });

    const createRecordSpy = vi.spyOn(recordModule, "createMaintenanceRecord");

    const formData = new FormData();
    formData.append("title", "Broken AC");
    formData.append("description", "Not cooling");
    formData.append("category", "electrical");
    formData.append("priority", "medium");
    formData.append(
      "photo",
      new File(["<svg>malicious</svg>"], "test.svg", { type: "image/svg+xml" }),
    );

    const result = await createMaintenanceAction(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    // Verification: createMaintenanceRecord was never called
    expect(createRecordSpy).not.toHaveBeenCalled();
  });

  it("creates maintenance ticket and triggers notification to school admins", async () => {
    vi.spyOn(authModule, "assertCanCreateMaintenance").mockResolvedValue({
      profileId: "user-1",
      schoolId: "school-1",
      departmentId: "dept-1",
    });

    vi.spyOn(recordModule, "createMaintenanceRecord").mockResolvedValue({
      requestId: "req-123",
    });

    const notifySpy = vi
      .spyOn(notifyModule, "notifyMaintenanceSubmission")
      .mockResolvedValue({ delivered: 1 });

    const formData = new FormData();
    formData.append("title", "Broken Door");
    formData.append("description", "Handle is missing");
    formData.append("category", "plumbing");
    formData.append("priority", "deferrable");

    const result = await createMaintenanceAction(formData);

    expect(result.success).toBe(true);
    expect(notifySpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        schoolId: "school-1",
        requestId: "req-123",
        reporterId: "user-1",
      }),
    );
  });
});
