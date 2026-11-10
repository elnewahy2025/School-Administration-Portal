"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2Icon, AlertCircleIcon, DownloadIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export interface WordDocumentViewerProps {
  url: string;
  fileName: string;
  className?: string;
}

export function WordDocumentViewer({ url, fileName, className = "" }: WordDocumentViewerProps) {
  const t = useTranslations("circulars");
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadDocx() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch document (${response.status})`);
        }
        const buffer = await response.arrayBuffer();

        if (isCancelled || !containerRef.current) return;

        containerRef.current.innerHTML = "";
        const { renderAsync } = await import("docx-preview");

        await renderAsync(buffer, containerRef.current, undefined, {
          className: "docx-viewer-content",
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: true,
        });

        if (!isCancelled) {
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "Error rendering Word document");
          setLoading(false);
        }
      }
    }

    loadDocx();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  return (
    <div className={`relative flex size-full flex-col overflow-hidden bg-muted/20 ${className}`}>
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
      ) : (
        <div
          ref={containerRef}
          dir="rtl"
          className="size-full flex-1 overflow-y-auto p-4 text-foreground sm:p-6 [&_.docx-viewer-content]:mx-auto [&_.docx-viewer-content]:max-w-4xl [&_.docx-viewer-content]:rounded-lg [&_.docx-viewer-content]:bg-background [&_.docx-viewer-content]:p-8 [&_.docx-viewer-content]:shadow-md"
        />
      )}
    </div>
  );
}
