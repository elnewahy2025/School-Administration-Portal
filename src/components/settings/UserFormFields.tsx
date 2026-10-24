"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";
import type { SchoolRoleRow } from "@/lib/rbac/getSchoolRoles";
import { UserRoleSelect } from "./UserRoleSelect";

type UserFormFieldsProps = {
  fullName: string;
  setFullName: (v: string) => void;
  jobTitle: string;
  setJobTitle: (v: string) => void;
  departmentId: string;
  setDepartmentId: (v: string) => void;
  roleKey: string;
  setRoleKey: (v: string) => void;
  departments: DepartmentRow[];
  roles?: SchoolRoleRow[];
  disabled: boolean;
};

export function UserFormFields(props: UserFormFieldsProps) {
  const {
    fullName,
    setFullName,
    jobTitle,
    setJobTitle,
    departmentId,
    setDepartmentId,
    roleKey,
    setRoleKey,
    departments,
    roles = [],
    disabled,
  } = props;
  const t = useTranslations("settings");

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="edit_user_name">{t("fullName")}</Label>
        <Input
          id="edit_user_name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit_user_job">{t("jobTitle")}</Label>
        <Input
          id="edit_user_job"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit_user_dept">{t("departments")}</Label>
        <select
          id="edit_user_dept"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          disabled={disabled}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">—</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name_ar} ({d.name_en})
            </option>
          ))}
        </select>
      </div>
      <UserRoleSelect roleKey={roleKey} setRoleKey={setRoleKey} roles={roles} disabled={disabled} />
    </>
  );
}
