"use client";

import { FileTextIcon } from "lucide-react";
import { formatAttachmentFileName } from "@/lib/circulars/formatAttachmentFileName";
import { CircularAttachmentActions } from "./CircularAttachmentActions";
import type { CircularAttachmentRow } from "@/lib/circulars/types";

export function CircularAttachmentItem({
  attachment,
  canManage,
  isPending,
  onDelete,
}: {
  attachment: CircularAttachmentRow;
  canManage: boolean;
  isPending: boolean;
  onDelete: (id: string) => void;
}) {
  const fileName = formatAttachmentFileName(attachment.path);
  const sizeKb = attachment.size_bytes ? (attachment.size_bytes / 1024).toFixed(1) : null;

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/40">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <FileTextIcon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-foreground" title={fileName}>
            {fileName}
          </p>
          {sizeKb ? (
            <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">
              {sizeKb} KB
            </span>
          ) : null}
        </div>
      </div>

      <CircularAttachmentActions
        publicUrl={attachment.public_url}
        fileName={fileName}
        attachmentId={attachment.id}
        canManage={canManage}
        isPending={isPending}
        onDelete={onDelete}
      />
    </div>
  );
}
