"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { SchoolRoleRow } from "@/lib/rbac/getSchoolRoles";
import { RoleBadge } from "./RoleBadge";
import { RoleTableActions } from "./RoleTableActions";
import { EditRoleDialog } from "./EditRoleDialog";

export function RoleTableRow({ role, canManage }: { role: SchoolRoleRow; canManage: boolean }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
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
          <RoleTableActions role={role} canManage={canManage} onEdit={() => setIsEditing(true)} />
        </TableCell>
      </TableRow>
      {isEditing && (
        <EditRoleDialog role={role} isOpen={isEditing} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}
