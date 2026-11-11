import { describe, expect, it } from "vitest";
import { parseCalendarDateTime } from "./parseCalendarDateTime";

describe("parseCalendarDateTime", () => {
  it("returns null for null, undefined, or empty string", () => {
    expect(parseCalendarDateTime(null)).toBeNull();
    expect(parseCalendarDateTime(undefined)).toBeNull();
    expect(parseCalendarDateTime("")).toBeNull();
    expect(parseCalendarDateTime("   ")).toBeNull();
  });

  it("parses naive datetime-local in Asia/Kuwait (UTC+3) to correct UTC ISO", () => {
    const result = parseCalendarDateTime("2026-11-12T09:00", "Asia/Kuwait");
    expect(result).not.toBeNull();
    expect(result?.toISOString()).toBe("2026-11-12T06:00:00.000Z");
  });

  it("preserves explicit ISO timestamps with Z", () => {
    const result = parseCalendarDateTime("2026-11-12T09:00:00.000Z");
    expect(result?.toISOString()).toBe("2026-11-12T09:00:00.000Z");
  });

  it("preserves explicit ISO timestamps with timezone offset", () => {
    const result = parseCalendarDateTime("2026-11-12T09:00:00+03:00");
    expect(result?.toISOString()).toBe("2026-11-12T06:00:00.000Z");
  });

  it("returns null for unparseable garbage", () => {
    expect(parseCalendarDateTime("invalid-date")).toBeNull();
  });
});
