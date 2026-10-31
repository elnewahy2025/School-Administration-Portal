"use client";

import { useTranslations } from "next-intl";
import { OperationalPlanIcon } from "@/components/icons/OperationalPlanIcon";
import { CommitteesGuideIcon } from "@/components/icons/CommitteesGuideIcon";
import { CounselingGuideIcon } from "@/components/icons/CounselingGuideIcon";
import { NavLink } from "./NavLink";

export function NavDocumentLinks({ onSelect }: { onSelect?: () => void }) {
  const t = useTranslations("nav");

  return (
    <>
      <div className="pt-2">
        <div className="mb-1 px-1 text-[11px] font-bold tracking-wider text-sidebar-foreground/60 uppercase">
          {t("schoolDocuments")}
        </div>
      </div>
      <NavLink
        href="/documents/operational-plan"
        label={t("operationalPlan")}
        icon={OperationalPlanIcon}
        onClick={onSelect}
      />
      <NavLink
        href="/documents/committees-guide"
        label={t("committeesGuide")}
        icon={CommitteesGuideIcon}
        onClick={onSelect}
      />
      <NavLink
        href="/documents/counseling-guide"
        label={t("counselingGuide")}
        icon={CounselingGuideIcon}
        onClick={onSelect}
      />
    </>
  );
}
