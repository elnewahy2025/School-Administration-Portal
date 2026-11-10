import { circularDocumentRules } from "./circularDocumentRules";
import { ValidationError } from "@/lib/errors/ValidationError";

export interface AttachmentValidationTarget {
  circularId: string;
  path: string;
  sizeBytes: number | null;
}

export function assertValidAttachmentRecord(
  params: AttachmentValidationTarget,
  schoolId: string,
): void {
  if (!params.circularId || !params.path) {
    throw new ValidationError("Circular ID and storage path are required");
  }

  const expectedPrefix = `${schoolId}/${params.circularId}/`;
  if (!params.path.startsWith(expectedPrefix)) {
    throw new ValidationError("Invalid storage path for this circular");
  }

  if (params.sizeBytes && params.sizeBytes > circularDocumentRules.maxBytes) {
    throw new ValidationError(circularDocumentRules.tooLargeMessage);
  }
}
