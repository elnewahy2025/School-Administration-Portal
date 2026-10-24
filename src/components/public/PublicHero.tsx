"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  GraduationCapIcon,
  ArrowRightIcon,
  CalendarIcon,
  FileTextIcon,
  WrenchIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <section
      id="overview"
      className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/10 via-background to-background px-6 pt-12 pb-16 sm:pt-20 sm:pb-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs backdrop-blur-xs">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span>{t("badgeOfficial")}</span>
        </div>

        {logoUrl && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={schoolName}
              className="size-24 sm:size-28 object-contain rounded-2xl border border-border/80 bg-background/90 p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105"
            />
          </div>
        )}

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground whitespace-pre-line leading-tight">
          {schoolName}
        </h1>

        <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          {school?.public_description || t("subtitle")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href={`/${locale}/login`}>
            <Button
              size="lg"
              className="gap-2 shadow-md hover:shadow-lg transition-all text-sm font-semibold h-11 px-6"
            >
              <GraduationCapIcon className="size-5" />
              <span>{t("portalSignIn")}</span>
              <ArrowRightIcon className="size-4 rtl:rotate-180" />
            </Button>
          </Link>
          <a href="#events">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-sm font-medium h-11 px-5 border-border/80 hover:bg-accent"
            >
              <CalendarIcon className="size-4 text-primary" />
              <span>{t("exploreEvents")}</span>
            </Button>
          </a>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/70 px-3 py-1.5 shadow-2xs backdrop-blur-xs">
            <FileTextIcon className="size-3.5 text-primary" />
            <span>{t("moduleCirculars")}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/70 px-3 py-1.5 shadow-2xs backdrop-blur-xs">
            <WrenchIcon className="size-3.5 text-amber-500" />
            <span>{t("moduleMaintenance")}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/70 px-3 py-1.5 shadow-2xs backdrop-blur-xs">
            <CalendarIcon className="size-3.5 text-blue-500" />
            <span>{t("moduleCalendar")}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
