export type AttachmentKind = "image" | "pdf" | "word" | "excel" | "document";

const IMAGE_EXT_REGEX = /\.(jpe?g|png|webp|gif|svg|bmp)$/i;
const WORD_EXT_REGEX = /\.(docx|doc)$/i;
const EXCEL_EXT_REGEX = /\.(xlsx|xls|csv)$/i;

function isOfficeDocument(path: string, mime: string, kind: "word" | "excel"): boolean {
  if (kind === "word") {
    return mime.includes("word") || WORD_EXT_REGEX.test(path);
  }
  return mime.includes("excel") || mime.includes("spreadsheetml") || EXCEL_EXT_REGEX.test(path);
}

export function getAttachmentKind(path: string, mime?: string | null): AttachmentKind {
  const cleanMime = mime?.toLowerCase() ?? "";
  if (cleanMime.startsWith("image/") || IMAGE_EXT_REGEX.test(path)) {
    return "image";
  }
  if (cleanMime === "application/pdf" || path.toLowerCase().endsWith(".pdf")) {
    return "pdf";
  }
  if (isOfficeDocument(path, cleanMime, "word")) {
    return "word";
  }
  if (isOfficeDocument(path, cleanMime, "excel")) {
    return "excel";
  }
  return "document";
}
