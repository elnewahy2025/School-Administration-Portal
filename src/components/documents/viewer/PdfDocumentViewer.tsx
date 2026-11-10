"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLinkIcon, DownloadIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export interface PdfDocumentViewerProps {
  url: string;
  fileName: string;
  className?: string;
}

export function PdfDocumentViewer({ url, fileName, className = "" }: PdfDocumentViewerProps) {
  const t = useTranslations("circulars");
  const [loadFailed, setLoadFailed] = useState(false);

  return (
    <div className={`relative flex size-full flex-col overflow-hidden bg-background ${className}`}>
      <div className="flex shrink-0 items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
        <span className="truncate font-medium">{fileName}</span>
        <div className="flex items-center gap-1.5">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={t("openAttachment")}
            className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
          >
            <ExternalLinkIcon className="size-3.5" />
          </a>
          <a
            href={url}
            download={fileName}
            title={t("download")}
            className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
          >
            <DownloadIcon className="size-3.5" />
          </a>
        </div>
      </div>

      <div className="relative flex-1">
        <iframe
          src={`${url}#toolbar=1&navpanes=0`}
          title={fileName}
          onError={() => setLoadFailed(true)}
          className="size-full border-0 bg-background"
        />

        {loadFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background p-6 text-center">
            <p className="text-sm font-medium text-foreground">{fileName}</p>
            <div className="flex items-center gap-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm", className: "gap-2" })}
              >
                <ExternalLinkIcon className="size-4" />
                <span>{t("openAttachment")}</span>
              </a>
              <a
                href={url}
                download={fileName}
                className={buttonVariants({ size: "sm", className: "gap-2" })}
              >
                <DownloadIcon className="size-4" />
                <span>{t("download")}</span>
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
