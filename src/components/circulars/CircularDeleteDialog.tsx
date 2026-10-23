"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Trash2Icon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCircularAction } from "@/actions/circulars/deleteCircularAction";

export function CircularDeleteDialog({
  circularId,
  open,
  onOpenChange,
  onDeleted,
}: {
  circularId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}) {
  const t = useTranslations("circulars");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  if (!open) return null;

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteCircularAction(circularId);
      if (res.success) {
        toast.success(t("deleteSuccess"));
        onOpenChange(false);
        onDeleted?.();
      } else {
        toast.error(res.error || t("deleteFailed"));
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center gap-3 text-destructive">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <Trash2Icon className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">{t("confirmDeleteTitle")}</h3>
            <p className="text-xs text-muted-foreground">{t("confirmDeleteDesc")}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
            className="gap-2"
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <Trash2Icon className="size-4" />
            )}
            <span>{tCommon("delete")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
