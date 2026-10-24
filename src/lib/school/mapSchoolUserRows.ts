import { toSchoolUserRow } from "./toSchoolUserRow";

export type RawProfileQueryResult = {
  id: string;
  full_name: string;
  email: string | null;
  job_title: string | null;
  department_id: string | null;
  is_active: boolean;
  departments: { name_ar: string; name_en: string } | null;
  user_role_assignments: Array<{
    roles: { key: string; name: string } | null;
  }> | null;
};

export type MappedSchoolUser = {
  id: string;
  full_name: string;
  email: string | null;
  job_title: string | null;
  department_id: string | null;
  department_name: string | null;
  is_active: boolean;
  role_key: string | null;
  is_owner: boolean;
};

export function mapSchoolUserRows(
  rows: RawProfileQueryResult[],
  viewerIsOwner: boolean,
): MappedSchoolUser[] {
  const result: MappedSchoolUser[] = [];

  for (const row of rows) {
    const user = toSchoolUserRow(row);
    // The owner account cannot be seen by any other user
    if (user.is_owner && !viewerIsOwner) {
      continue;
    }
    result.push(user);
  }

  return result;
}
