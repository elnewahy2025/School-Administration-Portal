import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MaintenanceDetailActions } from "./MaintenanceDetailActions";
import type { MaintenanceRequestRow } from "@/lib/maintenance/types";

const mockDeleteMaintenanceRequestAction = vi.fn();
const mockShowConfirmBox = vi.fn();

vi.mock("@/actions/maintenance/deleteMaintenanceRequestAction", () => ({
  deleteMaintenanceRequestAction: (...args: unknown[]) =>
    mockDeleteMaintenanceRequestAction(...args),
}));

vi.mock("@/actions/maintenance/updateMaintenanceRequestAction", () => ({
  updateMaintenanceRequestAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/lib/feedback/showConfirmBox", () => ({
  showConfirmBox: (...args: unknown[]) => mockShowConfirmBox(...args),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "ar",
}));

vi.mock("@/i18n", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

const mockTicket: MaintenanceRequestRow = {
  id: "ticket-1",
  school_id: "school-1",
  ticket_number: "MNT-2026-001",
  title: "Broken Door",
  description: "Room 101 door handle broken",
  category: "carpentry",
  location_id: null,
  area: null,
  asset_ref: null,
  reporter_id: "user-1",
  reporter_department_id: null,
  priority: "medium",
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

describe("MaintenanceDetailActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders nothing when canManage is false", () => {
    const { container } = render(
      <MaintenanceDetailActions ticket={mockTicket} locations={[]} canManage={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders Edit and Delete buttons when canManage is true", () => {
    render(<MaintenanceDetailActions ticket={mockTicket} locations={[]} canManage={true} />);

    expect(screen.getByText("editTicket")).toBeDefined();
    expect(screen.getByText("deleteTicket")).toBeDefined();
  });

  it("triggers confirmation box when Delete is clicked", async () => {
    mockShowConfirmBox.mockResolvedValue(false);
    render(<MaintenanceDetailActions ticket={mockTicket} locations={[]} canManage={true} />);

    const deleteBtn = screen.getByText("deleteTicket");
    fireEvent.click(deleteBtn);

    expect(mockShowConfirmBox).toHaveBeenCalledWith({
      message: "confirmDeleteTicket",
      type: "warning",
    });
    expect(mockDeleteMaintenanceRequestAction).not.toHaveBeenCalled();
  });
});
