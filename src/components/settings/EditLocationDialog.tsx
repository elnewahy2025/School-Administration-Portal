"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateLocationAction } from "@/actions/settings/updateLocationAction";
import type { LocationRow } from "@/lib/school/getSchoolLocations";
import { LocationFormFields } from "./LocationFormFields";

export function EditLocationDialog({
  location,
  isOpen,
  onClose,
}: {
  location: LocationRow;
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const [building, setBuilding] = useState(location.building);
  const [floor, setFloor] = useState(location.floor ?? "");
  const [room, setRoom] = useState(location.room ?? "");
  const [kind, setKind] = useState(location.kind);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateLocationAction(location.id, building, floor, room, kind);
      if (res.success) {
        toast.success(tCommon("saved"));
        onClose();
      } else {
        toast.error(res.error ?? tCommon("error"));
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-foreground">{t("editLocation")}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <LocationFormFields
            building={building}
            setBuilding={setBuilding}
            floor={floor}
            setFloor={setFloor}
            room={room}
            setRoom={setRoom}
            kind={kind}
            setKind={setKind}
            disabled={isPending}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {tCommon("save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
