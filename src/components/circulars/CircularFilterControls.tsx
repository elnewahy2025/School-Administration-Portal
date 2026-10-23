"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircularSortSelect } from "./CircularSortSelect";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";
import type { CircularSortField } from "@/lib/circulars/sortCirculars";

export function CircularFilterControls({
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
    <div className="flex flex-wrap items-center gap-2">
      <Select value={status} onValueChange={(val) => onStatusChange(val || "all")}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder={t("allStatuses")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allStatuses")}</SelectItem>
          <SelectItem value="draft">{t("draft")}</SelectItem>
          <SelectItem value="published">{t("published")}</SelectItem>
          <SelectItem value="in_progress">{t("inProgress")}</SelectItem>
          <SelectItem value="completed">{t("completed")}</SelectItem>
          <SelectItem value="overdue">{t("overdue")}</SelectItem>
          <SelectItem value="archived">{t("archived")}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priority} onValueChange={(val) => onPriorityChange(val || "all")}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={t("allPriorities")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allPriorities")}</SelectItem>
          <SelectItem value="urgent">{t("urgent")}</SelectItem>
          <SelectItem value="high">{t("high")}</SelectItem>
          <SelectItem value="normal">{t("normal")}</SelectItem>
          <SelectItem value="low">{t("low")}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={departmentId} onValueChange={(val) => onDepartmentChange(val || "all")}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t("allDepartments")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allDepartments")}</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name_ar || dept.name_en}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <CircularSortSelect sortBy={sortBy} onSortByChange={onSortByChange} />
    </div>
  );
}
