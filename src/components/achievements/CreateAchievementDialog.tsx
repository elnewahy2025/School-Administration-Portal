"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateAchievementForm } from "./CreateAchievementForm";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";

export function CreateAchievementDialog({ departments }: { departments: DepartmentRow[] }) {
  const t = useTranslations("achievements");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <PlusIcon className="size-4" />
        <span>{t("register")}</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-scrim/60 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">{t("register")}</h2>
                <p className="text-xs text-muted-foreground">{t("registerDesc")}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <XIcon className="size-5" />
              </Button>
            </div>
            <CreateAchievementForm
              departments={departments}
              onSuccess={() => setIsOpen(false)}
              onCancel={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
