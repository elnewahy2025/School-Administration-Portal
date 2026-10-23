"use client";

import { useTranslations } from "next-intl";
import { DownloadIcon, Trash2Icon, Loader2Icon, ExternalLinkIcon, PrinterIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { printAttachment } from "@/lib/circulars/printAttachment";

export function CircularAttachmentActions({
  publicUrl,
  fileName,
  attachmentId,
  canManage,
  isPending,
  onDelete,
}: {
  publicUrl?: string;
  fileName: string;
  attachmentId: string;
  canManage: boolean;
  isPending: boolean;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations("circulars");

  return (
    <div className="flex items-center gap-1">
      {publicUrl ? (
        <>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            title={t("openAttachment")}
            aria-label={t("openAttachment")}
          >
            <ExternalLinkIcon className="size-4" />
          </a>

          <a
            href={publicUrl}
            download={fileName}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            title={t("downloadAttachment")}
            aria-label={t("downloadAttachment")}
          >
            <DownloadIcon className="size-4" />
          </a>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => printAttachment(publicUrl)}
            title={t("printAttachment")}
            aria-label={t("printAttachment")}
          >
            <PrinterIcon className="size-4" />
          </Button>
        </>
      ) : null}

      {canManage ? (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="text-destructive hover:bg-destructive/10"
          disabled={isPending}
          onClick={() => onDelete(attachmentId)}
          title={t("deleteAttachment")}
          aria-label={t("deleteAttachment")}
        >
          {isPending ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <Trash2Icon className="size-3.5" />
          )}
        </Button>
      ) : null}
    </div>
  );
}
