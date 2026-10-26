import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DashboardComplianceWidget } from "./DashboardComplianceWidget";
import type { DashboardComplianceData } from "@/lib/dashboard/types";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      circularCompliance: "Department Circular Compliance",
      circularComplianceDesc: "Response rates and pending acknowledgments",
      overallCompliance: "Overall Compliance",
      selectCircular: "Select Circular",
      allCircularsSummary: "All Circulars (Overall)",
      respondedDepartments: "Responded Departments",
      pendingDepartments: "Pending Departments",
      claimed: "All Responded",
    };
    return map[key] ?? key;
  },
  useLocale: () => "en",
}));

vi.mock("@/components/circulars/CircularRemindButton", () => ({
  CircularRemindButton: () => <button data-testid="remind-button">Urge Pending</button>,
}));

describe("DashboardComplianceWidget", () => {
  afterEach(() => {
    cleanup();
  });

  const mockData: DashboardComplianceData = {
    overallCompliancePercent: 75,
    totalTargets: 4,
    totalResponses: 3,
    overallRespondedDepartments: [{ id: "dept-1", name: "Science & Tech" }],
    overallPendingDepartments: [{ id: "dept-2", name: "Sports Dept" }],
    departmentSlices: [
      {
        id: "dept-1",
        name: "Science & Tech",
        targetedCount: 2,
        respondedCount: 2,
        pendingCount: 0,
        complianceRate: 100,
        color: "#059669",
      },
      {
        id: "dept-2",
        name: "Sports Dept",
        targetedCount: 2,
        respondedCount: 1,
        pendingCount: 1,
        complianceRate: 50,
        color: "#E11D48",
      },
    ],
    circulars: [
      {
        id: "c-1",
        refNumber: "CIRC-001",
        title: "Midterm Protocol",
        totalTargets: 2,
        totalResponses: 1,
        compliancePercent: 50,
        respondedDepartments: [{ id: "dept-1", name: "Science & Tech" }],
        pendingDepartments: [{ id: "dept-2", name: "Sports Dept" }],
      },
    ],
  };

  it("renders widget title, compliance rate, and donut chart for default selected circular", () => {
    render(<DashboardComplianceWidget data={mockData} />);

    expect(screen.getByText("Department Circular Compliance")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getAllByText("Science & Tech").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Sports Dept").length).toBeGreaterThanOrEqual(1);
  });
});
