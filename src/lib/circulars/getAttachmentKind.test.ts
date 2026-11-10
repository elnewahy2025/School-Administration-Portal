import { describe, it, expect } from "vitest";
import { getAttachmentKind } from "./getAttachmentKind";

describe("getAttachmentKind", () => {
  it("detects images by mime or extension", () => {
    expect(getAttachmentKind("test.jpg", "image/jpeg")).toBe("image");
    expect(getAttachmentKind("test.png")).toBe("image");
    expect(getAttachmentKind("photo.webp")).toBe("image");
  });

  it("detects pdfs by mime or extension", () => {
    expect(getAttachmentKind("doc.pdf", "application/pdf")).toBe("pdf");
    expect(getAttachmentKind("file.pdf")).toBe("pdf");
  });

  it("detects word documents by mime or extension", () => {
    expect(
      getAttachmentKind(
        "file.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ),
    ).toBe("word");
    expect(getAttachmentKind("notes.docx")).toBe("word");
    expect(getAttachmentKind("letter.doc", "application/msword")).toBe("word");
  });

  it("detects excel spreadsheets by mime or extension", () => {
    expect(
      getAttachmentKind(
        "data.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ),
    ).toBe("excel");
    expect(getAttachmentKind("budget.xlsx")).toBe("excel");
    expect(getAttachmentKind("report.xls")).toBe("excel");
    expect(getAttachmentKind("records.csv")).toBe("excel");
  });

  it("falls back to document for other files", () => {
    expect(getAttachmentKind("archive.zip")).toBe("document");
    expect(getAttachmentKind("script.py")).toBe("document");
  });
});
