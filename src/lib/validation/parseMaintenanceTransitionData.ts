import type { MaintenanceStatus } from "@/lib/maintenance/types";

export function parseMaintenanceTransitionData(formData: FormData) {
  const get = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  const photoEntry = formData.get("evidence_photo");
  const evidencePhoto = photoEntry instanceof File && photoEntry.size > 0 ? photoEntry : null;

  return {
    requestId: get("request_id"),
    targetStatus: get("target_status") as MaintenanceStatus,
    reason: get("reason") || null,
    evidencePhoto,
  };
}
