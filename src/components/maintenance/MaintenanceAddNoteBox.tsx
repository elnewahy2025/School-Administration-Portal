"use client";

import { useTransition, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addMaintenanceNoteAction } from "@/actions/maintenance/addMaintenanceNoteAction";

export function MaintenanceAddNoteBox({ requestId }: { requestId: string }) {
  const t = useTranslations("maintenance.actions");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await addMaintenanceNoteAction(formData);
      if (res.success) {
        toast.success(tCommon("saved"));
        formRef.current?.reset();
      } else {
        toast.error(res.error || tCommon("error"));
      }
    });
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-xs"
    >
      <input type="hidden" name="request_id" value={requestId} />
      <Textarea
        name="note"
        required
        rows={3}
        placeholder={t("notePlaceholder")}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isPending} className="gap-1.5">
          <SendIcon className="size-3.5 rtl:rotate-180" />
          <span>{isPending ? tCommon("loading") : t("postNote")}</span>
        </Button>
      </div>
    </form>
  );
}
