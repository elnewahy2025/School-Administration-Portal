import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PublicCircularsSectionHeader } from "./PublicCircularsSectionHeader";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("PublicCircularsSectionHeader", () => {
  it("renders eyebrow, title, and subtitle", () => {
    render(<PublicCircularsSectionHeader />);
    expect(screen.getByText("circularsEyebrow")).toBeInTheDocument();
    expect(screen.getByText("circularsTitle")).toBeInTheDocument();
    expect(screen.getByText("circularsSubtitle")).toBeInTheDocument();
  });
});

