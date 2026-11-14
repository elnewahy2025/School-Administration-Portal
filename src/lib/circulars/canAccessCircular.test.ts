import { describe, it, expect } from "vitest";
import { canAccessCircular } from "./canAccessCircular";

describe("canAccessCircular", () => {
  it("allows platform owner regardless of schoolId", () => {
    expect(canAccessCircular("school-a", null, true)).toBe(true);
    expect(canAccessCircular("school-a", "school-b", true)).toBe(true);
  });

  it("allows non-owner only when user school matches circular school", () => {
    expect(canAccessCircular("school-a", "school-a", false)).toBe(true);
    expect(canAccessCircular("school-a", "school-b", false)).toBe(false);
    expect(canAccessCircular("school-a", null, false)).toBe(false);
  });
});
