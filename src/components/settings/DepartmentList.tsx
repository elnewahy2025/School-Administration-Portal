"use client";

import { useTranslations } from "next-intl";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";
import { DepartmentTableRow } from "./DepartmentTableRow";

export function DepartmentList({
  departments,
  canManage,
}: {
  departments: DepartmentRow[];
  canManage: boolean;
}) {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");

  if (departments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
        {tCommon("noData")}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("deptNameAr")}</TableHead>
            <TableHead>{t("deptNameEn")}</TableHead>
            <TableHead className="w-28">{tCommon("status")}</TableHead>
            {canManage && <TableHead className="w-44 text-end">{tCommon("actions")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept) => (
            <DepartmentTableRow key={dept.id} dept={dept} canManage={canManage} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
