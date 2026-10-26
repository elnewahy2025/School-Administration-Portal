export function buildCircularReminderBody(
  circularRef: string,
  circularTitle: string,
  customMessage?: string,
): string {
  const trimmed = customMessage?.trim();
  if (trimmed) return trimmed;

  if (circularRef) {
    return `يرجى مراجعة وتأكيد استلام التعميم الإداري رقم #${circularRef} (${circularTitle})`;
  }

  return "يرجى مراجعة وتأكيد استلام التعاميم الإدارية المعلقة لقسمكم";
}
