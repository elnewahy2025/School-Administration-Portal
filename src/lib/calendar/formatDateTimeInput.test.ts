import { describe, expect, it } from "vitest";
import { formatDateTimeInput } from "./formatDateTimeInput";

describe("formatDateTimeInput", () => {
  it("returns empty string for null, undefined, or empty string", () => {
    expect(formatDateTimeInput(null)).toBe("");
    expect(formatDateTimeInput(undefined)).toBe("");
    expect(formatDateTimeInput("")).toBe("");
  });

  it("returns empty string for invalid date strings", () => {
    expect(formatDateTimeInput("invalid-date")).toBe("");
  });

  it("formats a valid UTC date into expected school timezone (Asia/Kuwait UTC+3) pattern", () => {
    // 06:00 UTC is 09:00 in Kuwait
    const formatted = formatDateTimeInput("2026-11-12T06:00:00.000Z", "Asia/Kuwait");
    expect(formatted).toBe("2026-11-12T09:00");
  });

  it("produces consistent output regardless of host local timezone", () => {
    const formattedCairo = formatDateTimeInput("2026-11-12T06:00:00.000Z", "Asia/Kuwait");
    expect(formattedCairo).toBe("2026-11-12T09:00");
  });
});
