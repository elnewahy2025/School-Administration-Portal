import { describe, it, expect, vi } from "vitest";

const { mockFetch } = vi.hoisted(() => ({
  mockFetch: vi.fn(),
}));

vi.mock("@/lib/circulars/fetchCircularAttachmentFile", () => ({
  fetchCircularAttachmentFile: (...args: unknown[]) => mockFetch(...args),
}));

import { GET } from "./route";

describe("GET /api/circulars/attachments/[id]/preview", () => {
  it("streams the file bytes with inline disposition", async () => {
    const dummyBytes = new Uint8Array([1, 2, 3]).buffer;
    mockFetch.mockResolvedValue({
      bytes: dummyBytes,
      mime: "application/pdf",
      fileName: "test.pdf",
    });

    const req = new Request("http://localhost/api/circulars/attachments/att-1/preview");
    const res = await GET(req, { params: Promise.resolve({ id: "att-1" }) });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
    expect(res.headers.get("Content-Disposition")).toContain("inline");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
    expect(res.headers.get("Content-Security-Policy")).toBe("frame-ancestors 'self';");
  });
});

