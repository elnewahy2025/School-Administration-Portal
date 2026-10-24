"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { GraduationCapIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { PublicSchoolProfileRow } from "@/lib/school/getPublicSchoolProfile";
import { resolveLocalizedText } from "@/lib/school/resolveLocalizedText";
import { getSchoolLogoUrl } from "@/lib/school/getSchoolLogoUrl";

export function PublicHero({ school }: { school: PublicSchoolProfileRow | null }) {
  const locale = useLocale();
  const t = useTranslations("home");
  const schoolName =
    resolveLocalizedText(locale, school?.name_ar, school?.name_en) ?? t("title");
  const logoUrl = getSchoolLogoUrl(school?.logo_path);

  return (
    <header className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/10 via-background to-background px-6 py-16 md:py-24">
      <div className="absolute top-4 end-6 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-4xl text-center space-y-6">
        {logoUrl && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={schoolName}
              className="size-20 md:size-24 object-contain rounded-2xl border border-border/80 bg-background/80 p-2 shadow-md backdrop-blur-xs"
            />
          </div>
        )}

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground whitespace-pre-line">
          {schoolName}
        </h1>

        <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
          {school?.public_description || t("subtitle")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link href={`/${locale}/login`}>
            <Button size="lg" className="gap-2 shadow-sm">
              <GraduationCapIcon className="size-5" />
              <span>{t("portalSignIn")}</span>
              <ArrowRightIcon className="size-4 rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
