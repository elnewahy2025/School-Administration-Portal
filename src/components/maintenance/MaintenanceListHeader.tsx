"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MaintenanceListHeader({ canCreate }: { canCreate: boolean }) {
  const t = useTranslations("maintenance");
  const locale = useLocale();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      {canCreate && (
        <Link href={`/${locale}/maintenance/new`}>
          <Button className="gap-2">
            <PlusIcon className="size-4" />
            <span>{t("submitTicket")}</span>
          </Button>
        </Link>
      )}
    </div>
  );
}
