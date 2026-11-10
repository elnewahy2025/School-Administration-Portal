"use client";

import { useLocale, useTranslations } from "next-intl";
import { FileTextIcon } from "lucide-react";
import type { CircularRow } from "@/lib/circulars/types";
import { PublicCircularCard } from "./PublicCircularCard";

export function PublicCircularsSection({ circulars = [] }: { circulars?: CircularRow[] }) {
  const locale = useLocale();
  const t = useTranslations("home");

  return (
    <section
      id="circulars"
      aria-label={t("circularsTitle")}
      className="border-t border-border/60 bg-muted/10 py-16 sm:py-20 px-4 sm:px-8 lg:px-12 xl:px-16"
    >
      <div className="mx-auto w-full max-w-[1520px] space-y-8 animate-hero-fade-up">
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-gold">
            <span className="h-0.5 w-12 rounded-full bg-gold/70" />
            <span>{t("circularsEyebrow")}</span>
            <span className="h-0.5 w-12 rounded-full bg-gold/70" />
          </div>

          <h2 className="font-heading text-2xl font-black tracking-tight text-[#0a2f7a] sm:text-3xl lg:text-4xl dark:text-foreground">
            {t("circularsTitle")}
          </h2>

          <div className="mx-auto h-1 w-12 rounded-full bg-[#e5a93b]" aria-hidden="true" />

          <p className="mx-auto max-w-2xl text-xs sm:text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("circularsSubtitle")}
          </p>
        </div>

        {circulars.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border/80 bg-card/60 p-8 text-center space-y-3">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <FileTextIcon className="size-6" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{t("noPublicCirculars")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch pt-4">
            {circulars.map((circular) => (
              <PublicCircularCard key={circular.id} circular={circular} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

