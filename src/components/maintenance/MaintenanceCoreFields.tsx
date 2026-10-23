"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocationPicker } from "./LocationPicker";
import type { LocationRow } from "@/lib/school/getSchoolLocations";

const CATEGORIES = [
  "electrical",
  "plumbing",
  "hvac",
  "carpentry",
  "cleaning",
  "it",
  "safety",
  "other",
] as const;

export function MaintenanceCoreFields({ locations }: { locations: LocationRow[] }) {
  const t = useTranslations("maintenance");
  const tCat = useTranslations("maintenance.categories");
  const tPri = useTranslations("maintenance.priorities");

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">{t("category")} *</Label>
          <select
            id="category"
            name="category"
            defaultValue="other"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {tCat(cat)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">{t("priority")} *</Label>
          <select
            id="priority"
            name="priority"
            defaultValue="medium"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
          >
            <option value="emergency">{tPri("emergency")}</option>
            <option value="urgent">{tPri("urgent")}</option>
            <option value="medium">{tPri("medium")}</option>
            <option value="deferrable">{tPri("deferrable")}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("location")}</Label>
          <LocationPicker locations={locations} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">{t("area")}</Label>
          <Input id="area" name="area" placeholder={t("area")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="asset_ref">{t("assetRef")}</Label>
        <Input id="asset_ref" name="asset_ref" placeholder="AC-ROOM-102 / PUMP-01" />
      </div>
    </>
  );
}
