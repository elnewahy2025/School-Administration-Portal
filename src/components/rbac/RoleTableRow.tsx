"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { SchoolRoleRow } from "@/lib/rbac/getSchoolRoles";
import { RoleBadge } from "./RoleBadge";
import { RoleTableActions } from "./RoleTableActions";

export function RoleTableRow({
  role,
  canManage,
  onEdit,
}: {
  role: SchoolRoleRow;
  canManage: boolean;
  onEdit: () => void;
}) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{role.name}</span>
          <span className="font-mono text-xs text-muted-foreground">{role.key}</span>
        </div>
      </TableCell>
      <TableCell>
        <RoleBadge isSystem={role.is_system} />
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {role.permissions.length} perms
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-xs text-muted-foreground">{role.user_count} users</span>
      </TableCell>
      <TableCell className="text-end">
        <RoleTableActions role={role} canManage={canManage} onEdit={onEdit} />
      </TableCell>
    </TableRow>
  );
}
