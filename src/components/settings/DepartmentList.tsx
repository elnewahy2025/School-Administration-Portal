"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleDepartmentStatusAction } from "@/actions/settings/toggleDepartmentStatusAction";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";

export function DepartmentList({
  departments,
  canManage,
}: {
  departments: DepartmentRow[];
  canManage: boolean;
}) {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const res = await toggleDepartmentStatusAction(id, currentStatus);
      if (res.success) {
        toast.success(tCommon("saved"));
      } else {
        toast.error(res.error ?? tCommon("error"));
      }
    });
  };

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
            {canManage && <TableHead className="w-32 text-end">{tCommon("actions")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell className="font-medium text-foreground">{dept.name_ar}</TableCell>
              <TableCell className="text-muted-foreground">{dept.name_en}</TableCell>
              <TableCell>
                <Badge variant={dept.is_active ? "default" : "secondary"}>
                  {dept.is_active ? tCommon("active") : tCommon("inactive")}
                </Badge>
              </TableCell>
              {canManage && (
                <TableCell className="text-end">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleToggle(dept.id, dept.is_active)}
                  >
                    {dept.is_active ? tCommon("inactive") : tCommon("active")}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
