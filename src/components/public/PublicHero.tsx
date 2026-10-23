"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { GraduationCapIcon, ArrowRightIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { PublicSchoolProfileRow } from "@/lib/school/getPublicSchoolProfile";

export function PublicHero({ school }: { school: PublicSchoolProfileRow | null }) {
  const locale = useLocale();
  const t = useTranslations("home");
  const schoolName = locale === "ar" ? (school?.name_ar || t("title")) : (school?.name_en || school?.name_ar || t("title"));

  return (
    <header className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/10 via-background to-background px-6 py-16 md:py-24">
      <div className="absolute top-4 end-6 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-4xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary shadow-xs">
          <SparklesIcon className="size-3.5" />
          <span>{schoolName}</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
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
