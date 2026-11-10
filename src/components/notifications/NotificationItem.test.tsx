import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { NotificationItem } from "./NotificationItem";
import { showConfirmBox } from "@/lib/feedback/showConfirmBox";
import { deleteNotificationAction } from "@/actions/notifications/deleteNotificationAction";
import type { NotificationRow } from "@/lib/notifications/types";

vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      markRead: "Mark as read",
      viewDetails: "View Details",
      delete: "Delete",
      confirmDelete: "Are you sure you want to permanently delete this notification?",
      "types.circular": "Circular",
      "templates.circular_published.title": "New Administrative Circular",
      "templates.circular_published.body": "A new circular has been published",
      "templates.maintenance_assigned.title": "New Maintenance Request",
      "templates.maintenance_assigned.body": "A maintenance request has been assigned",
    };
    return translations[key] ?? key;
  },
}));

vi.mock("@/i18n", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock("@/actions/notifications/markNotificationReadAction", () => ({
  markNotificationReadAction: vi.fn(),
}));

vi.mock("@/actions/notifications/deleteNotificationAction", () => ({
  deleteNotificationAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/lib/feedback/showConfirmBox", () => ({
  showConfirmBox: vi.fn(),
}));

describe("NotificationItem", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });
  it("renders localized title and body for canonical template key", () => {
    const notification: NotificationRow = {
      id: "notif-1",
      user_id: "user-1",
      school_id: "school-1",
      type: "circular",
      title: "circular_published",
      body: "circular_published",
      entity_type: "circular",
      entity_id: "circ-123",
      read_at: null,
      created_at: new Date().toISOString(),
    };

    render(<NotificationItem notification={notification} />);

    expect(screen.getByText("New Administrative Circular")).toBeInTheDocument();
    expect(screen.getByText("A new circular has been published")).toBeInTheDocument();
  });

  it("renders localized title and body for maintenance template", () => {
    const notification: NotificationRow = {
      id: "notif-2",
      user_id: "user-1",
      school_id: "school-1",
      type: "maintenance",
      title: "maintenance_assigned",
      body: "maintenance_assigned",
      entity_type: "maintenance_request",
      entity_id: "req-123",
      read_at: null,
      created_at: new Date().toISOString(),
    };

    render(<NotificationItem notification={notification} />);

    expect(screen.getByText("New Maintenance Request")).toBeInTheDocument();
    expect(screen.getByText("A maintenance request has been assigned")).toBeInTheDocument();
  });

  it("does not delete notification if user cancels confirmation dialog", async () => {
    vi.mocked(showConfirmBox).mockResolvedValue(false);

    const notification: NotificationRow = {
      id: "notif-delete-1",
      user_id: "user-1",
      school_id: "school-1",
      type: "circular",
      title: "circular_published",
      body: "circular_published",
      entity_type: "circular",
      entity_id: "circ-123",
      read_at: null,
      created_at: new Date().toISOString(),
    };

    render(<NotificationItem notification={notification} />);

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);

    expect(showConfirmBox).toHaveBeenCalled();
    expect(deleteNotificationAction).not.toHaveBeenCalled();
  });

  it("deletes notification when user confirms confirmation dialog", async () => {
    vi.mocked(showConfirmBox).mockResolvedValue(true);

    const notification: NotificationRow = {
      id: "notif-delete-2",
      user_id: "user-1",
      school_id: "school-1",
      type: "circular",
      title: "circular_published",
      body: "circular_published",
      entity_type: "circular",
      entity_id: "circ-123",
      read_at: null,
      created_at: new Date().toISOString(),
    };

    render(<NotificationItem notification={notification} />);

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);

    expect(showConfirmBox).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Are you sure you want to permanently delete this notification?",
        type: "warning",
      }),
    );
    await waitFor(() => {
      expect(deleteNotificationAction).toHaveBeenCalledWith("notif-delete-2");
    });
  });
});
