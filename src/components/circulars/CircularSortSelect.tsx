"use client";

import { useTranslations } from "next-intl";
import { ArrowUpDownIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CircularSortField } from "@/lib/circulars/sortCirculars";

export function CircularSortSelect({
  sortBy,
  onSortByChange,
}: {
  sortBy: CircularSortField;
  onSortByChange: (v: CircularSortField) => void;
}) {
  const t = useTranslations("circulars");

  return (
    <Select
      value={sortBy}
      onValueChange={(val) => onSortByChange((val as CircularSortField) || "publish_at_desc")}
    >
      <SelectTrigger className="w-48 gap-1.5">
        <ArrowUpDownIcon className="size-3.5 text-muted-foreground" />
        <SelectValue placeholder={t("sortBy")} />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="publish_at_desc">{t("sortNewestPublished")}</SelectItem>
        <SelectItem value="publish_at_asc">{t("sortOldestPublished")}</SelectItem>
        <SelectItem value="due_at_asc">{t("sortDueSoonest")}</SelectItem>
        <SelectItem value="due_at_desc">{t("sortDueFurthest")}</SelectItem>
        <SelectItem value="priority_desc">{t("sortHighestPriority")}</SelectItem>
        <SelectItem value="priority_asc">{t("sortLowestPriority")}</SelectItem>
        <SelectItem value="status">{t("sortStatus")}</SelectItem>
        <SelectItem value="ref_number">{t("sortRefNumber")}</SelectItem>
        <SelectItem value="title">{t("sortTitle")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
