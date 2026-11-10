/**
 * Checks the leading bytes of an upload against its declared type.
 *
 * `file.type` is browser-supplied and can be anything; the storage bucket only
 * enforces the MIME string it is given. Comparing the leading bytes closes the
 * gap between "claims to be a PNG" and "is a PNG" (audit finding H-18).
 *
 * Only the four formats the app accepts are recognised. A PDF is allowed for
 * circular attachments; the image formats are shared by every uploader.
 */
const SIGNATURES: Record<string, { offset: number; bytes: number[] }[]> = {
  "image/jpeg": [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }],
  "image/png": [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
  "image/webp": [
    { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF
    { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] }, // WEBP
  ],
  "application/pdf": [{ offset: 0, bytes: [0x25, 0x50, 0x44, 0x46, 0x2d] }], // %PDF-
  "application/msword": [{ offset: 0, bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] }],
  "application/vnd.ms-excel": [
    { offset: 0, bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] },
  ],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    { offset: 0, bytes: [0x50, 0x4b, 0x03, 0x04] },
  ],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    { offset: 0, bytes: [0x50, 0x4b, 0x03, 0x04] },
  ],
};

export function hasValidFileSignature(bytes: Uint8Array, mime: string): boolean {
  const signatures = SIGNATURES[mime];
  if (!signatures) return false;

  return signatures.every(({ offset, bytes: expected }) =>
    expected.every((value, index) => bytes[offset + index] === value),
  );
}
