import type { CircularRow } from "./types";

export interface CircularMonthOption {
  key: string;
  label: string;
  count: number;
}

export function getCircularMonths(
  circulars: CircularRow[],
  locale: string,
): CircularMonthOption[] {
  const monthMap = new Map<string, { label: string; count: number; timestamp: number }>();

  for (const circular of circulars) {
    const rawDate = circular.publish_at || circular.created_at;
    if (!rawDate) continue;

    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) continue;

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const key = `${year}-${month}`;

    const existing = monthMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      const label = date.toLocaleDateString(locale, {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
      monthMap.set(key, {
        label,
        count: 1,
        timestamp: date.getTime(),
      });
    }
  }

  return Array.from(monthMap.entries())
    .sort((a, b) => b[1].timestamp - a[1].timestamp)
    .map(([key, data]) => ({
      key,
      label: data.label,
      count: data.count,
    }));
}
