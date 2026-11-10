import { describe, it, expect } from "vitest";
import { getCircularMonths } from "./getCircularMonths";
import type { CircularRow } from "./types";

describe("getCircularMonths", () => {
  it("groups circulars by month in descending order", () => {
    const circulars: Partial<CircularRow>[] = [
      { id: "1", publish_at: "2026-11-05T10:00:00Z" },
      { id: "2", publish_at: "2026-11-10T12:00:00Z" },
      { id: "3", publish_at: "2026-10-15T09:00:00Z" },
    ];

    const months = getCircularMonths(circulars as CircularRow[], "en");
    expect(months).toHaveLength(2);
    expect(months[0].key).toBe("2026-11");
    expect(months[0].count).toBe(2);
    expect(months[1].key).toBe("2026-10");
    expect(months[1].count).toBe(1);
  });

  it("returns empty array when no circulars are provided", () => {
    expect(getCircularMonths([], "ar")).toEqual([]);
  });
});

