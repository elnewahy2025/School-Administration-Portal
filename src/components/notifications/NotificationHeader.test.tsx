import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { NotificationHeader } from "./NotificationHeader";
import { showConfirmBox } from "@/lib/feedback/showConfirmBox";
import { markAllNotificationsReadAction } from "@/actions/notifications/markAllNotificationsReadAction";
import { deleteAllNotificationsAction } from "@/actions/notifications/deleteAllNotificationsAction";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    const translations: Record<string, string> = {
      title: "Notifications",
      subtitle: "Track important alerts",
      unreadCount: `${values?.count} unread`,
      markAllRead: "Mark all as read",
      deleteAll: "Delete All",
      confirmDeleteAll: "Are you sure you want to permanently delete all notifications?",
    };
    return translations[key] ?? key;
  },
}));

vi.mock("@/i18n", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock("@/actions/notifications/markAllNotificationsReadAction", () => ({
  markAllNotificationsReadAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/actions/notifications/deleteAllNotificationsAction", () => ({
  deleteAllNotificationsAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/lib/feedback/showConfirmBox", () => ({
  showConfirmBox: vi.fn(),
}));

describe("NotificationHeader", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders title and unread count badge", () => {
    render(<NotificationHeader unreadCount={3} totalCount={5} />);
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("3 unread")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /mark all as read/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete all/i })).toBeInTheDocument();
  });

  it("hides action buttons when there are zero notifications", () => {
    render(<NotificationHeader unreadCount={0} totalCount={0} />);
    expect(screen.queryByRole("button", { name: /mark all as read/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete all/i })).not.toBeInTheDocument();
  });

  it("calls markAllNotificationsReadAction on mark all click", async () => {
    render(<NotificationHeader unreadCount={2} totalCount={2} />);
    const markAllBtn = screen.getByRole("button", { name: /mark all as read/i });
    fireEvent.click(markAllBtn);

    await waitFor(() => {
      expect(markAllNotificationsReadAction).toHaveBeenCalled();
    });
  });

  it("deletes all notifications when confirmed", async () => {
    vi.mocked(showConfirmBox).mockResolvedValue(true);
    render(<NotificationHeader unreadCount={0} totalCount={4} />);

    const deleteAllBtn = screen.getByRole("button", { name: /delete all/i });
    fireEvent.click(deleteAllBtn);

    expect(showConfirmBox).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Are you sure you want to permanently delete all notifications?",
        type: "warning",
      }),
    );

    await waitFor(() => {
      expect(deleteAllNotificationsAction).toHaveBeenCalled();
    });
  });

  it("does not delete all notifications when confirmation is cancelled", async () => {
    vi.mocked(showConfirmBox).mockResolvedValue(false);
    render(<NotificationHeader unreadCount={0} totalCount={4} />);

    const deleteAllBtn = screen.getByRole("button", { name: /delete all/i });
    fireEvent.click(deleteAllBtn);

    expect(showConfirmBox).toHaveBeenCalled();
    expect(deleteAllNotificationsAction).not.toHaveBeenCalled();
  });
});

