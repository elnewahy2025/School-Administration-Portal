"use client";

import { useTranslations } from "next-intl";
import { BellRingIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CircularRemindFooter({
  isPending,
  onClose,
}: {
  isPending: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("circulars");
  const tCommon = useTranslations("common");

  return (
    <div className="flex items-center justify-end gap-2.5 pt-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClose}
        disabled={isPending}
      >
        {tCommon("cancel")}
      </Button>
      <Button
        type="submit"
        size="sm"
        disabled={isPending}
        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
      >
        {isPending ? (
          <>
            <Loader2Icon className="size-3.5 animate-spin" />
            <span>{t("sendingReminder")}</span>
          </>
        ) : (
          <>
            <BellRingIcon className="size-3.5" />
            <span>{t("sendReminder")}</span>
          </>
        )}
      </Button>
    </div>
  );
}
