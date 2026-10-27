import { describe, it, expect } from "vitest";
import { filterRowsForManager } from "./filterRowsForManager";

describe("filterRowsForManager", () => {
  const managerSchoolId = "school-100";
  const ownerUserIds = new Set(["owner-id-1"]);

  it("filters schools to only match manager school id", () => {
    const schools = [
      { id: "school-100", name_ar: "مدرستنا" },
      { id: "school-200", name_ar: "مدرسة أخرى" },
    ];
    const filtered = filterRowsForManager("schools", schools, managerSchoolId);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("school-100");
  });

  it("filters roles to only custom school roles and excludes system/owner roles", () => {
    const roles = [
      { id: "r1", school_id: "school-100", is_system: false, key: "custom_role", name: "Custom" },
      { id: "r2", school_id: "school-100", is_system: true, key: "school_admin", name: "System" },
      { id: "r3", school_id: "school-100", is_system: false, key: "owner", name: "Owner" },
      { id: "r4", school_id: "school-999", is_system: false, key: "other", name: "Other" },
    ];
    const filtered = filterRowsForManager("roles", roles, managerSchoolId);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("r1");
  });

  it("filters out owner profiles during restore", () => {
    const profiles = [
      { id: "owner-id-1", school_id: "school-100", full_name: "Owner" },
      { id: "teacher-id-1", school_id: "school-100", full_name: "Teacher" },
    ];
    const filtered = filterRowsForManager("profiles", profiles, managerSchoolId, ownerUserIds);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("teacher-id-1");
  });

  it("filters out owner role assignments during restore", () => {
    const assignments = [
      { id: "a1", user_id: "owner-id-1", school_id: "school-100" },
      { id: "a2", user_id: "teacher-id-1", school_id: "school-100" },
    ];
    const filtered = filterRowsForManager(
      "user_role_assignments",
      assignments,
      managerSchoolId,
      ownerUserIds,
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("a2");
  });

  it("ensures school_id is bound to manager school id on general tables", () => {
    const departments = [
      { id: "d1", school_id: "school-100", name_ar: "الرياضيات" },
      { id: "d2", school_id: "school-999", name_ar: "قسم غير مصرح" },
    ];
    const filtered = filterRowsForManager("departments", departments, managerSchoolId);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("d1");
    expect(filtered[0].school_id).toBe("school-100");
  });
});
