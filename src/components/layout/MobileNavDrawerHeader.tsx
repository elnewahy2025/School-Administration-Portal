"use client";

import { useTranslations } from "next-intl";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SchoolLogoAvatar } from "./SchoolLogoAvatar";
import type { SchoolRow } from "@/lib/school/getCurrentSchool";

export function MobileNavDrawerHeader({
  school,
  schoolName,
  hierarchy,
  primaryName,
  onClose,
}: {
  school: SchoolRow | null;
  schoolName: string;
  hierarchy: string | null;
  primaryName: string;
  onClose: () => void;
}) {
  const t = useTranslations("nav");

  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
      <div className="flex min-w-0 items-center gap-2.5 overflow-hidden">
        <SchoolLogoAvatar school={school} className="size-8" iconClassName="size-4" />
        <div className="flex min-w-0 flex-col overflow-hidden">
          {hierarchy ? (
            <span className="truncate text-[10px] leading-tight text-muted-foreground">
              {hierarchy}
            </span>
          ) : null}
          <span className="truncate text-sm leading-snug font-semibold text-foreground">
            {primaryName || schoolName}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        aria-label={t("closeMenu")}
        className="ms-2 shrink-0"
      >
        <XIcon className="size-5" />
      </Button>
    </div>
  );
}
