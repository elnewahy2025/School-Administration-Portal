import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const { mockAssertCanManage, mockInsertCircularAttachment, mockSupabase } = vi.hoisted(() => ({
  mockAssertCanManage: vi.fn(),
  mockInsertCircularAttachment: vi.fn(),
  mockSupabase: {
    from: vi.fn(),
  },
}));

vi.mock("@/lib/circulars/assertCanManageCirculars", () => ({
  assertCanManageCirculars: () => mockAssertCanManage(),
}));
vi.mock("@/lib/circulars/insertCircularAttachment", () => ({
  insertCircularAttachment: (...args: unknown[]) => mockInsertCircularAttachment(...args),
}));
vi.mock("@/lib/supabase", () => ({
  createSupabaseServerClient: () => Promise.resolve(mockSupabase),
  createSupabaseAdminClient: () => mockSupabase,
}));

import { recordCircularAttachmentAction } from "./recordCircularAttachmentAction";

describe("recordCircularAttachmentAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("records attachment successfully when valid and authorized", async () => {
    mockAssertCanManage.mockResolvedValue({
      authorized: true,
      profileId: "user-1",
      schoolId: "school-1",
      isOwner: false,
    });

    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: { id: "circ-100" },
      error: null,
    });
    const eqSchoolMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
    const eqIdMock = vi.fn(() => ({ eq: eqSchoolMock }));
    const selectMock = vi.fn(() => ({ eq: eqIdMock }));
    mockSupabase.from.mockReturnValue({ select: selectMock });

    mockInsertCircularAttachment.mockResolvedValue({});

    const res = await recordCircularAttachmentAction({
      circularId: "circ-100",
      path: "school-1/circ-100/12345_document.pdf",
      mime: "application/pdf",
      sizeBytes: 1024 * 1024,
    });

    expect(res).toEqual({ success: true });
    expect(mockInsertCircularAttachment).toHaveBeenCalledWith(
      mockSupabase,
      expect.objectContaining({
        circularId: "circ-100",
        schoolId: "school-1",
        path: "school-1/circ-100/12345_document.pdf",
        uploadedBy: "user-1",
      }),
    );
  });

  it("rejects when storage path belongs to another school or circular", async () => {
    mockAssertCanManage.mockResolvedValue({
      authorized: true,
      profileId: "user-1",
      schoolId: "school-1",
      isOwner: false,
    });

    const res = await recordCircularAttachmentAction({
      circularId: "circ-100",
      path: "different-school/circ-100/12345_document.pdf",
      mime: "application/pdf",
      sizeBytes: 1024,
    });

    expect(res.success).toBe(false);
    expect(res.error).toContain("Invalid storage path");
  });

  it("rejects unauthorized caller", async () => {
    mockAssertCanManage.mockResolvedValue({
      authorized: false,
      error: "Unauthorized",
    });

    const res = await recordCircularAttachmentAction({
      circularId: "circ-100",
      path: "school-1/circ-100/12345_document.pdf",
      mime: "application/pdf",
      sizeBytes: 1024,
    });

    expect(res.success).toBe(false);
    expect(res.error).toContain("Unauthorized");
  });
});
