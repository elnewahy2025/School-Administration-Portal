"use client";

import { useTranslations } from "next-intl";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CircularFilterControls } from "./CircularFilterControls";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";
import type { CircularSortField } from "@/lib/circulars/sortCirculars";

export function CircularFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  departmentId,
  onDepartmentChange,
  sortBy,
  onSortByChange,
  departments,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  priority: string;
  onPriorityChange: (v: string) => void;
  departmentId: string;
  onDepartmentChange: (v: string) => void;
  sortBy: CircularSortField;
  onSortByChange: (v: CircularSortField) => void;
  departments: DepartmentRow[];
}) {
  const t = useTranslations("circulars");

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="ps-9"
          />
        </div>

        <CircularFilterControls
          status={status}
          onStatusChange={onStatusChange}
          priority={priority}
          onPriorityChange={onPriorityChange}
          departmentId={departmentId}
          onDepartmentChange={onDepartmentChange}
          sortBy={sortBy}
          onSortByChange={onSortByChange}
          departments={departments}
        />
      </div>
    </div>
  );
}
