import { describe, it, expect } from "vitest";
import { mapCircularReportRows } from "./mapCircularReportRows";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";

describe("mapCircularReportRows", () => {
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

  it("populates respondedDepartments and pendingDepartments correctly", () => {
    const circulars = [
      {
        id: "c1",
        ref_number: "CIRC-101",
        title: "Staff Meeting",
        category: "Administrative",
        priority: "normal",
        status: "published",
        publish_at: null,
        due_at: null,
      },
    ];

    const responses = [
      {
        circular_id: "c1",
        department_id: "d1",
      },
    ];

    const rows = mapCircularReportRows(circulars, [], responses, depts);
    expect(rows).toHaveLength(1);
    const row = rows[0]!;

    expect(row.totalTargets).toBe(2);
    expect(row.totalResponses).toBe(1);
    expect(row.compliancePercent).toBe(50);
    expect(row.respondedDepartments).toEqual([{ id: "d1", name: "العلوم" }]);
    expect(row.pendingDepartments).toEqual([{ id: "d2", name: "الرياضيات" }]);
  });
});
