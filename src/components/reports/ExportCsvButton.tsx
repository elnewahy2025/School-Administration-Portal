"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { DownloadIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportCsvButton({
  type,
  filters = {},
}: {
  type: "circulars" | "maintenance";
  filters?: Record<string, string | undefined>;
}) {
  const t = useTranslations("reports");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    const params = new URLSearchParams({ type });
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });

    const a = document.createElement("a");
    a.href = `/api/reports/export?${params.toString()}`;
    a.setAttribute("download", "");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className="gap-2 text-xs"
    >
      {isExporting ? (
        <Loader2Icon className="size-3.5 animate-spin" />
      ) : (
        <DownloadIcon className="size-3.5" />
      )}
      <span>{isExporting ? t("exporting") : t("exportCsv")}</span>
    </Button>
  );
}
