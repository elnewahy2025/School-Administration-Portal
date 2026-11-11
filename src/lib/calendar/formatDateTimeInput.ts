export function formatDateTimeInput(dateStr?: string | null, timeZone = "Asia/Kuwait"): string {
  if (!dateStr || typeof dateStr !== "string") return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";

  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const partMap: Record<string, string> = {};
    for (const part of parts) {
      partMap[part.type] = part.value;
    }

    const year = partMap.year;
    const month = partMap.month;
    const day = partMap.day;
    let hours = partMap.hour;
    if (hours === "24") hours = "00";
    const minutes = partMap.minute;

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    const pad = (n: number) => String(n).padStart(2, "0");
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
