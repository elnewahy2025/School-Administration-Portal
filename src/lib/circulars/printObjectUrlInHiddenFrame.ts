import { reportClientError } from "@/lib/logger/reportClientError";

/**
 * Prints a document from a hidden frame.
 *
 * The document has to be a blob URL so the frame keeps the page origin. Chrome
 * renders a PDF inside its own viewer, which lives on a different origin, and
 * the browser then refuses the print call under the same-origin policy. That
 * refusal is reported and `onBlocked` is called so the caller can fall back to
 * opening the document in a tab, where the browser's own print command works.
 */
export function printObjectUrlInHiddenFrame(objectUrl: string, onBlocked: () => void): void {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.top = "-9999px";
  iframe.style.left = "-9999px";
  iframe.style.width = "1px";
  iframe.style.height = "1px";
  iframe.style.border = "none";
  iframe.src = objectUrl;

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (error) {
      reportClientError(error, "error");
      onBlocked();
    } finally {
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        iframe.remove();
      }, 60_000);
    }
  };

  document.body.appendChild(iframe);
}
