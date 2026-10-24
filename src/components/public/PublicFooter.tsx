"use client";

import { useTranslations } from "next-intl";
import { ArrowUpIcon } from "lucide-react";

export function PublicFooter() {
  const t = useTranslations("home");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/60 bg-card/60 px-6 py-10 text-xs text-muted-foreground backdrop-blur-xs">
      <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-center sm:text-start">
          © {currentYear} <span className="font-semibold text-foreground">{t("title")}</span>. All
          rights reserved.
        </p>

        <a
          href="#overview"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground shadow-2xs transition-colors hover:text-foreground hover:bg-accent"
        >
          <span>{t("navOverview")}</span>
          <ArrowUpIcon className="size-3.5" />
        </a>
      </div>
    </footer>
  );
}
