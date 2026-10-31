"use client";

import { useLocale, useTranslations } from "next-intl";
import { Building2Icon } from "lucide-react";
import type { PublicSchoolProfileRow } from "@/lib/school/getPublicSchoolProfile";
import { resolveLocalizedText } from "@/lib/school/resolveLocalizedText";
import { getSchoolLogoUrl } from "@/lib/school/getSchoolLogoUrl";
import { parseSchoolNameHierarchy } from "@/lib/school/parseSchoolNameHierarchy";
import { PublicHeroCardsGrid } from "./PublicHeroCardsGrid";

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
      className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-primary/5 via-background to-background px-4 sm:px-8 lg:px-12 xl:px-16 pt-14 pb-16 sm:pt-16 sm:pb-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[850px] rounded-full bg-primary/10 blur-3xl animate-ambient-pulse"
      />

      <div className="relative mx-auto w-full max-w-[1720px] text-center space-y-12">
        <div className="mx-auto max-w-4xl space-y-6 animate-hero-fade-down">
          {hierarchy && (
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-5 py-2 text-xs sm:text-sm font-medium text-muted-foreground shadow-2xs backdrop-blur-xs transition-transform duration-300 hover:scale-105">
              <Building2Icon className="size-4 text-primary" />
              <span>{hierarchy}</span>
            </div>
          )}

          {logoUrl && (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt={displayTitle}
                className="size-24 sm:size-28 rounded-full border border-border/80 bg-card object-contain p-1.5 shadow-md ring-4 ring-primary/5 transition-transform duration-500 hover:scale-105"
              />
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-foreground leading-tight">
              {displayTitle}
            </h1>

            <p className="mx-auto max-w-3xl text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              {school?.public_description || t("subtitle")}
            </p>
          </div>
        </div>

        <PublicHeroCardsGrid school={school} />
      </div>
    </section>
  );
}
