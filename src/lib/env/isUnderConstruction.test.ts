import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { isUnderConstruction } from "./isUnderConstruction";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("isUnderConstruction", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it("returns false on localhost (VERCEL not set)", async () => {
    delete process.env.VERCEL;
    const result = await isUnderConstruction();
    expect(result).toBe(false);
  });

  it("returns false on localhost when VERCEL is 0", async () => {
    process.env.VERCEL = "0";
    const result = await isUnderConstruction();
    expect(result).toBe(false);
  });

  it("returns true on Vercel (VERCEL is 1)", async () => {
    process.env.VERCEL = "1";
    delete process.env.DISABLE_UNDER_CONSTRUCTION;
    delete process.env.UNDER_CONSTRUCTION_BYPASS_SECRET;

    const result = await isUnderConstruction();
    expect(result).toBe(true);
  });

  it("returns false on Vercel when DISABLE_UNDER_CONSTRUCTION is true", async () => {
    process.env.VERCEL = "1";
    process.env.DISABLE_UNDER_CONSTRUCTION = "true";

    const result = await isUnderConstruction();
    expect(result).toBe(false);
  });

  it("returns false on Vercel when bypass cookie matches secret", async () => {
    process.env.VERCEL = "1";
    process.env.UNDER_CONSTRUCTION_BYPASS_SECRET = "secret-123";

    const { cookies } = await import("next/headers");
    vi.mocked(cookies).mockResolvedValue({
      get: (name: string) => (name === "bypass_construction" ? { value: "secret-123" } : undefined),
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    const result = await isUnderConstruction();
    expect(result).toBe(false);
  });
});

