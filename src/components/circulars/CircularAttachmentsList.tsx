"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { FileTextIcon, DownloadIcon, Trash2Icon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCircularAttachmentAction } from "@/actions/circulars/deleteCircularAttachmentAction";
import type { CircularAttachmentRow } from "@/lib/circulars/types";

export function CircularAttachmentsList({
  attachments,
  circularId,
  canManage,
}: {
  attachments: CircularAttachmentRow[];
  circularId: string;
  canManage: boolean;
}) {
  const t = useTranslations("circulars");
  const [isPending, startTransition] = useTransition();

  if (!attachments || attachments.length === 0) return null;

  const handleDelete = (attachmentId: string) => {
    startTransition(async () => {
      const res = await deleteCircularAttachmentAction(attachmentId, circularId);
      if (res.success) {
        toast.success(t("attachmentDeleted"));
      } else {
        toast.error(res.error || "Failed to delete attachment");
      }
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase">
        {t("attachments")} ({attachments.length})
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {attachments.map((att) => {
          const fileName = att.path.split("/").pop() ?? "document";
          const sizeKb = att.size_bytes ? (att.size_bytes / 1024).toFixed(1) : null;

          return (
            <div
              key={att.id}
              className="flex items-center justify-between rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/40"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FileTextIcon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">{fileName}</p>
                  {sizeKb ? (
                    <span className="text-[11px] text-muted-foreground">{sizeKb} KB</span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {att.public_url ? (
                  <a href={att.public_url} target="_blank" rel="noopener noreferrer" download>
                    <Button variant="ghost" size="icon" className="size-8" title={t("download")}>
                      <DownloadIcon className="size-4" />
                    </Button>
                  </a>
                ) : null}
                {canManage ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:bg-destructive/10"
                    disabled={isPending}
                    onClick={() => handleDelete(att.id)}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
