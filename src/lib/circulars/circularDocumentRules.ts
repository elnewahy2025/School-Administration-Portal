import type { UploadRules } from "@/lib/storage/validateStorageUpload";

/**
 * The acceptance rules for `circular-attachments`. Kept in one place because
 * both the uploader and the circular actions validate against them.
 */
export const circularDocumentRules: UploadRules = {
  allowedMime: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  maxBytes: 25 * 1024 * 1024,
  invalidFormatMessage:
    "Invalid document format. PDF, images (JPG, PNG, WebP), Word, and Excel files are allowed.",
  tooLargeMessage: "File exceeds 25MB limit.",
  contentMismatchMessage: "File content does not match its declared type.",
};
