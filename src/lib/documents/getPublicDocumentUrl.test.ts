import { describe, expect, it } from "vitest";
import { getPublicDocumentUrl } from "./getPublicDocumentUrl";

describe("getPublicDocumentUrl", () => {
  it("returns empty string when filePath is null or undefined", () => {
    expect(getPublicDocumentUrl(null)).toBe("");
    expect(getPublicDocumentUrl(undefined)).toBe("");
    expect(getPublicDocumentUrl("")).toBe("");
  });

  it("constructs correct public storage URL", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://school.supabase.co";
    const url = getPublicDocumentUrl("s1/operational-plan/test.pdf");
    expect(url).toBe(
      "https://school.supabase.co/storage/v1/object/public/school-documents/s1/operational-plan/test.pdf",
    );
  });
});
