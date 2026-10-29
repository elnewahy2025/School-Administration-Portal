import { hasValidFileSignature } from "./hasValidFileSignature";

export type UploadRules = {
  allowedMime: readonly string[];
  maxBytes: number;
  invalidFormatMessage: string;
  tooLargeMessage: string;
  contentMismatchMessage: string;
};

export type UploadValidation =
  | { bytes: Uint8Array; error?: never }
  | { bytes?: never; error: string };

/**
 * Validates an upload before anything is written.
 *
 * Actions call this *before* creating the parent row so a rejected file
 * cannot leave behind a ticket or circular that is missing its attachment.
 * The uploaders call the same function, so the rules cannot drift between the
 * two entry points (H-18).
 */
export async function validateStorageUpload(
  file: File,
  rules: UploadRules,
): Promise<UploadValidation> {
  if (!rules.allowedMime.includes(file.type)) {
    return { error: rules.invalidFormatMessage };
  }

  if (file.size > rules.maxBytes) {
    return { error: rules.tooLargeMessage };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasValidFileSignature(bytes, file.type)) {
    return { error: rules.contentMismatchMessage };
  }

  return { bytes };
}
