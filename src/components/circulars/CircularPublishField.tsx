"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";

export function CircularPublishField({
  defaultChecked = true,
}: {
  defaultChecked?: boolean;
} = {}) {
  const t = useTranslations("circulars");

  return (
    <div className="rounded-lg border border-border/80 bg-muted/40 p-4">
      <div className="flex items-start gap-3">
        <input
          id="publish_immediately"
          name="publish_immediately"
          type="checkbox"
          defaultChecked={defaultChecked}
          className="mt-1 size-4 rounded border-input accent-primary"
        />
        <div className="space-y-0.5">
          <Label htmlFor="publish_immediately" className="cursor-pointer text-sm font-semibold">
            {t("publishImmediately")}
          </Label>
          <p className="text-xs text-muted-foreground">{t("publishImmediatelyHelp")}</p>
        </div>
      </div>
    </div>
  );
}
