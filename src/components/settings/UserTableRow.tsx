"use client";

import { useTranslations } from "next-intl";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SchoolUserRow } from "@/lib/school/getSchoolUsers";

export function UserTableRow({
  user,
  isSelf,
  canManage,
  isPending,
  onToggle,
}: {
  user: SchoolUserRow;
  isSelf: boolean;
  canManage: boolean;
  isPending: boolean;
  onToggle: (id: string, status: boolean) => void;
}) {
  const tCommon = useTranslations("common");

  return (
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
          <Button
            variant="outline"
            size="sm"
            disabled={isPending || isSelf}
            onClick={() => onToggle(user.id, user.is_active)}
          >
            {user.is_active ? tCommon("inactive") : tCommon("active")}
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
}
