import React from "react";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CalendarActionButtons } from "./CalendarActionButtons";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "ar",
}));

const mockDeleteAction = vi.fn();
vi.mock("@/actions/calendar/deleteCalendarEventAction", () => ({
  deleteCalendarEventAction: (id: string) => mockDeleteAction(id),
}));

vi.mock("@/actions/calendar/publishCalendarEventAction", () => ({
  publishCalendarEventAction: vi.fn(),
}));

vi.mock("@/actions/calendar/cancelCalendarEventAction", () => ({
  cancelCalendarEventAction: vi.fn(),
}));

vi.mock("@/actions/calendar/archiveCalendarEventAction", () => ({
  archiveCalendarEventAction: vi.fn(),
}));

const mockShowConfirmBox = vi.fn();
vi.mock("@/lib/feedback/showConfirmBox", () => ({
  showConfirmBox: (options: unknown) => mockShowConfirmBox(options),
}));

describe("CalendarActionButtons", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("returns null when canManage is false", () => {
    const { container } = render(
      <CalendarActionButtons eventId="evt-1" status="published" canManage={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders delete button and executes deletion with refresh when no redirect provided", async () => {
    mockShowConfirmBox.mockResolvedValueOnce(true);
    mockDeleteAction.mockResolvedValueOnce({ success: true });

    render(<CalendarActionButtons eventId="evt-1" status="published" canManage={true} />);

    const deleteBtn = screen.getByRole("button", { name: "delete" });
    expect(deleteBtn).toBeDefined();

    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockShowConfirmBox).toHaveBeenCalled();
      expect(mockDeleteAction).toHaveBeenCalledWith("evt-1");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("redirects to target path when redirectToOnDelete is provided", async () => {
    mockShowConfirmBox.mockResolvedValueOnce(true);
    mockDeleteAction.mockResolvedValueOnce({ success: true });

    render(
      <CalendarActionButtons
        eventId="evt-1"
        status="published"
        canManage={true}
        redirectToOnDelete="/ar/calendar"
      />,
    );

    const deleteBtn = screen.getByRole("button", { name: "delete" });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockDeleteAction).toHaveBeenCalledWith("evt-1");
      expect(mockPush).toHaveBeenCalledWith("/ar/calendar");
    });
  });
});
