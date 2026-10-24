"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleUserActiveAction } from "@/actions/settings/toggleUserActiveAction";
import type { SchoolUserRow } from "@/lib/school/getSchoolUsers";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";
import type { SchoolRoleRow } from "@/lib/rbac/getSchoolRoles";
import { UserTable } from "./UserTable";
import { CreateUserDialog } from "./CreateUserDialog";
import { EditUserDialog } from "./EditUserDialog";

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
  const [editingUser, setEditingUser] = useState<SchoolUserRow | null>(null);

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
        <UserTable
          users={users}
          currentUserId={currentUserId}
          canManage={canManage}
          isPending={isPending}
          onEdit={(user) => setEditingUser(user)}
          onToggle={handleToggle}
        />
      )}

      {isCreateOpen && (
        <CreateUserDialog
          isOpen={isCreateOpen}
          departments={departments}
          roles={roles}
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          departments={departments}
          roles={roles}
          isOpen={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
