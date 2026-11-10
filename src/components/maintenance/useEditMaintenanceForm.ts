"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { updateMaintenanceRequestAction } from "@/actions/maintenance/updateMaintenanceRequestAction";
import type { MaintenanceRequestRow } from "@/lib/maintenance/types";

export function useEditMaintenanceForm(ticket: MaintenanceRequestRow, onClose: () => void) {
  const router = useRouter();
  const t = useTranslations("maintenance");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [category, setCategory] = useState(ticket.category);
  const [priority, setPriority] = useState<string>(ticket.priority);
  const [locationId, setLocationId] = useState<string>(ticket.location_id ?? "");
  const [area, setArea] = useState(ticket.area ?? "");
  const [assetRef, setAssetRef] = useState(ticket.asset_ref ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateMaintenanceRequestAction({
        requestId: ticket.id,
        title,
        description,
        category,
        priority,
        locationId: locationId || null,
        area: area || null,
        assetRef: assetRef || null,
      });

      if (res.success) {
        toast.success(t("ticketUpdated"));
        onClose();
        router.refresh();
      } else {
        toast.error(res.error || tCommon("error"));
      }
    });
  };

  return {
    isPending,
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    priority,
    setPriority,
    locationId,
    setLocationId,
    area,
    setArea,
    assetRef,
    setAssetRef,
    handleSubmit,
  };
}
