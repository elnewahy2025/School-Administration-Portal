"use client";

import { useTranslations } from "next-intl";
import { FileTextIcon, WrenchIcon, CalendarDaysIcon } from "lucide-react";

export function PublicFeaturesSection() {
  const t = useTranslations("home");

  const features = [
    {
      key: "circulars",
      icon: <FileTextIcon className="size-6 text-blue-500" />,
      badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      title: t("moduleCirculars"),
      description: t("moduleCircularsDesc"),
    },
    {
      key: "maintenance",
      icon: <WrenchIcon className="size-6 text-amber-500" />,
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      title: t("moduleMaintenance"),
      description: t("moduleMaintenanceDesc"),
    },
    {
      key: "calendar",
      icon: <CalendarDaysIcon className="size-6 text-emerald-500" />,
      badgeClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      title: t("moduleCalendar"),
      description: t("moduleCalendarDesc"),
    },
  ];

  return (
    <section id="features" className="border-t border-border/60 bg-muted/20 py-16 px-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("featuresTitle")}
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t("featuresDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((item) => (
            <div
              key={item.key}
              className="group relative rounded-2xl border border-border/80 bg-card/80 p-6 shadow-xs backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md space-y-4"
            >
              <div
                className={`flex size-12 items-center justify-center rounded-xl border ${item.badgeClass} transition-transform duration-300 group-hover:scale-110`}
              >
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">{item.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
