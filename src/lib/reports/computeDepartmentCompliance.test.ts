import { describe, it, expect } from "vitest";
import { computeDepartmentCompliance } from "./computeDepartmentCompliance";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";

describe("computeDepartmentCompliance", () => {
  const depts: DepartmentRow[] = [
    {
      id: "d1",
      school_id: "s1",
      name_ar: "العلوم",
      name_en: "Science",
      is_active: true,
      created_at: "",
    },
    {
      id: "d2",
      school_id: "s1",
      name_ar: "الرياضيات",
      name_en: "Math",
      is_active: true,
      created_at: "",
    },
  ];

  it("calculates targeted counts when circularIds includes all-department circulars", () => {
    const results = computeDepartmentCompliance({
      departments: depts,
      targets: [],
      responses: [
        {
          circular_id: "c1",
          department_id: "d1",
          status: "acknowledged",
        },
      ],
      circularIds: ["c1"],
    });

    const d1 = results.find((r) => r.departmentId === "d1");
    const d2 = results.find((r) => r.departmentId === "d2");

    expect(d1?.targetedCount).toBe(1);
    expect(d1?.respondedCount).toBe(1);
    expect(d1?.pendingCount).toBe(0);
    expect(d1?.complianceRatePercent).toBe(100);

    expect(d2?.targetedCount).toBe(1);
    expect(d2?.respondedCount).toBe(0);
    expect(d2?.pendingCount).toBe(1);
    expect(d2?.complianceRatePercent).toBe(0);
  });
});
