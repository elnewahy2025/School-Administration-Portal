"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { SchoolUserRow } from "@/lib/school/getSchoolUsers";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";
import { EditUserDialog } from "./EditUserDialog";
import { UserTableActions } from "./UserTableActions";

export function UserTableRow({
  user,
  isSelf,
  canManage,
  isPending,
  departments = [],
  onToggle,
}: {
  user: SchoolUserRow;
  isSelf: boolean;
  canManage: boolean;
  isPending: boolean;
  departments?: DepartmentRow[];
  onToggle: (id: string, status: boolean) => void;
}) {
  const tCommon = useTranslations("common");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{user.full_name}</span>
            {user.email && <span className="text-xs text-muted-foreground">{user.email}</span>}
          </div>
        </TableCell>
        <TableCell className="text-muted-foreground">{user.job_title ?? "—"}</TableCell>
        <TableCell className="text-muted-foreground">{user.department_name ?? "—"}</TableCell>
        <TableCell>
          <Badge variant="outline">{user.role_key ?? "staff"}</Badge>
        </TableCell>
        <TableCell>
          <Badge variant={user.is_active ? "default" : "secondary"}>
            {user.is_active ? tCommon("active") : tCommon("inactive")}
          </Badge>
        </TableCell>
        {canManage && (
          <TableCell className="text-end">
            <UserTableActions
              userId={user.id}
              isActive={user.is_active}
              isSelf={isSelf}
              isPending={isPending}
              onEdit={() => setIsEditing(true)}
              onToggle={() => onToggle(user.id, user.is_active)}
            />
          </TableCell>
        )}
      </TableRow>
      {isEditing && (
        <EditUserDialog
          user={user}
          departments={departments}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}
