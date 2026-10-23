import type { MaintenancePriority } from "@/lib/maintenance/types";

export function parseMaintenanceFormData(formData: FormData) {
  const get = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  const photoEntry = formData.get("photo");
  const photo = photoEntry instanceof File && photoEntry.size > 0 ? photoEntry : null;

  return {
    title: get("title"),
    description: get("description"),
    category: get("category") || "other",
    priority: (get("priority") || "medium") as MaintenancePriority,
    locationId: get("location_id") || null,
    area: get("area") || null,
    assetRef: get("asset_ref") || null,
    photo,
  };
}
