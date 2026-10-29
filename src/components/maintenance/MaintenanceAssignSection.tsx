"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { UserCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { assignMaintenanceAction } from "@/actions/maintenance/assignMaintenanceAction";
import { MaintenanceNoOperatorsAlert } from "./MaintenanceNoOperatorsAlert";
import { MaintenanceOperatorSelect } from "./MaintenanceOperatorSelect";
import type { SchoolUserRow } from "@/lib/school/getSchoolUsers";
import type { MaintenancePriority, MaintenanceStatus } from "@/lib/maintenance/types";

const PRIORITY_KEYS: MaintenancePriority[] = ["emergency", "urgent", "medium", "deferrable"];

type MaintenanceAssignSectionProps = {
  requestId: string;
  currentOperatorId: string | null;
  currentPriority: MaintenancePriority;
  currentStatus: MaintenanceStatus;
  operators: SchoolUserRow[];
};

export function MaintenanceAssignSection({
  requestId,
  currentOperatorId,
  currentPriority,
  currentStatus,
  operators,
}: MaintenanceAssignSectionProps) {
  const t = useTranslations("maintenance");
  const tPri = useTranslations("maintenance.priorities");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  if (currentStatus === "closed" || currentStatus === "rejected") return null;

  const hasOperators = operators.length > 0;

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

      {!hasOperators && <MaintenanceNoOperatorsAlert />}

      <form action={handleAssign} className="space-y-4">
        <input type="hidden" name="request_id" value={requestId} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MaintenanceOperatorSelect
            currentOperatorId={currentOperatorId}
            isPending={isPending}
            operators={operators}
          />
          <div className="space-y-2">
            <Label htmlFor="priority">{t("priority")}</Label>
            <select
              id="priority"
              name="priority"
              defaultValue={currentPriority}
              disabled={isPending}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
            >
              {PRIORITY_KEYS.map((p) => (
                <option key={p} value={p}>
                  {tPri(p)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Input
            id="notes"
            name="notes"
            placeholder={t("actions.notePlaceholder")}
            disabled={isPending}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={isPending || !hasOperators}>
            {isPending ? tCommon("loading") : t("actions.assign")}
          </Button>
        </div>
      </form>
    </div>
  );
}
