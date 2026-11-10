import { reportClientError } from "@/lib/logger/reportClientError";

/**
 * Fetches an attachment and returns a blob URL for it.
 *
 * A blob URL inherits the origin of the page that created it, which is what
 * keeps the document on the page origin when it is printed from a frame.
 * Returns null when the bytes cannot be fetched; the caller decides how to
 * continue.
 */
export async function fetchAttachmentAsObjectUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      reportClientError(
        new Error(`Attachment request failed with status ${res.status}`),
        "error",
      );
      return null;
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    reportClientError(error, "error");
    return null;
  }
}
