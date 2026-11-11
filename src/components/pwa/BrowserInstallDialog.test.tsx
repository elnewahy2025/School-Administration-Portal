import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserInstallDialog } from "./BrowserInstallDialog";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("BrowserInstallDialog", () => {
  it("renders nothing when closed", () => {
    const { container } = render(<BrowserInstallDialog isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders dialog and calls onClose when close buttons are clicked", () => {
    const onClose = vi.fn();
    render(<BrowserInstallDialog isOpen={true} onClose={onClose} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("browserGuideTitle")).toBeInTheDocument();

    const gotItBtn = screen.getByText("gotIt");
    fireEvent.click(gotItBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
