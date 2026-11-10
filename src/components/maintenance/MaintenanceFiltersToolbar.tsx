"use client";

import { useTranslations } from "next-intl";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PANEL } from "@/components/ui/diamond-card-styles";

const STATUS_FILTERS = ["all", "emergency", "in_progress", "resolved", "closed"] as const;

export function MaintenanceFiltersToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (filter: string) => void;
}) {
  const t = useTranslations("maintenance");
  const tCommon = useTranslations("common");

  return (
    <div className={`${PANEL} flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between`}>
      <div className="relative max-w-sm flex-1">
        <SearchIcon className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={tCommon("search")}
          className="ps-9"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {STATUS_FILTERS.map((f) => (
          <Button
            key={f}
            variant={statusFilter === f ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusFilterChange(f)}
          >
            {f === "all"
              ? t("filterAll")
              : f === "emergency"
                ? t("priorities.emergency")
                : t(`statuses.${f}`)}
          </Button>
        ))}
      </div>
    </div>
  );
}
