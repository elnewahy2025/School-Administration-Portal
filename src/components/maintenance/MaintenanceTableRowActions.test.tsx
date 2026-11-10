import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MaintenanceTableRowActions } from "./MaintenanceTableRowActions";
import type { MaintenanceRequestRow } from "@/lib/maintenance/types";

const mockHandleDelete = vi.fn();
const mockSetIsEditDialogOpen = vi.fn();

vi.mock("@/actions/maintenance/deleteMaintenanceRequestAction", () => ({
  deleteMaintenanceRequestAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/actions/maintenance/updateMaintenanceRequestAction", () => ({
  updateMaintenanceRequestAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("./useMaintenanceRowActions", () => ({
  useMaintenanceRowActions: () => ({
    isPending: false,
    isEditDialogOpen: false,
    setIsEditDialogOpen: mockSetIsEditDialogOpen,
    handleDelete: mockHandleDelete,
  }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "ar",
}));

vi.mock("@/i18n", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockTicket: MaintenanceRequestRow = {
  id: "ticket-1",
  school_id: "school-1",
  ticket_number: "MNT-2026-001",
  title: "AC Leak",
  description: "Water dripping",
  category: "hvac",
  location_id: null,
  area: null,
  asset_ref: null,
  reporter_id: "user-1",
  reporter_department_id: null,
  priority: "high" as never,
  status: "submitted",
  assigned_operator_id: null,
  target_response_at: null,
  target_resolution_at: null,
  first_response_at: null,
  resolved_at: null,
  closed_at: null,
  closed_by: null,
  reopen_reason: null,
  rejection_reason: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe("MaintenanceTableRowActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders only view button when canManage is false", () => {
    render(<MaintenanceTableRowActions ticket={mockTicket} locations={[]} canManage={false} />);

    const link = screen.getByRole("link");
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/maintenance/ticket-1");
    expect(screen.queryByLabelText("editTicket")).toBeNull();
    expect(screen.queryByLabelText("deleteTicket")).toBeNull();
  });

  it("renders view, edit, and delete buttons when canManage is true", () => {
    render(<MaintenanceTableRowActions ticket={mockTicket} locations={[]} canManage={true} />);

    expect(screen.getByRole("link")).toBeDefined();
    const editBtn = screen.getByLabelText("editTicket");
    const deleteBtn = screen.getByLabelText("deleteTicket");

    expect(editBtn).toBeDefined();
    expect(deleteBtn).toBeDefined();

    fireEvent.click(editBtn);
    expect(mockSetIsEditDialogOpen).toHaveBeenCalledWith(true);

    fireEvent.click(deleteBtn);
    expect(mockHandleDelete).toHaveBeenCalled();
  });
});
