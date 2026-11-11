import { getClientEnv } from "@/lib/env";

export function getCalendarImageUrl(imagePath?: string | null): string | null {
  if (!imagePath || typeof imagePath !== "string") return null;
  const trimmed = imagePath.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const rawBaseUrl = getClientEnv().NEXT_PUBLIC_SUPABASE_URL;
  if (!rawBaseUrl) {
    return trimmed;
  }

  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const normalizedPath = trimmed.replace(/^\/+/, "");
  return `${baseUrl}/storage/v1/object/public/public-assets/${normalizedPath}`;
}
