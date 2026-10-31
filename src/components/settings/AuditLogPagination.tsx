"use client";

import { usePathname, useRouter } from "@/i18n";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildAuditFilterParams } from "@/lib/audit/buildAuditFilterParams";
import type { AuditLogFilters } from "@/lib/school/getSchoolAuditLogs";

export function AuditLogPagination({
  page,
  totalPages,
  totalCount,
  filters,
}: {
  page: number;
  totalPages: number;
  totalCount: number;
  filters?: AuditLogFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const navigateToPage = (newPage: number) => {
    const params = buildAuditFilterParams(filters);
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
        <span>{totalCount} total entries</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
      <span>
        Page {page} of {totalPages} ({totalCount} entries)
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => navigateToPage(page - 1)}
          className="h-8 gap-1 text-xs"
        >
          <ChevronLeftIcon className="size-3.5" />
          <span>Previous</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => navigateToPage(page + 1)}
          className="h-8 gap-1 text-xs"
        >
          <span>Next</span>
          <ChevronRightIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
