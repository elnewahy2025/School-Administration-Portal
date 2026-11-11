import { adjustToTimeZone } from "./adjustToTimeZone";
import { parseExplicitDateTime } from "./parseExplicitDateTime";

const DATETIME_REGEX = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/;

/**
 * Parses an HTML datetime-local string (e.g. "2026-11-12T09:00") into a UTC Date
 * assuming the specified school timeZone (defaults to "Asia/Kuwait").
 */
export function parseCalendarDateTime(
  input?: string | null,
  timeZone = "Asia/Kuwait",
): Date | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  const explicit = parseExplicitDateTime(trimmed);
  if (explicit) return explicit;

  const match = DATETIME_REGEX.exec(trimmed);
  if (!match) return null;

  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const h = Number(match[4] || 0);
  const min = Number(match[5] || 0);
  const s = Number(match[6] || 0);

  const utcDate = new Date(Date.UTC(y, m - 1, d, h, min, s));
  return adjustToTimeZone(utcDate, timeZone);
}
