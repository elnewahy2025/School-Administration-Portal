"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ShieldCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateRoleAction } from "@/actions/rbac/updateRoleAction";
import type { SchoolRoleRow } from "@/lib/rbac/getSchoolRoles";
import { resolveRoleDisplayName } from "@/lib/rbac/resolveRoleDisplayName";
import { PermissionCategoriesList } from "./PermissionCategoriesList";

export function EditRoleDialog({
  role,
  isOpen,
  onClose,
}: {
  role: SchoolRoleRow;
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("rbac");
  const tCommon = useTranslations("common");
  const initialName = role.is_system ? resolveRoleDisplayName(role.key, t, role.name) : role.name;
  const [name, setName] = useState(initialName);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(role.permissions));
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleToggle = (permKey: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(permKey)) next.delete(permKey);
      else next.add(permKey);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateRoleAction(role.id, name, Array.from(selectedKeys));
      if (res.success) {
        toast.success(tCommon("saved"));
        onClose();
      } else {
        toast.error(res.error ?? tCommon("error"));
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-xl space-y-4 rounded-xl border border-border bg-card p-6 shadow-xl">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <ShieldCheckIcon className="size-5 text-primary" />
          <span>{role.is_system ? t("viewRole") : t("editRole")}</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit_role_name">{t("roleName")}</Label>
            <Input
              id="edit_role_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isPending || role.is_system}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t("permissions")}</Label>
            <PermissionCategoriesList
              selectedKeys={selectedKeys}
              onToggle={handleToggle}
              disabled={isPending || role.is_system}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {role.is_system ? tCommon("close") : tCommon("cancel")}
            </Button>
            {!role.is_system && (
              <Button type="submit" disabled={isPending}>
                {tCommon("save")}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
