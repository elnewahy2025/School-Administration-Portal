"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n";
import { CircularPriorityBadge } from "@/components/circulars/CircularPriorityBadge";
import { CircularStatusBadge } from "@/components/circulars/CircularStatusBadge";
import type { CircularReportRow } from "@/lib/reports/types";
import { CircularReportExpandedDepts } from "./CircularReportExpandedDepts";

export function CircularReportTableRow({ row }: { row: CircularReportRow }) {
  const t = useTranslations("circulars");
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow className="hover:bg-muted/40">
        <TableCell className="font-mono text-xs text-muted-foreground">
          <Link href={`/circulars/${row.id}`} className="hover:text-primary hover:underline">
            {row.refNumber}
          </Link>
        </TableCell>
        <TableCell className="font-medium text-foreground">{row.title}</TableCell>
        <TableCell>
          <CircularPriorityBadge priority={row.priority as never} />
        </TableCell>
        <TableCell>
          <CircularStatusBadge status={row.status as never} />
        </TableCell>
        <TableCell className="text-center">{row.totalTargets}</TableCell>
        <TableCell className="text-center font-medium text-emerald-600 dark:text-emerald-400">
          {row.totalResponses}
        </TableCell>
        <TableCell className="text-end text-xs font-semibold">{row.compliancePercent}%</TableCell>
        <TableCell className="w-12 text-center">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setExpanded(!expanded)}
            aria-label={t("whoResponded")}
          >
            {expanded ? (
              <ChevronUpIcon className="size-4" />
            ) : (
              <ChevronDownIcon className="size-4" />
            )}
          </Button>
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow className="border-b border-border bg-muted/15">
          <TableCell colSpan={8} className="p-3 sm:p-4">
            <CircularReportExpandedDepts
              responded={row.respondedDepartments ?? []}
              pending={row.pendingDepartments ?? []}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
