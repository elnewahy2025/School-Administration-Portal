"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateUserAction } from "@/actions/settings/updateUserAction";
import type { SchoolUserRow } from "@/lib/school/getSchoolUsers";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";
import type { SchoolRoleRow } from "@/lib/rbac/getSchoolRoles";
import { UserFormFields } from "./UserFormFields";

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
  const tCommon = useTranslations("common");
  const [fullName, setFullName] = useState(user.full_name);
  const [jobTitle, setJobTitle] = useState(user.job_title ?? "");
  const [departmentId, setDepartmentId] = useState(user.department_id ?? "");
  const [roleKey, setRoleKey] = useState(user.role_key ?? "staff");
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateUserAction(
        user.id,
        fullName,
        jobTitle || null,
        departmentId || null,
        roleKey || null,
      );
      if (res.success) {
        toast.success(tCommon("saved"));
        onClose();
      } else {
        toast.error(res.error ?? tCommon("error"));
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-foreground">{t("editUser")}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <UserFormFields
            fullName={fullName}
            setFullName={setFullName}
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            departmentId={departmentId}
            setDepartmentId={setDepartmentId}
            roleKey={roleKey}
            setRoleKey={setRoleKey}
            departments={departments}
            roles={roles}
            disabled={isPending}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {tCommon("save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
