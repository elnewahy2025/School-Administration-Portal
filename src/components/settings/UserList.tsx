"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toggleUserActiveAction } from "@/actions/settings/toggleUserActiveAction";
import type { SchoolUserRow } from "@/lib/school/getSchoolUsers";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";
import type { SchoolRoleRow } from "@/lib/rbac/getSchoolRoles";
import { UserTableRow } from "./UserTableRow";
import { CreateUserDialog } from "./CreateUserDialog";

type UserListProps = {
  users: SchoolUserRow[];
  currentUserId?: string | null;
  canManage: boolean;
  departments?: DepartmentRow[];
  roles?: SchoolRoleRow[];
};

export function UserList({
  users,
  currentUserId,
  canManage,
  departments = [],
  roles = [],
}: UserListProps) {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const res = await toggleUserActiveAction(id, currentStatus);
      if (res.success) {
        toast.success(tCommon("saved"));
      } else {
        toast.error(res.error ?? tCommon("error"));
      }
    });
  };

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end">
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <UserPlusIcon className="size-4" />
            <span>{t("createUser")}</span>
          </Button>
        </div>
      )}

      {users.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          {tCommon("noData")}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("fullName")}</TableHead>
                <TableHead>{t("jobTitle")}</TableHead>
                <TableHead>{t("departments")}</TableHead>
                <TableHead>{t("role")}</TableHead>
                <TableHead className="w-28">{tCommon("status")}</TableHead>
                {canManage && <TableHead className="w-44 text-end">{tCommon("actions")}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isSelf={user.id === currentUserId}
                  canManage={canManage}
                  isPending={isPending}
                  departments={departments}
                  roles={roles}
                  onToggle={handleToggle}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {isCreateOpen && (
        <CreateUserDialog
          isOpen={isCreateOpen}
          departments={departments}
          roles={roles}
          onClose={() => setIsCreateOpen(false)}
        />
      )}
    </div>
  );
}
