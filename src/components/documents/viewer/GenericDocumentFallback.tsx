"use client";

import { useTranslations } from "next-intl";
import { FileIcon, DownloadIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export interface GenericDocumentFallbackProps {
  url: string;
  fileName: string;
  className?: string;
}

export function GenericDocumentFallback({
  url,
  fileName,
  className = "",
}: GenericDocumentFallbackProps) {
  const t = useTranslations("circulars");

  return (
    <div
      className={`flex size-full flex-col items-center justify-center gap-4 bg-muted/10 p-8 text-center ${className}`}
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <FileIcon className="size-8" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{fileName}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("documentPreview")}</p>
      </div>
      <a
        href={url}
        download={fileName}
        className={buttonVariants({ size: "sm", className: "gap-2" })}
      >
        <DownloadIcon className="size-4" />
        <span>{t("download")}</span>
      </a>
    </div>
  );
}
