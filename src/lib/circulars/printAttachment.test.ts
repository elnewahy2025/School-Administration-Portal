import { describe, it, expect, vi } from "vitest";
import { printAttachment } from "./printAttachment";

describe("printAttachment", () => {
  it("does nothing when url is not provided", () => {
    const openSpy = vi.spyOn(window, "open");
    printAttachment(undefined);
    expect(openSpy).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it("opens window with url in _blank target when provided", () => {
    const focusMock = vi.fn();
    const openSpy = vi.spyOn(window, "open").mockReturnValue({
      focus: focusMock,
      onload: null,
      print: vi.fn(),
    } as unknown as Window);

    printAttachment("https://example.com/test.pdf");

    expect(openSpy).toHaveBeenCalledWith("https://example.com/test.pdf", "_blank");
    expect(focusMock).toHaveBeenCalled();
    openSpy.mockRestore();
  });
});
