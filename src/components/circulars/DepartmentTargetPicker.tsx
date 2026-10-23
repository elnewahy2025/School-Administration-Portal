import { Label } from "@/components/ui/label";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";

export function DepartmentTargetPicker({
  departments,
  label,
  initialSelectedIds,
}: {
  departments: DepartmentRow[];
  label: string;
  initialSelectedIds?: string[];
}) {
  const selectedSet = new Set(initialSelectedIds ?? []);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {departments.map((dept) => (
          <label
            key={dept.id}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-2.5 text-xs hover:bg-accent"
          >
            <input
              type="checkbox"
              name="department_ids"
              value={dept.id}
              defaultChecked={selectedSet.has(dept.id)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span className="truncate">{dept.name_ar}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
