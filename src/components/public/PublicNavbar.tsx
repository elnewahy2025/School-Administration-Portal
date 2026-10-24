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

import { parseSchoolNameHierarchy } from "@/lib/school/parseSchoolNameHierarchy";

export function PublicNavbar({ school }: { school?: PublicSchoolProfileRow | null }) {
  const locale = useLocale();
  const t = useTranslations("home");
  const rawSchoolName = resolveLocalizedText(locale, school?.name_ar, school?.name_en);
  const { primaryName } = parseSchoolNameHierarchy(rawSchoolName);
  const displayTitle = primaryName || t("title");
  const logoUrl = getSchoolLogoUrl(school?.logo_path);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#overview" className="flex items-center gap-2.5 group">
          {logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logoUrl}
              alt={displayTitle}
              className="size-9 rounded-full border border-border/80 bg-background object-contain p-0.5 shadow-xs transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex size-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-xs transition-transform group-hover:scale-105">
              <GraduationCapIcon className="size-4.5" />
            </div>
          )}
          <span className="font-semibold text-sm tracking-tight text-foreground line-clamp-1 max-w-[180px] sm:max-w-xs">
            {displayTitle}
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
