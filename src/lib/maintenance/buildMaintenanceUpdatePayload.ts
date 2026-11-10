import type { UpdateMaintenanceRequestInput } from "@/actions/maintenance/updateMaintenanceRequestAction";

export function buildMaintenanceUpdatePayload(
  input: UpdateMaintenanceRequestInput,
  valid: { title: string; description: string },
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    title: valid.title,
    description: valid.description,
    category: input.category,
    location_id: input.locationId || null,
    area: input.area?.trim() || null,
    asset_ref: input.assetRef?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  if (input.priority) {
    payload.priority = input.priority;
  }

  return payload;
}
