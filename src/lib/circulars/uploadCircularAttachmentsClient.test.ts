import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockUpload, mockRecordAction } = vi.hoisted(() => ({
  mockUpload: vi.fn(),
  mockRecordAction: vi.fn(),
}));

vi.mock("@/lib/supabase/createSupabaseBrowserClient", () => ({
  createSupabaseBrowserClient: () => ({
    storage: {
      from: () => ({
        upload: mockUpload,
      }),
    },
  }),
}));

vi.mock("@/actions/circulars/recordCircularAttachmentAction", () => ({
  recordCircularAttachmentAction: (...args: unknown[]) => mockRecordAction(...args),
}));

import { uploadCircularAttachmentsClient } from "./uploadCircularAttachmentsClient";

describe("uploadCircularAttachmentsClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success immediately if file list is empty", async () => {
    const res = await uploadCircularAttachmentsClient({
      files: [],
      circularId: "circ-1",
      schoolId: "school-1",
    });
    expect(res).toEqual({ success: true });
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it("uploads files directly to storage and records each attachment", async () => {
    mockUpload.mockResolvedValue({ error: null });
    mockRecordAction.mockResolvedValue({ success: true });

    const file1 = new File(["dummy 1"], "doc1.pdf", { type: "application/pdf" });
    const file2 = new File(["dummy 2"], "doc2.png", { type: "image/png" });
    const progressSpy = vi.fn();

    const res = await uploadCircularAttachmentsClient({
      files: [file1, file2],
      circularId: "circ-100",
      schoolId: "school-99",
      onProgress: progressSpy,
    });

    expect(res).toEqual({ success: true });
    expect(mockUpload).toHaveBeenCalledTimes(2);
    expect(mockRecordAction).toHaveBeenCalledTimes(2);
    expect(progressSpy).toHaveBeenNthCalledWith(1, 1, 2);
    expect(progressSpy).toHaveBeenNthCalledWith(2, 2, 2);
  });

  it("stops and returns error if storage upload fails", async () => {
    mockUpload.mockResolvedValueOnce({ error: { message: "Network error" } });

    const file = new File(["dummy"], "doc.pdf", { type: "application/pdf" });

    const res = await uploadCircularAttachmentsClient({
      files: [file],
      circularId: "circ-100",
      schoolId: "school-99",
    });

    expect(res.success).toBe(false);
    expect(res.error).toContain("Network error");
    expect(mockRecordAction).not.toHaveBeenCalled();
  });
});
