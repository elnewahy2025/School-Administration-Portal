"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { deleteCircularAttachmentAction } from "@/actions/circulars/deleteCircularAttachmentAction";
import { CircularAttachmentItem } from "./CircularAttachmentItem";
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
        {attachments.map((att) => (
          <CircularAttachmentItem
            key={att.id}
            attachment={att}
            canManage={canManage}
            isPending={isPending}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
