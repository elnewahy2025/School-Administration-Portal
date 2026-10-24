"use client";

import { useTranslations } from "next-intl";

export function PublicFooter() {
  const t = useTranslations("home");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card px-6 py-8 text-center text-xs text-muted-foreground">
      <div className="mx-auto max-w-5xl">
        <p>© {currentYear} {t("title")}. All rights reserved.</p>
      </div>
    </footer>
  );
}
