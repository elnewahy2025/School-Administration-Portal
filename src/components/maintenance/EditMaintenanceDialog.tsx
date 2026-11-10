"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MaintenanceEditFormFields } from "./MaintenanceEditFormFields";
import { useEditMaintenanceForm } from "./useEditMaintenanceForm";
import type { MaintenanceRequestRow } from "@/lib/maintenance/types";
import type { LocationRow } from "@/lib/school/getSchoolLocations";

export function EditMaintenanceDialog({
  ticket,
  locations,
  open,
  onOpenChange,
}: {
  ticket: MaintenanceRequestRow;
  locations: LocationRow[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("maintenance");
  const tCommon = useTranslations("common");
  const form = useEditMaintenanceForm(ticket, () => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("editTicket")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit} className="space-y-4">
          <MaintenanceEditFormFields form={form} locations={locations} />

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={form.isPending}
            >
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={form.isPending}>
              {form.isPending ? tCommon("loading") : tCommon("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
