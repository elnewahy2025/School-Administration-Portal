"use client";

import { useTranslations } from "next-intl";

export function PublicFooter() {
  const t = useTranslations("home");

  return (
    <footer className="border-t border-border bg-card px-6 py-8 text-center text-xs text-muted-foreground">
      <div className="mx-auto max-w-5xl space-y-2">
        <p className="font-medium text-foreground">{t("title")}</p>
        <p>© {new Date().getFullYear()} School Administration Portal. All rights reserved.</p>
      </div>
    </footer>
  );
}
