import { createSupabaseServerClient } from "@/lib/supabase";
import type { CircularRow, CircularTargetRow } from "./types";

export type CircularDetail = CircularRow & {
  targets: CircularTargetRow[];
};

type TargetJoinResult = {
  id: string;
  circular_id: string;
  department_id: string | null;
  role_key: string | null;
  departments: { name_ar: string; name_en: string } | null;
};

export async function getCircularById(circularId: string): Promise<CircularDetail | null> {
  const supabase = await createSupabaseServerClient();
  const [{ data: circular, error: circError }, { data: targets }] = await Promise.all([
    supabase.from("circulars").select("*").eq("id", circularId).maybeSingle(),
    supabase
      .from("circular_targets")
      .select("id, circular_id, department_id, role_key, departments(name_ar, name_en)")
      .eq("circular_id", circularId),
  ]);

  if (circError || !circular) return null;

  const rawTargets = (targets as unknown as TargetJoinResult[]) ?? [];
  const mappedTargets: CircularTargetRow[] = rawTargets.map((t) => ({
    id: t.id,
    circular_id: t.circular_id,
    department_id: t.department_id,
    department_name: t.departments?.name_ar || t.departments?.name_en || null,
    role_key: t.role_key,
  }));

  return {
    ...(circular as CircularRow),
    targets: mappedTargets,
  };
}
