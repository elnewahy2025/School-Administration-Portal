import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EditDepartmentDialog } from "./EditDepartmentDialog";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";

let mockLocale = "ar";

vi.mock("next-intl", () => ({
  useLocale: () => mockLocale,
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/actions/settings/updateDepartmentAction", () => ({
  updateDepartmentAction: vi.fn().mockResolvedValue({ success: true }),
}));

describe("EditDepartmentDialog", () => {
  afterEach(() => {
    cleanup();
  });

  const mockDept: DepartmentRow = {
    id: "d1",
    school_id: "s1",
    name_ar: "قسم العلوم",
    name_en: "Science Dept",
    is_active: true,
    created_at: "2026-11-01T00:00:00Z",
  };

  it("hides English name input in Arabic locale", () => {
    mockLocale = "ar";
    render(<EditDepartmentDialog department={mockDept} isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByLabelText("deptNameAr")).toBeInTheDocument();
    expect(screen.queryByLabelText("deptNameEn")).toBeNull();
  });

  it("shows English name input in English locale", () => {
    mockLocale = "en";
    render(<EditDepartmentDialog department={mockDept} isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByLabelText("deptNameAr")).toBeInTheDocument();
    expect(screen.getByLabelText("deptNameEn")).toBeInTheDocument();
  });
});
