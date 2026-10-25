"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { MobileNavDrawerHeader } from "./MobileNavDrawerHeader";
import { MobileNavLinks } from "./MobileNavLinks";
import type { SchoolRow } from "@/lib/school/getCurrentSchool";

export function MobileNavDrawer({
  school,
  schoolName,
  hierarchy,
  primaryName,
  isOwner = false,
  canManageSettings,
  canViewReports,
  onClose,
}: {
  school: SchoolRow | null;
  schoolName: string;
  hierarchy: string | null;
  primaryName: string;
  isOwner?: boolean;
  canManageSettings: boolean;
  canViewReports: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("nav");

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[60] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={t("portal")}
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 start-0 z-[60] flex h-dvh w-72 max-w-[85vw] flex-col border-e border-border bg-card shadow-2xl transition-transform duration-200">
        <MobileNavDrawerHeader
          school={school}
          schoolName={schoolName}
          hierarchy={hierarchy}
          primaryName={primaryName}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto">
          <MobileNavLinks
            isOwner={isOwner}
            canManageSettings={canManageSettings}
            canViewReports={canViewReports}
            onSelect={onClose}
          />
        </div>

        {school?.academic_year ? (
          <div className="flex shrink-0 items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>{t("portal")}</span>
            <span className="rounded-md border border-border px-1.5 py-0.5 font-medium">
              {school.academic_year}
            </span>
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
