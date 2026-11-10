"use client";

import { useTranslations } from "next-intl";
import { Loader2Icon, AlertCircleIcon, DownloadIcon, TableIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ExcelTableSheet } from "./ExcelTableSheet";
import { useExcelDocumentReader } from "./useExcelDocumentReader";

export interface ExcelDocumentViewerProps {
  url: string;
  fileName: string;
  className?: string;
}

export function ExcelDocumentViewer({ url, fileName, className = "" }: ExcelDocumentViewerProps) {
  const t = useTranslations("circulars");
  const { loading, error, sheetNames, activeSheet, setActiveSheet, currentRows } =
    useExcelDocumentReader(url);

  return (
    <div
      dir="rtl"
      className={`relative flex size-full flex-col overflow-hidden bg-background ${className}`}
    >
      {loading ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-xs">
          <Loader2Icon className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">{t("documentPreview")}</p>
        </div>
      ) : null}

      {error ? (
        <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center">
          <AlertCircleIcon className="size-10 text-destructive" />
          <p className="text-sm font-semibold text-foreground">{fileName}</p>
          <p className="max-w-md text-xs text-muted-foreground">{error}</p>
          <a
            href={url}
            download={fileName}
            className={buttonVariants({ variant: "outline", size: "sm", className: "gap-2" })}
          >
            <DownloadIcon className="size-4" />
            <span>{t("download")}</span>
          </a>
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          {sheetNames.length > 1 ? (
            <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border bg-muted/40 px-4 py-2">
              <TableIcon className="size-4 shrink-0 text-muted-foreground" />
              {sheetNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setActiveSheet(name)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    activeSheet === name
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          ) : null}

          <ExcelTableSheet rows={currentRows} />
        </>
      ) : null}
    </div>
  );
}
