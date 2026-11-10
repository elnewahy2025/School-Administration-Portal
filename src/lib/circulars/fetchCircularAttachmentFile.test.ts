import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockProfile, mockIsOwner, mockSupabase, mockStorageDownload } = vi.hoisted(() => ({
  mockProfile: vi.fn(),
  mockIsOwner: vi.fn(),
  mockSupabase: {
    from: vi.fn(),
  },
  mockStorageDownload: vi.fn(),
}));

vi.mock("@/lib/auth/getCurrentProfile", () => ({
  getCurrentProfile: () => mockProfile(),
}));
vi.mock("@/lib/auth/isPlatformOwner", () => ({
  isPlatformOwner: () => mockIsOwner(),
}));
vi.mock("@/lib/supabase", () => ({
  createSupabaseServerClient: () => Promise.resolve(mockSupabase),
}));
vi.mock("./downloadAttachmentFromStorage", () => ({
  downloadAttachmentFromStorage: (...args: unknown[]) => mockStorageDownload(...args),
}));

import { fetchCircularAttachmentFile } from "./fetchCircularAttachmentFile";

describe("fetchCircularAttachmentFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws AuthenticationError when profile is missing", async () => {
    mockProfile.mockResolvedValue(null);
    await expect(fetchCircularAttachmentFile("att-1")).rejects.toThrow("Unauthorized");
  });

  it("throws ForbiddenError when attachment belongs to a different school", async () => {
    mockProfile.mockResolvedValue({ id: "u-1", school_id: "school-1" });
    mockIsOwner.mockResolvedValue(false);

    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: { id: "att-1", school_id: "school-OTHER", path: "school-OTHER/c-1/doc.pdf" },
      error: null,
    });
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle: maybeSingleMock })),
      })),
    });

    await expect(fetchCircularAttachmentFile("att-1")).rejects.toThrow("Access denied");
  });

  it("successfully returns attachment bytes and metadata when authorized", async () => {
    mockProfile.mockResolvedValue({ id: "u-1", school_id: "school-1" });
    mockIsOwner.mockResolvedValue(false);

    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: {
        id: "att-1",
        school_id: "school-1",
        path: "school-1/c-1/1700000_schedule.pdf",
        mime: "application/pdf",
      },
      error: null,
    });
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle: maybeSingleMock })),
      })),
    });

    const dummyBytes = new Uint8Array([1, 2, 3]).buffer;
    mockStorageDownload.mockResolvedValue({ bytes: dummyBytes, type: "application/pdf" });

    const result = await fetchCircularAttachmentFile("att-1");
    expect(result.fileName).toBe("schedule.pdf");
    expect(result.mime).toBe("application/pdf");
    expect(result.bytes.byteLength).toBe(3);
  });
});
