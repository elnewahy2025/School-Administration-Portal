import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PublicCircularSearchInput } from "./PublicCircularSearchInput";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("PublicCircularSearchInput", () => {
  it("renders with placeholder and responds to input changes", () => {
    const onChange = vi.fn();
    render(<PublicCircularSearchInput value="" onChange={onChange} />);

    const input = screen.getByRole("searchbox");
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "test query" } });
    expect(onChange).toHaveBeenCalledWith("test query");
  });

  it("shows clear button when value is present and clears on click", () => {
    const onChange = vi.fn();
    render(<PublicCircularSearchInput value="test query" onChange={onChange} />);

    const clearButton = screen.getByRole("button", { name: "Clear search" });
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(onChange).toHaveBeenCalledWith("");
  });
});

