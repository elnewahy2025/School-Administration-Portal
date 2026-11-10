/**
 * Opens a document in a new tab.
 *
 * The fallback for a document the browser refuses to print from a frame: the
 * viewer that opens has its own print command.
 */
export function openDocumentInNewTab(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
