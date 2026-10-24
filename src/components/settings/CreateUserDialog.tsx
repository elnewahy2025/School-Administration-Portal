"use client";

import { useTranslations } from "next-intl";
import { UserPlusIcon } from "lucide-react";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";
import type { SchoolRoleRow } from "@/lib/rbac/getSchoolRoles";
import { CreateUserForm } from "./CreateUserForm";

export function CreateUserDialog({
  isOpen,
  departments,
  roles,
  onClose,
}: {
  isOpen: boolean;
  departments: DepartmentRow[];
  roles: SchoolRoleRow[];
  onClose: () => void;
}) {
  const t = useTranslations("settings");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <UserPlusIcon className="size-5 text-primary" />
          <span>{t("createUser")}</span>
        </h3>
        <CreateUserForm departments={departments} roles={roles} onClose={onClose} />
      </div>
    </div>
  );
}
