import { fetchAttachmentAsObjectUrl } from "./fetchAttachmentAsObjectUrl";
import { printObjectUrlInHiddenFrame } from "./printObjectUrlInHiddenFrame";
import { openDocumentInNewTab } from "./openDocumentInNewTab";

/**
 * Prints an attachment.
 *
 * The document is fetched first and printed from a blob URL, because a blob
 * inherits the page origin while the storage URL is cross-origin. A
 * cross-origin frame can never be printed programmatically - the browser
 * blocks the call - so the document is opened in a tab instead, where the
 * browser's own print command is available.
 */
export async function printAttachment(url?: string): Promise<void> {
  if (!url) return;

  const objectUrl = await fetchAttachmentAsObjectUrl(url);

  if (!objectUrl) {
    openDocumentInNewTab(url);
    return;
  }

  printObjectUrlInHiddenFrame(objectUrl, () => openDocumentInNewTab(url));
}
