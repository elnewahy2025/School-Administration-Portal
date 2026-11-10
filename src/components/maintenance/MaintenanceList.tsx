"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { WrenchIcon } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MaintenanceTableRow } from "./MaintenanceTableRow";
import { MaintenanceListHeader } from "./MaintenanceListHeader";
import { MaintenanceFiltersToolbar } from "./MaintenanceFiltersToolbar";
import { filterMaintenanceTickets } from "@/lib/maintenance/filterMaintenanceTickets";
import type { MaintenanceRequestRow } from "@/lib/maintenance/types";
import type { LocationRow } from "@/lib/school/getSchoolLocations";

export function MaintenanceList({
  tickets,
  canCreate,
  locations = [],
  currentUserId,
  canManageAll = false,
}: {
  tickets: MaintenanceRequestRow[];
  canCreate: boolean;
  locations?: LocationRow[];
  currentUserId?: string;
  canManageAll?: boolean;
}) {
  const t = useTranslations("maintenance");
  const tCommon = useTranslations("common");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTickets = tickets.filter((tk) =>
    filterMaintenanceTickets(tk, search, statusFilter),
  );

  return (
    <div className="space-y-6">
      <MaintenanceListHeader canCreate={canCreate} />

      <MaintenanceFiltersToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-[color:var(--panel,var(--card))] p-12 text-center">
          <WrenchIcon className="mb-3 size-10 text-muted-foreground/60" />
          <p className="text-sm font-medium text-foreground">{t("noTickets")}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_12px_30px_rgba(20,37,74,.10)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b-0 bg-[linear-gradient(90deg,var(--topbar-from,var(--sidebar)),var(--topbar-to,var(--sidebar)))] hover:bg-transparent [&_th]:h-11 [&_th]:px-3 [&_th]:font-bold [&_th]:text-sidebar-foreground">
                <TableHead>{t("ticketNumber")}</TableHead>
                <TableHead>{t("ticketTitle")}</TableHead>
                <TableHead>{t("location")}</TableHead>
                <TableHead>{t("priority")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("reporter")}</TableHead>
                <TableHead>{t("createdAt")}</TableHead>
                <TableHead className="text-end">{tCommon("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((tk) => {
                const canManage =
                  canManageAll || (Boolean(currentUserId) && tk.reporter_id === currentUserId);
                return (
                  <MaintenanceTableRow
                    key={tk.id}
                    ticket={tk}
                    locations={locations}
                    canManage={canManage}
                  />
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
