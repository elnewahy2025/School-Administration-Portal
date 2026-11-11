"use client";

import { useTranslations } from "next-intl";
import { PrinterIcon, DownloadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { printDocumentFile } from "@/lib/documents/printDocumentFile";
import type { SchoolDocumentRow } from "@/lib/documents/types";

export function SchoolDocumentPreviewActions({
  currentDoc,
  onClose,
}: {
  currentDoc?: SchoolDocumentRow | null;
  onClose: () => void;
}) {
  const t = useTranslations("documents");
  const fileUrl = currentDoc?.file_url;

  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
      {fileUrl ? (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => printDocumentFile(fileUrl)}
            className="gap-1.5 px-2.5 text-xs sm:px-3"
            aria-label={t("print")}
            title={t("print")}
          >
            <PrinterIcon className="size-3.5 text-primary" />
            <span className="hidden sm:inline">{t("print")}</span>
          </Button>

          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={currentDoc?.file_name}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-primary shadow-2xs transition-colors hover:bg-card hover:text-foreground sm:px-3"
            aria-label={t("download")}
            title={t("download")}
          >
            <DownloadIcon className="size-3.5 text-primary" />
            <span className="hidden sm:inline">{t("download")}</span>
          </a>
        </>
      ) : null}

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onClose}
        className="size-8 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label={t("close")}
      >
        <XIcon className="size-4" />
      </Button>
    </div>
  );
}
