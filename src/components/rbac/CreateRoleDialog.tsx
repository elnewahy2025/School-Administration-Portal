"use client";

import { useTranslations } from "next-intl";
import { PlusIcon } from "lucide-react";
import { CreateRoleForm } from "./CreateRoleForm";

export function CreateRoleDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useTranslations("rbac");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-xl space-y-4 rounded-xl border border-border bg-card p-6 shadow-xl">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <PlusIcon className="size-5 text-primary" />
          <span>{t("createRole")}</span>
        </h3>
        <CreateRoleForm onClose={onClose} />
      </div>
    </div>
  );
}
