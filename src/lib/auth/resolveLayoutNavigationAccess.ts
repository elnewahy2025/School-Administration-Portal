export function resolveLayoutNavigationAccess(
  isOwner: boolean,
  permissions: string[],
  hasSchoolId: boolean,
): { canViewReports: boolean; canManageSettings: boolean } {
  const canViewReports =
    isOwner ||
    (permissions.includes("reports.view") &&
      (permissions.includes("settings.school.update") ||
        permissions.includes("users.manage") ||
        permissions.includes("audit.view")));

  const canManageSettings =
    isOwner ||
    permissions.some(
      (p) =>
        p.startsWith("settings.") ||
        p === "users.manage" ||
        p === "roles.manage" ||
        p === "audit.view",
    ) ||
    !hasSchoolId;

  return { canViewReports, canManageSettings };
}
