"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleLocationStatusAction } from "@/actions/settings/toggleLocationStatusAction";
import { deleteLocationAction } from "@/actions/settings/deleteLocationAction";
import type { LocationRow } from "@/lib/school/getSchoolLocations";
import { EditLocationDialog } from "./EditLocationDialog";

export function LocationTableRow({ loc, canManage }: { loc: LocationRow; canManage: boolean }) {
  const tCommon = useTranslations("common");
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const res = await toggleLocationStatusAction(loc.id, loc.is_active);
      if (res.success) toast.success(tCommon("saved"));
      else toast.error(res.error ?? tCommon("error"));
    });
  };

  const handleDelete = () => {
    if (!window.confirm(tCommon("confirmDelete"))) return;
    startTransition(async () => {
      const res = await deleteLocationAction(loc.id);
      if (res.success) toast.success(tCommon("deleted"));
      else toast.error(res.error ?? tCommon("error"));
    });
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium text-foreground">{loc.building}</TableCell>
        <TableCell className="text-muted-foreground">{loc.floor ?? "—"}</TableCell>
        <TableCell className="text-muted-foreground">{loc.room ?? "—"}</TableCell>
        <TableCell>
          <Badge variant="outline">{loc.kind}</Badge>
        </TableCell>
        <TableCell>
          <Badge variant={loc.is_active ? "default" : "secondary"}>
            {loc.is_active ? tCommon("active") : tCommon("inactive")}
          </Badge>
        </TableCell>
        {canManage && (
          <TableCell className="text-end">
            <div className="flex items-center justify-end gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => setIsEditing(true)}
                title={tCommon("edit")}
              >
                <PencilIcon className="size-3.5" />
              </Button>
              <Button variant="outline" size="sm" disabled={isPending} onClick={handleToggle}>
                {loc.is_active ? tCommon("inactive") : tCommon("active")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={isPending}
                onClick={handleDelete}
                title={tCommon("delete")}
              >
                <Trash2Icon className="size-3.5" />
              </Button>
            </div>
          </TableCell>
        )}
      </TableRow>
      {isEditing && (
        <EditLocationDialog location={loc} isOpen={isEditing} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}
