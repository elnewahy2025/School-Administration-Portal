import { describe, it, expect } from "vitest";
import { assertValidAttachmentRecord } from "./assertValidAttachmentRecord";
import { ValidationError } from "@/lib/errors/ValidationError";

describe("assertValidAttachmentRecord", () => {
  it("passes when valid", () => {
    expect(() =>
      assertValidAttachmentRecord(
        { circularId: "circ-1", path: "school-1/circ-1/file.pdf", sizeBytes: 1024 },
        "school-1",
      ),
    ).not.toThrow();
  });

  it("throws when circularId is missing", () => {
    expect(() =>
      assertValidAttachmentRecord(
        { circularId: "", path: "school-1/circ-1/file.pdf", sizeBytes: 1024 },
        "school-1",
      ),
    ).toThrow(ValidationError);
  });

  it("throws when path does not match school or circular prefix", () => {
    expect(() =>
      assertValidAttachmentRecord(
        { circularId: "circ-1", path: "other-school/circ-1/file.pdf", sizeBytes: 1024 },
        "school-1",
      ),
    ).toThrow(ValidationError);
  });
});
