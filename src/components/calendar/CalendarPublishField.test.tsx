import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { CalendarPublishField } from "./CalendarPublishField";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      publishImmediately: "Publish immediately",
      publishImmediatelyHelp: "Make this event active and visible immediately.",
    };
    return translations[key] ?? key;
  },
}));

describe("CalendarPublishField", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders with defaultChecked true", () => {
    render(<CalendarPublishField />);
    const checkbox = screen.getByRole("checkbox", { name: /Publish immediately/i });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it("respects defaultChecked prop when false", () => {
    render(<CalendarPublishField defaultChecked={false} />);
    const checkbox = screen.getByRole("checkbox", { name: /Publish immediately/i });
    expect(checkbox).not.toBeChecked();
  });
});
