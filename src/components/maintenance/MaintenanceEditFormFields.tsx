"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MaintenanceEditLocationFields } from "./MaintenanceEditLocationFields";
import type { LocationRow } from "@/lib/school/getSchoolLocations";
import type { useEditMaintenanceForm } from "./useEditMaintenanceForm";

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

export function MaintenanceEditFormFields({
  form,
  locations,
}: {
  form: ReturnType<typeof useEditMaintenanceForm>;
  locations: LocationRow[];
}) {
  const t = useTranslations("maintenance");
  const tCat = useTranslations("maintenance.categories");
  const tPri = useTranslations("maintenance.priorities");

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="edit-title">{t("ticketTitle")} *</Label>
        <Input
          id="edit-title"
          value={form.title}
          onChange={(e) => form.setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-desc">{t("ticketDescription")} *</Label>
        <Textarea
          id="edit-desc"
          value={form.description}
          onChange={(e) => form.setDescription(e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="edit-cat">{t("category")} *</Label>
          <select
            id="edit-cat"
            value={form.category}
            onChange={(e) => form.setCategory(e.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {tCat(cat)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-pri">{t("priority")} *</Label>
          <select
            id="edit-pri"
            value={form.priority}
            onChange={(e) => form.setPriority(e.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            <option value="emergency">{tPri("emergency")}</option>
            <option value="urgent">{tPri("urgent")}</option>
            <option value="medium">{tPri("medium")}</option>
            <option value="deferrable">{tPri("deferrable")}</option>
          </select>
        </div>
      </div>

      <MaintenanceEditLocationFields form={form} locations={locations} />
    </>
  );
}
