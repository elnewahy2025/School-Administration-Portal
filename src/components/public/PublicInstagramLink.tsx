"use client";

import { useTranslations } from "next-intl";
import { InstagramIcon } from "./InstagramIcon";

export function PublicInstagramLink({
  url = "https://www.instagram.com/alfirdous_sc/",
}: {
  url?: string | null;
}) {
  const t = useTranslations("home");
  const href = url || "https://www.instagram.com/alfirdous_sc/";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("instagramLabel")}
      className="inline-flex size-9 items-center justify-center rounded-lg border border-gold/40 bg-card/60 text-sidebar-foreground shadow-2xs backdrop-blur-xs transition-all duration-200 hover:scale-105 hover:border-gold hover:bg-gold/15 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      title={t("instagramLabel")}
    >
      <InstagramIcon className="size-4.5" />
    </a>
  );
}
