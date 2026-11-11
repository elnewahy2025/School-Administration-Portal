import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  getClientEnv: vi.fn(() => ({
    NEXT_PUBLIC_SUPABASE_URL: "https://school.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  })),
}));

import { getCalendarImageUrl } from "./getCalendarImageUrl";

describe("getCalendarImageUrl", () => {
  it("returns null for null, undefined, or empty path", () => {
    expect(getCalendarImageUrl(null)).toBeNull();
    expect(getCalendarImageUrl(undefined)).toBeNull();
    expect(getCalendarImageUrl("")).toBeNull();
    expect(getCalendarImageUrl("   ")).toBeNull();
  });

  it("returns full external URL as is", () => {
    expect(getCalendarImageUrl("https://example.com/image.png")).toBe(
      "https://example.com/image.png",
    );
    expect(getCalendarImageUrl("http://example.com/image.png")).toBe(
      "http://example.com/image.png",
    );
  });

  it("resolves storage relative path into full public-assets URL", () => {
    const result = getCalendarImageUrl("school-1/calendar/123_pic.jpg");
    expect(result).toBe(
      "https://school.supabase.co/storage/v1/object/public/public-assets/school-1/calendar/123_pic.jpg",
    );
  });

  it("strips leading slashes from relative path", () => {
    const result = getCalendarImageUrl("///school-1/calendar/123_pic.jpg");
    expect(result).toBe(
      "https://school.supabase.co/storage/v1/object/public/public-assets/school-1/calendar/123_pic.jpg",
    );
  });
});
