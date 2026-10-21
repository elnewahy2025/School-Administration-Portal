import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./theme-toggle";

const { setTheme } = vi.hoisted(() => ({ setTheme: vi.fn() }));

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("ThemeToggle", () => {
  afterEach(() => {
    cleanup();
    setTheme.mockClear();
  });

  it("switches to dark on click when the current theme is light", () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "toDark" }));
    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
