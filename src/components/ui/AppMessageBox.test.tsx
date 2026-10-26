import React from "react";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppMessageBox } from "./AppMessageBox";
import { showMessageBox } from "@/lib/feedback/showMessageBox";
import { closeMessageBox } from "@/lib/feedback/closeMessageBox";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      confirm: "OK",
      notice: "Notice",
      success: "Success",
      error: "Error",
      warning: "Warning",
    };
    return map[key] ?? key;
  },
  useLocale: () => "en",
}));

describe("AppMessageBox", () => {
  afterEach(() => {
    act(() => {
      closeMessageBox();
    });
    cleanup();
  });

  it("renders nothing when closed", () => {
    render(<AppMessageBox />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders modal with message and dismisses on click", () => {
    render(<AppMessageBox />);

    act(() => {
      showMessageBox({
        title: "Test Alert",
        message: "This is a centered message box",
        type: "info",
      });
    });

    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText("Test Alert")).toBeDefined();
    expect(screen.getByText("This is a centered message box")).toBeDefined();

    const okBtn = screen.getByRole("button", { name: "OK" });
    fireEvent.click(okBtn);

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
