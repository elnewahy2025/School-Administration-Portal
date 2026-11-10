import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PublicCircularsEmptyState } from "./PublicCircularsEmptyState";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("PublicCircularsEmptyState", () => {
  it("renders empty state message", () => {
    render(<PublicCircularsEmptyState />);
    expect(screen.getByText("noPublicCirculars")).toBeInTheDocument();
  });
});
