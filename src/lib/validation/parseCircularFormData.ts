import type { CircularPriority, CircularResponseType } from "@/lib/circulars/types";

export function parseCircularFormData(formData: FormData) {
  const get = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  const departmentIds = formData.getAll("department_ids").map(String).filter(Boolean);

  return {
    title: get("title"),
    body: get("body"),
    priority: (get("priority") || "normal") as CircularPriority,
    responseType: (get("response_type") || "acknowledgement") as CircularResponseType,
    dueAt: get("due_at") || null,
    departmentIds,
  };
}
