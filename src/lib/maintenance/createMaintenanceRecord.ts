import type { SupabaseClient } from "@supabase/supabase-js";
import type { MaintenancePriority } from "./types";
import { generateDocumentReferenceNumber } from "@/lib/school/generateDocumentReferenceNumber";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function createMaintenanceRecord(
  supabase: SupabaseClient,
  params: {
    schoolId: string;
    title: string;
    description: string;
    category: string;
    locationId: string | null;
    area: string | null;
    assetRef: string | null;
    priority: MaintenancePriority;
    reporterId: string;
    reporterDepartmentId: string | null;
  },
): Promise<{ requestId?: string; error?: string }> {
  const { refNum: ticketNumber, error: ticketError } = await generateDocumentReferenceNumber(
    supabase,
    params.schoolId,
    "maintenance",
  );

  if (ticketError) return { error: ticketError };
  if (!ticketNumber) return { error: "Failed to generate ticket number" };

  const payload = {
    school_id: params.schoolId,
    ticket_number: ticketNumber,
    title: params.title,
    description: params.description,
    category: params.category,
    location_id: params.locationId,
    area: params.area,
    asset_ref: params.assetRef,
    priority: params.priority,
    status: "submitted" as const,
    reporter_id: params.reporterId,
    reporter_department_id: params.reporterDepartmentId,
  };

  const { data, error } = await supabase
    .from("maintenance_requests")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    if (error.code === "42501" || error.message?.includes("row-level security")) {
      const admin = createSupabaseAdminClient({
        actorId: params.reporterId,
        actorLabel: "create-maintenance-record-fallback",
      });
      const { data: adminData, error: adminError } = await admin
        .from("maintenance_requests")
        .insert(payload)
        .select("id")
        .single();

      if (adminError) return { error: adminError.message };
      if (!adminData) return { error: "Failed to create maintenance request" };
      return { requestId: adminData.id };
    }
    return { error: error.message };
  }
  if (!data) return { error: "Failed to create maintenance request" };

  return { requestId: data.id };
}
