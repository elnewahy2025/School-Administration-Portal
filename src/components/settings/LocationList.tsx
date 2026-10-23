"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleLocationStatusAction } from "@/actions/settings/toggleLocationStatusAction";
import type { LocationRow } from "@/lib/school/getSchoolLocations";

export function LocationList({
  locations,
  canManage,
}: {
  locations: LocationRow[];
  canManage: boolean;
}) {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const res = await toggleLocationStatusAction(id, currentStatus);
      if (res.success) {
        toast.success(tCommon("saved"));
      } else {
        toast.error(res.error ?? tCommon("error"));
      }
    });
  };

  if (locations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
        {tCommon("noData")}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("building")}</TableHead>
            <TableHead>{t("floor")}</TableHead>
            <TableHead>{t("room")}</TableHead>
            <TableHead>{t("kind")}</TableHead>
            <TableHead className="w-28">{tCommon("status")}</TableHead>
            {canManage && <TableHead className="w-32 text-end">{tCommon("actions")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((loc) => (
            <TableRow key={loc.id}>
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
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleToggle(loc.id, loc.is_active)}
                  >
                    {loc.is_active ? tCommon("inactive") : tCommon("active")}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
