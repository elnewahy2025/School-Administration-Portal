import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { printAttachment } from "./printAttachment";

vi.mock("@/lib/logger/reportClientError", () => ({
  reportClientError: vi.fn(),
}));

describe("printAttachment", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does nothing when url is not provided", async () => {
    const appendSpy = vi.spyOn(document.body, "appendChild");

    await printAttachment(undefined);

    expect(appendSpy).not.toHaveBeenCalled();
  });

  it("prints the attachment from a hidden frame when it can be fetched", async () => {
    const mockBlob = new Blob(["pdf"], { type: "application/pdf" });
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      blob: () => Promise.resolve(mockBlob),
    }) as unknown as typeof fetch;

    const appendSpy = vi.spyOn(document.body, "appendChild");

    await printAttachment("https://example.com/test.pdf");

    expect(appendSpy).toHaveBeenCalled();
    const frame = appendSpy.mock.calls[0][0] as HTMLIFrameElement;
    expect(frame.src).toContain("blob:mock-url");
  });

  it("opens the document in a tab when the attachment cannot be fetched", async () => {
    globalThis.fetch = vi
      .fn()
      .mockRejectedValue(new Error("network down")) as unknown as typeof fetch;
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    await printAttachment("https://example.com/test.pdf");

    expect(openSpy).toHaveBeenCalledWith(
      "https://example.com/test.pdf",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("opens the document in a tab when the browser refuses to print the frame", async () => {
    const mockBlob = new Blob(["pdf"], { type: "application/pdf" });
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      blob: () => Promise.resolve(mockBlob),
    }) as unknown as typeof fetch;

    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    let frame: HTMLIFrameElement | undefined;
    vi.spyOn(document.body, "appendChild").mockImplementation((node) => {
      frame = node as HTMLIFrameElement;
      return node;
    });

    await printAttachment("https://example.com/test.pdf");

    // Chrome renders a PDF in a viewer on another origin, so the print call is
    // refused by the same-origin policy. The document must then be offered to
    // the user in a tab instead of failing.
    Object.defineProperty(frame!, "contentWindow", {
      configurable: true,
      value: {
        focus: vi.fn(),
        print: () => {
          throw new DOMException("Blocked a frame with origin", "SecurityError");
        },
      },
    });

    frame!.onload?.(new Event("load"));

    expect(openSpy).toHaveBeenCalledWith(
      "https://example.com/test.pdf",
      "_blank",
      "noopener,noreferrer",
    );
  });
});
