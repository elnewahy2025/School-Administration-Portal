import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { EditMaintenanceDialog } from "./EditMaintenanceDialog";
import type { MaintenanceRequestRow } from "@/lib/maintenance/types";

const mockHandleSubmit = vi.fn();

vi.mock("@/actions/maintenance/updateMaintenanceRequestAction", () => ({
  updateMaintenanceRequestAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("./useEditMaintenanceForm", () => ({
  useEditMaintenanceForm: (ticket: MaintenanceRequestRow) => ({
    isPending: false,
    title: ticket.title,
    setTitle: vi.fn(),
    description: ticket.description,
    setDescription: vi.fn(),
    category: ticket.category,
    setCategory: vi.fn(),
    priority: ticket.priority,
    setPriority: vi.fn(),
    locationId: ticket.location_id ?? "",
    setLocationId: vi.fn(),
    area: ticket.area ?? "",
    setArea: vi.fn(),
    assetRef: ticket.asset_ref ?? "",
    setAssetRef: vi.fn(),
    handleSubmit: mockHandleSubmit,
  }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "ar",
}));

const mockTicket: MaintenanceRequestRow = {
  id: "ticket-1",
  school_id: "school-1",
  ticket_number: "MNT-2026-001",
  title: "Broken AC",
  description: "Room 101 AC not cooling",
  category: "hvac",
  location_id: null,
  area: null,
  asset_ref: null,
  reporter_id: "user-1",
  reporter_department_id: null,
  priority: "urgent",
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

describe("EditMaintenanceDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders edit form fields when open is true", () => {
    render(
      <EditMaintenanceDialog
        ticket={mockTicket}
        locations={[]}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText("editTicket")).toBeDefined();
    expect(screen.getByLabelText("ticketTitle *")).toBeDefined();
    expect(screen.getByLabelText("ticketDescription *")).toBeDefined();
  });

  it("calls handleSubmit on submit", () => {
    render(
      <EditMaintenanceDialog
        ticket={mockTicket}
        locations={[]}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    const submitBtn = screen.getByText("save");
    fireEvent.click(submitBtn);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
