"use client";

import { useTranslations } from "next-intl";
import type { SchoolUserRow } from "@/lib/school/getSchoolUsers";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";
import type { SchoolRoleRow } from "@/lib/rbac/getSchoolRoles";
import { EditUserForm } from "./EditUserForm";

export function EditUserDialog({
  user,
  departments,
  roles = [],
  isOpen,
  onClose,
}: {
  user: SchoolUserRow;
  departments: DepartmentRow[];
  roles?: SchoolRoleRow[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("settings");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-foreground">{t("editUser")}</h3>
        <EditUserForm user={user} departments={departments} roles={roles} onClose={onClose} />
      </div>
    </div>
  );
}
