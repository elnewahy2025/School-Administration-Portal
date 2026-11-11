/**
 * Parses an ISO date string with explicit UTC or offset notation.
 */
export function parseExplicitDateTime(input: string): Date | null {
  if (!input.includes("Z") && !/[+-]\d{2}:?\d{2}$/.test(input)) {
    return null;
  }
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}
