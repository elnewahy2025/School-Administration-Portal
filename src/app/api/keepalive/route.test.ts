import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/supabase", () => ({
  pingSupabaseDatabase: vi.fn().mockResolvedValue({
    success: true,
    latencyMs: 120,
    timestamp: "2026-10-25T00:00:00.000Z",
  }),
}));

import { GET } from "./route";

describe("GET /api/keepalive", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.CRON_SECRET;
  });

  it("returns 200 and success status on ping", async () => {
    const req = new Request("http://localhost:3000/api/keepalive");
    const response = await GET(req);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.success).toBe(true);
    expect(body.latencyMs).toBe(120);
  });

  it("enforces CRON_SECRET when configured", async () => {
    process.env.CRON_SECRET = "test-secret-123";

    // Request without auth header
    const unauthReq = new Request("http://localhost:3000/api/keepalive");
    const unauthRes = await GET(unauthReq);
    expect(unauthRes.status).toBe(401);

    // Request with valid auth header
    const authReq = new Request("http://localhost:3000/api/keepalive", {
      headers: { Authorization: "Bearer test-secret-123" },
    });
    const authRes = await GET(authReq);
    expect(authRes.status).toBe(200);
  });
});
