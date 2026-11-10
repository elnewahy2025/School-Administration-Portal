"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { showConfirmBox } from "@/lib/feedback/showConfirmBox";
import { deleteMaintenanceRequestAction } from "@/actions/maintenance/deleteMaintenanceRequestAction";

export function useMaintenanceRowActions(requestId: string) {
  const router = useRouter();
  const t = useTranslations("maintenance");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async () => {
    const confirmed = await showConfirmBox({
      message: t("confirmDeleteTicket"),
      type: "warning",
    });
    if (!confirmed) return;

    startTransition(async () => {
      const res = await deleteMaintenanceRequestAction(requestId);
      if (res.success) {
        toast.success(t("ticketDeleted"));
        router.refresh();
      } else {
        toast.error(res.error || tCommon("error"));
      }
    });
  };

  return {
    isPending,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleDelete,
  };
}
