"use client";

import { useTranslations } from "next-intl";
import { UsersIcon, ShieldCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserRolesTabNav({
  activeTab,
  onTabChange,
}: {
  activeTab: "users" | "roles";
  onTabChange: (tab: "users" | "roles") => void;
}) {
  const t = useTranslations("rbac");

  return (
    <div className="flex gap-2 border-b border-border">
      <Button
        variant={activeTab === "users" ? "default" : "ghost"}
        size="sm"
        onClick={() => onTabChange("users")}
        className="gap-2 rounded-b-none"
      >
        <UsersIcon className="size-4" />
        <span>{t("tabUsers")}</span>
      </Button>
      <Button
        variant={activeTab === "roles" ? "default" : "ghost"}
        size="sm"
        onClick={() => onTabChange("roles")}
        className="gap-2 rounded-b-none"
      >
        <ShieldCheckIcon className="size-4" />
        <span>{t("tabRoles")}</span>
      </Button>
    </div>
  );
}
