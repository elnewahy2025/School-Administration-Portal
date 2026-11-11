import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CalendarImageField } from "./CalendarImageField";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("CalendarImageField", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders file input without initial preview when none provided", () => {
    render(<CalendarImageField />);
    expect(screen.getByLabelText(/bannerImage/i)).toBeInTheDocument();
    expect(screen.queryByAltText("Banner preview")).toBeNull();
  });

  it("renders initial image preview when initialImageUrl is given", () => {
    render(<CalendarImageField initialImageUrl="https://example.com/banner.jpg" />);
    const preview = screen.getByAltText("Banner preview");
    expect(preview).toBeInTheDocument();
    expect(preview.getAttribute("src")).toBe("https://example.com/banner.jpg");
  });

  it("updates preview when a new file is chosen", () => {
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = () => "blob:mock-url";

    render(<CalendarImageField />);
    const input = screen.getByLabelText(/bannerImage/i);
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });

    const preview = screen.getByAltText("Banner preview");
    expect(preview).toBeInTheDocument();
    expect(preview.getAttribute("src")).toBe("blob:mock-url");

    URL.createObjectURL = originalCreateObjectURL;
  });
});
