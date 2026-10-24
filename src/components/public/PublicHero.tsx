"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { GraduationCapIcon, ArrowRightIcon, Building2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { PublicSchoolProfileRow } from "@/lib/school/getPublicSchoolProfile";
import { resolveLocalizedText } from "@/lib/school/resolveLocalizedText";
import { getSchoolLogoUrl } from "@/lib/school/getSchoolLogoUrl";
import { parseSchoolNameHierarchy } from "@/lib/school/parseSchoolNameHierarchy";
import { PublicHeroCapabilities } from "./PublicHeroCapabilities";

export function PublicHero({ school }: { school: PublicSchoolProfileRow | null }) {
  const locale = useLocale();
  const t = useTranslations("home");

  const rawSchoolName = resolveLocalizedText(locale, school?.name_ar, school?.name_en);
  const { hierarchy, primaryName } = parseSchoolNameHierarchy(rawSchoolName);
  const displayTitle = primaryName || t("title");
  const logoUrl = getSchoolLogoUrl(school?.logo_path);

  return (
    <section
      id="overview"
      className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-primary/5 via-background to-background px-6 pt-16 pb-16 sm:pt-20 sm:pb-20"
    >
      <div className="absolute top-4 end-6 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl text-center space-y-6">
        {hierarchy && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-2xs backdrop-blur-xs">
            <Building2Icon className="size-3.5 text-primary" />
            <span>{hierarchy}</span>
          </div>
        )}

        {logoUrl && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={displayTitle}
              className="size-20 sm:size-24 rounded-full border border-border/80 bg-card object-contain p-1 shadow-md ring-4 ring-primary/5 transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            {displayTitle}
          </h1>

          <p className="mx-auto max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            {school?.public_description || t("subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href={`/${locale}/login`}>
            <Button
              size="lg"
              className="h-11 rounded-xl px-8 text-sm font-semibold shadow-md hover:shadow-lg transition-all gap-2"
            >
              <GraduationCapIcon className="size-5" />
              <span>{t("portalSignIn")}</span>
              <ArrowRightIcon className="size-4 rtl:rotate-180" />
            </Button>
          </Link>
        </div>

        <PublicHeroCapabilities />
      </div>
    </section>
  );
}
