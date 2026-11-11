/**
 * Adjusts a local-interpretation UTC date to the corresponding target timezone offset.
 */
export function adjustToTimeZone(utcDate: Date, timeZone: string): Date {
  try {
    const invDate = new Date(utcDate.toLocaleString("en-US", { timeZone: "UTC" }));
    const targetDate = new Date(utcDate.toLocaleString("en-US", { timeZone }));
    const diff = targetDate.getTime() - invDate.getTime();
    return new Date(utcDate.getTime() - diff);
  } catch {
    return utcDate;
  }
}
