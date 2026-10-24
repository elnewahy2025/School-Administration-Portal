export function prepareUserProfilePayload(
  fullName: string,
  jobTitle: string | null,
  departmentId: string | null,
) {
  const name = fullName.trim();
  const job = jobTitle ? jobTitle.trim() : null;
  const dept = departmentId ? departmentId.trim() : null;

  return {
    full_name: name,
    job_title: job || null,
    department_id: dept || null,
  };
}
