"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showConfirmBox } from "@/lib/feedback/showConfirmBox";
import { deleteMaintenanceRequestAction } from "@/actions/maintenance/deleteMaintenanceRequestAction";
import { EditMaintenanceDialog } from "./EditMaintenanceDialog";
import type { MaintenanceRequestRow } from "@/lib/maintenance/types";
import type { LocationRow } from "@/lib/school/getSchoolLocations";

export function MaintenanceDetailActions({
  ticket,
  locations,
  canManage,
}: {
  ticket: MaintenanceRequestRow;
  locations: LocationRow[];
  canManage: boolean;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("maintenance");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!canManage) return null;

  const handleDelete = async () => {
    const confirmed = await showConfirmBox({
      message: t("confirmDeleteTicket"),
      type: "warning",
    });
    if (!confirmed) return;

    startTransition(async () => {
      const res = await deleteMaintenanceRequestAction(ticket.id);
      if (res.success) {
        toast.success(t("ticketDeleted"));
        router.push(`/${locale}/maintenance`);
      } else {
        toast.error(res.error || tCommon("error"));
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsEditDialogOpen(true)}
        disabled={isPending}
        className="gap-1.5"
      >
        <PencilIcon className="size-4" />
        <span>{t("editTicket")}</span>
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
        className="gap-1.5"
      >
        <Trash2Icon className="size-4" />
        <span>{t("deleteTicket")}</span>
      </Button>

      <EditMaintenanceDialog
        ticket={ticket}
        locations={locations}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
}
