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

export function PublicNavbar({ school }: { school?: PublicSchoolProfileRow | null }) {
  const locale = useLocale();
  const t = useTranslations("home");
  const schoolName =
    resolveLocalizedText(locale, school?.name_ar, school?.name_en) ?? t("title");
  const logoUrl = getSchoolLogoUrl(school?.logo_path);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#overview" className="flex items-center gap-3 group">
          {logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logoUrl}
              alt={schoolName}
              className="size-9 rounded-lg border border-border/80 bg-background object-contain p-1 shadow-xs transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary shadow-xs transition-transform group-hover:scale-105">
              <GraduationCapIcon className="size-5" />
            </div>
          )}
          <span className="font-bold text-sm tracking-tight text-foreground line-clamp-1 max-w-[200px] sm:max-w-xs">
            {t("title")}
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
          <a
            href="#overview"
            className="transition-colors hover:text-foreground focus:text-foreground outline-hidden"
          >
            {t("navOverview")}
          </a>
          <a
            href="#about"
            className="transition-colors hover:text-foreground focus:text-foreground outline-hidden"
          >
            {t("navAbout")}
          </a>
          <a
            href="#features"
            className="transition-colors hover:text-foreground focus:text-foreground outline-hidden"
          >
            {t("navFeatures")}
          </a>
          <a
            href="#events"
            className="transition-colors hover:text-foreground focus:text-foreground outline-hidden"
          >
            {t("navEvents")}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href={`/${locale}/login`}>
            <Button size="sm" className="gap-1.5 shadow-xs font-medium text-xs">
              <GraduationCapIcon className="size-4" />
              <span className="hidden sm:inline">{t("portalSignIn")}</span>
              <span className="sm:hidden">{t("learnMore")}</span>
              <ArrowRightIcon className="size-3.5 rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
