"use client";

import { useTranslations } from "next-intl";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LocationRow } from "@/lib/school/getSchoolLocations";
import { LocationTableRow } from "./LocationTableRow";

export function LocationList({
  locations,
  canManage,
}: {
  locations: LocationRow[];
  canManage: boolean;
}) {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");

  if (locations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
        {tCommon("noData")}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("building")}</TableHead>
            <TableHead>{t("floor")}</TableHead>
            <TableHead>{t("room")}</TableHead>
            <TableHead>{t("kind")}</TableHead>
            <TableHead className="w-28">{tCommon("status")}</TableHead>
            {canManage && <TableHead className="w-44 text-end">{tCommon("actions")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((loc) => (
            <LocationTableRow key={loc.id} loc={loc} canManage={canManage} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
