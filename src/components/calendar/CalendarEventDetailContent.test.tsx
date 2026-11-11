import React from "react";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CalendarEventDetailContent } from "./CalendarEventDetailContent";
import type { CalendarEventRow } from "@/lib/calendar/types";

const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => Object.assign((key: string) => key, { has: () => true }),
  useLocale: () => "ar",
}));

const mockDeleteAction = vi.fn();
vi.mock("@/actions/calendar/deleteCalendarEventAction", () => ({
  deleteCalendarEventAction: (id: string) => mockDeleteAction(id),
}));

const mockShowConfirmBox = vi.fn();
vi.mock("@/lib/feedback/showConfirmBox", () => ({
  showConfirmBox: (options: unknown) => mockShowConfirmBox(options),
}));

describe("CalendarEventDetailContent", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const mockEvent: CalendarEventRow = {
    id: "evt-detail-1",
    school_id: "sch-1",
    title_ar: "حفل التفوق",
    title_en: "Excellence Day",
    description: "Honoring top achievers",
    category: "activity",
    starts_at: "2026-11-20T08:00:00Z",
    ends_at: "2026-11-20T11:00:00Z",
    all_day: false,
    visibility: "public",
    status: "published",
    location: "Auditorium",
    image_path: null,
    created_by: "usr-1",
    published_at: "2026-10-01T08:00:00Z",
    cancelled_at: null,
    created_at: "2026-10-01T08:00:00Z",
    updated_at: "2026-10-01T08:00:00Z",
  };

  it("renders event details and does not display management buttons when canManage is false", () => {
    render(<CalendarEventDetailContent event={mockEvent} canManage={false} onClose={vi.fn()} />);

    expect(screen.getByText("Honoring top achievers")).toBeDefined();
    expect(screen.queryByRole("button", { name: "actions.delete" })).toBeNull();
    expect(screen.queryByRole("button", { name: "actions.edit" })).toBeNull();
  });

  it("displays delete button when canManage is true and triggers deletion on confirm", async () => {
    mockShowConfirmBox.mockResolvedValueOnce(true);
    mockDeleteAction.mockResolvedValueOnce({ success: true });
    const onClose = vi.fn();

    render(<CalendarEventDetailContent event={mockEvent} canManage={true} onClose={onClose} />);

    const deleteBtn = screen.getByRole("button", { name: "actions.delete" });
    expect(deleteBtn).toBeDefined();

    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockShowConfirmBox).toHaveBeenCalled();
      expect(mockDeleteAction).toHaveBeenCalledWith("evt-detail-1");
      expect(onClose).toHaveBeenCalled();
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("aborts deletion when confirmation is rejected", async () => {
    mockShowConfirmBox.mockResolvedValueOnce(false);
    const onClose = vi.fn();

    render(<CalendarEventDetailContent event={mockEvent} canManage={true} onClose={onClose} />);

    const deleteBtn = screen.getByRole("button", { name: "actions.delete" });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockShowConfirmBox).toHaveBeenCalled();
      expect(mockDeleteAction).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
