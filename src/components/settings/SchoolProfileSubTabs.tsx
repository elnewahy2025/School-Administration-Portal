"use client";

import { useTranslations } from "next-intl";
import { SCHOOL_PROFILE_TABS } from "./schoolProfileTabList";
import type { SchoolProfileTabId } from "./schoolProfileTabTypes";

export function SchoolProfileSubTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: SchoolProfileTabId;
  onTabChange: (tab: SchoolProfileTabId) => void;
}) {
  const t = useTranslations("settings");

  return (
    <div
      role="tablist"
      aria-label={t("school")}
      className="flex flex-wrap items-center gap-1.5 sm:gap-2 rounded-2xl border border-border/80 bg-muted/30 p-1.5 sm:p-2"
    >
      {SCHOOL_PROFILE_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer ${
              isActive
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-background/80 hover:text-foreground"
            }`}
          >
            <Icon className={`size-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
            <span>{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
