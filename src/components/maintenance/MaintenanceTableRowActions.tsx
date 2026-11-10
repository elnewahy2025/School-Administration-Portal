"use client";

import { Link } from "@/i18n";
import { useLocale, useTranslations } from "next-intl";
import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditMaintenanceDialog } from "./EditMaintenanceDialog";
import { useMaintenanceRowActions } from "./useMaintenanceRowActions";
import type { MaintenanceRequestRow } from "@/lib/maintenance/types";
import type { LocationRow } from "@/lib/school/getSchoolLocations";

export function MaintenanceTableRowActions({
  ticket,
  locations,
  canManage,
}: {
  ticket: MaintenanceRequestRow;
  locations: LocationRow[];
  canManage: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("maintenance");
  const { isPending, isEditDialogOpen, setIsEditDialogOpen, handleDelete } =
    useMaintenanceRowActions(ticket.id);

  return (
    <div className="inline-flex items-center justify-end gap-1">
      <Link href={`/${locale}/maintenance/${ticket.id}`}>
        <Button variant="ghost" size="sm" aria-label={t("ticketNumber")}>
          <EyeIcon className="size-4" />
        </Button>
      </Link>

      {canManage && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            disabled={isPending}
            aria-label={t("editTicket")}
            className="text-muted-foreground hover:text-foreground"
          >
            <PencilIcon className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            aria-label={t("deleteTicket")}
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2Icon className="size-4" />
          </Button>

          <EditMaintenanceDialog
            ticket={ticket}
            locations={locations}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
        </>
      )}
    </div>
  );
}
