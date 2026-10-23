"use client";

import { useTranslations } from "next-intl";
import { formatLocation } from "@/lib/maintenance/formatLocation";
import type { LocationRow } from "@/lib/school/getSchoolLocations";

export function LocationPicker({
  locations,
  defaultValue,
}: {
  locations: LocationRow[];
  defaultValue?: string;
}) {
  const t = useTranslations("maintenance");

  return (
    <select
      name="location_id"
      defaultValue={defaultValue ?? ""}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
    >
      <option value="">{t("selectLocation")}</option>
      {locations.map((loc) => (
        <option key={loc.id} value={loc.id}>
          {formatLocation(loc)}
        </option>
      ))}
    </select>
  );
}
