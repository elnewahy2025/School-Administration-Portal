import type { RawProfileQueryResult, MappedSchoolUser } from "./mapSchoolUserRows";

export function toSchoolUserRow(row: RawProfileQueryResult): MappedSchoolUser {
  const isOwner = row.user_role_assignments?.some((a) => a.roles?.key === "owner") ?? false;
  const deptName = row.departments ? row.departments.name_ar || row.departments.name_en : null;
  const roleKey = row.user_role_assignments?.[0]?.roles?.key ?? null;

  return {
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    job_title: row.job_title,
    department_id: row.department_id,
    department_name: deptName,
    is_active: row.is_active,
    role_key: roleKey,
    is_owner: isOwner,
  };
}
