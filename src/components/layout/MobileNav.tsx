"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNavLinks } from "./MobileNavLinks";
import { SchoolLogoAvatar } from "./SchoolLogoAvatar";
import { resolveSchoolName } from "@/lib/school/resolveSchoolName";
import type { SchoolRow } from "@/lib/school/getCurrentSchool";

export function MobileNav({
  school,
  isOwner = false,
  canManageSettings,
  canViewReports,
}: {
  school: SchoolRow | null;
  isOwner?: boolean;
  canManageSettings: boolean;
  canViewReports: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const schoolName = resolveSchoolName(school, locale, t("portal"));

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label={t("openMenu")}
      >
        <MenuIcon className="size-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex w-72 max-w-[80vw] flex-col bg-card shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2 overflow-hidden">
                <SchoolLogoAvatar school={school} className="size-8" iconClassName="size-4" />
                <span className="truncate text-sm font-semibold whitespace-pre-line">
                  {schoolName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label={t("closeMenu")}
              >
                <XIcon className="size-5" />
              </Button>
            </div>
            <MobileNavLinks
              isOwner={isOwner}
              canManageSettings={canManageSettings}
              canViewReports={canViewReports}
              onSelect={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
