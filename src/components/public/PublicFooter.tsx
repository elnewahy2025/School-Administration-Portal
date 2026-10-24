"use client";

import { useLocale, useTranslations } from "next-intl";
import type { PublicSchoolProfileRow } from "@/lib/school/getPublicSchoolProfile";
import { resolveLocalizedText } from "@/lib/school/resolveLocalizedText";
import { PublicFooterContact } from "./PublicFooterContact";

export function PublicFooter({ school }: { school?: PublicSchoolProfileRow | null }) {
  const t = useTranslations("home");
  const locale = useLocale();

  const schoolName =
    resolveLocalizedText(locale, school?.name_ar, school?.name_en) ?? t("title");
  const address = resolveLocalizedText(locale, school?.address_ar, school?.address_en);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card px-6 py-8 text-center text-xs text-muted-foreground">
      <div className="mx-auto max-w-5xl space-y-3">
        <p className="font-semibold text-foreground whitespace-pre-line text-sm">{schoolName}</p>
        <PublicFooterContact phone={school?.phone} address={address} />
        <p>© {currentYear} {schoolName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
