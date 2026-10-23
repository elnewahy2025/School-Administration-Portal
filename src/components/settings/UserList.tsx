"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toggleUserActiveAction } from "@/actions/settings/toggleUserActiveAction";
import type { SchoolUserRow } from "@/lib/school/getSchoolUsers";
import { UserTableRow } from "./UserTableRow";

export function UserList({
  users,
  currentUserId,
  canManage,
}: {
  users: SchoolUserRow[];
  currentUserId?: string | null;
  canManage: boolean;
}) {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();

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

  if (users.length === 0) {
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
            <TableHead>{t("fullName")}</TableHead>
            <TableHead>{t("jobTitle")}</TableHead>
            <TableHead>{t("departments")}</TableHead>
            <TableHead>{t("role")}</TableHead>
            <TableHead className="w-28">{tCommon("status")}</TableHead>
            {canManage && <TableHead className="w-32 text-end">{tCommon("actions")}</TableHead>}
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
              onToggle={handleToggle}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
