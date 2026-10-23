"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { UserCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { assignMaintenanceAction } from "@/actions/maintenance/assignMaintenanceAction";
import type { SchoolUserRow } from "@/lib/school/getSchoolUsers";
import type { MaintenancePriority, MaintenanceStatus } from "@/lib/maintenance/types";

export function MaintenanceAssignSection({
  requestId,
  currentOperatorId,
  currentPriority,
  currentStatus,
  operators,
}: {
  requestId: string;
  currentOperatorId: string | null;
  currentPriority: MaintenancePriority;
  currentStatus: MaintenanceStatus;
  operators: SchoolUserRow[];
}) {
  const t = useTranslations("maintenance");
  const tPri = useTranslations("maintenance.priorities");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  if (currentStatus === "closed" || currentStatus === "rejected") return null;

  const handleAssign = (formData: FormData) => {
    startTransition(async () => {
      const res = await assignMaintenanceAction(formData);
      if (res.success) toast.success(tCommon("saved"));
      else toast.error(res.error || tCommon("error"));
    });
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <UserCheckIcon className="size-5 text-primary" />
        <h3 className="font-semibold text-foreground">{t("actions.assign")}</h3>
      </div>
      <form action={handleAssign} className="space-y-4">
        <input type="hidden" name="request_id" value={requestId} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="operator_id">{t("assignedOperator")} *</Label>
            <select
              id="operator_id"
              name="operator_id"
              defaultValue={currentOperatorId ?? ""}
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
            >
              <option value="">{t("actions.selectOperator")}</option>
              {operators.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">{t("priority")}</Label>
            <select
              id="priority"
              name="priority"
              defaultValue={currentPriority}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
            >
              <option value="emergency">{tPri("emergency")}</option>
              <option value="urgent">{tPri("urgent")}</option>
              <option value="medium">{tPri("medium")}</option>
              <option value="deferrable">{tPri("deferrable")}</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Input id="notes" name="notes" placeholder={t("actions.notePlaceholder")} />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? tCommon("loading") : t("actions.assign")}
          </Button>
        </div>
      </form>
    </div>
  );
}
