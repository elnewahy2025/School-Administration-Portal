import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./theme-toggle";

const { setTheme } = vi.hoisted(() => ({ setTheme: vi.fn() }));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "al-nada", setTheme }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("ThemeToggle", () => {
  afterEach(() => {
    cleanup();
    setTheme.mockClear();
  });

  it("renders the theme selector trigger button", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "selectTheme" });
    expect(button).toBeDefined();
  });

  it("opens menu and allows selecting a theme", () => {
    render(<ThemeToggle />);
    const trigger = screen.getByRole("button", { name: "selectTheme" });
    fireEvent.click(trigger);
    const darkOption = screen.getByText("dark");
    fireEvent.click(darkOption);
    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
