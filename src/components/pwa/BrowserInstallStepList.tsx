"use client";

import { useTranslations } from "next-intl";
import { MoreVertical, PlusSquare, CheckCircle2 } from "lucide-react";

export function BrowserInstallStepList() {
  const t = useTranslations("pwa");

  const steps = [
    {
      num: 1,
      title: t("browserStep1Title"),
      desc: t("browserStep1Desc"),
      icon: <MoreVertical className="h-3.5 w-3.5" />,
    },
    {
      num: 2,
      title: t("browserStep2Title"),
      desc: t("browserStep2Desc"),
      icon: <PlusSquare className="h-3.5 w-3.5" />,
    },
    {
      num: 3,
      title: t("browserStep3Title"),
      desc: t("browserStep3Desc"),
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div key={step.num} className="flex items-start gap-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
            {step.num}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <span>{step.title}</span>
              <span className="inline-flex items-center justify-center rounded-md bg-muted px-1.5 py-0.5 text-primary">
                {step.icon}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

