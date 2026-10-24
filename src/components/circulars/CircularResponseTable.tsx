"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { buildResponseItems } from "@/lib/circulars/buildResponseItems";
import type { CircularResponseRow } from "@/lib/circulars/types";
import type { DepartmentResponseStatus } from "@/lib/circulars/getCircularDepartmentStatuses";
import { CircularResponseFilterBar, type ResponseFilterTab } from "./CircularResponseFilterBar";
import { CircularResponseTableRow } from "./CircularResponseTableRow";

export function CircularResponseTable({
  responses,
  expectedDepartments = [],
}: {
  responses: CircularResponseRow[];
  expectedDepartments?: DepartmentResponseStatus[];
}) {
  const t = useTranslations("circulars");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [filter, setFilter] = useState<ResponseFilterTab>("all");

  const items = buildResponseItems(responses, expectedDepartments);
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        {t("pending")}
      </div>
    );
  }

  const respondedCount = items.filter((i) => i.hasResponded).length;
  const filtered = items.filter((i) => {
    if (filter === "responded") return i.hasResponded;
    if (filter === "pending") return !i.hasResponded;
    return true;
  });

  const statusLabels: Record<string, string> = {
    pending: t("pending"),
    acknowledged: t("acknowledged"),
    approved: t("approved"),
    rejected: t("rejected"),
    completed: t("completed"),
    not_applicable: t("notApplicable"),
  };

  return (
    <div className="space-y-3">
      {expectedDepartments.length > 0 && (
        <CircularResponseFilterBar
          filter={filter}
          setFilter={setFilter}
          totalCount={items.length}
          respondedCount={respondedCount}
          pendingCount={items.length - respondedCount}
        />
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("department")}</TableHead>
              <TableHead>{t("responder")}</TableHead>
              <TableHead className="w-32">{t("responseStatus")}</TableHead>
              <TableHead>{t("rejectionReason")}</TableHead>
              <TableHead className="w-36 text-end">{tCommon("status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <CircularResponseTableRow
                key={item.departmentId}
                item={item}
                locale={locale}
                statusLabels={statusLabels}
                awaitingText={t("awaitingResponse")}
                notRespondedText={t("notResponded")}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
