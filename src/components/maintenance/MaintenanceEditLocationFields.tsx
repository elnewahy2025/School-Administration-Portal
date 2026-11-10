"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatLocation } from "@/lib/maintenance/formatLocation";
import type { LocationRow } from "@/lib/school/getSchoolLocations";
import type { useEditMaintenanceForm } from "./useEditMaintenanceForm";

export function MaintenanceEditLocationFields({
  form,
  locations,
}: {
  form: ReturnType<typeof useEditMaintenanceForm>;
  locations: LocationRow[];
}) {
  const t = useTranslations("maintenance");

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="edit-loc">{t("location")}</Label>
          <select
            id="edit-loc"
            value={form.locationId}
            onChange={(e) => form.setLocationId(e.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            <option value="">{t("selectLocation")}</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {formatLocation(loc)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-area">{t("area")}</Label>
          <Input
            id="edit-area"
            value={form.area}
            onChange={(e) => form.setArea(e.target.value)}
            placeholder={t("area")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-asset">{t("assetRef")}</Label>
        <Input
          id="edit-asset"
          value={form.assetRef}
          onChange={(e) => form.setAssetRef(e.target.value)}
          placeholder="AC-ROOM-102"
        />
      </div>
    </>
  );
}

