import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PublicCircularsEmptyFilter } from "./PublicCircularsEmptyFilter";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("PublicCircularsEmptyFilter", () => {
  it("renders empty filter message and calls onReset when clicked", () => {
    const onReset = vi.fn();
    render(<PublicCircularsEmptyFilter onReset={onReset} />);

    expect(screen.getByText("noFilteredCirculars")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "clearFilters" }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
