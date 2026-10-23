"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Trash2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AchievementCategoryBadge } from "./AchievementCategoryBadge";
import { AchievementDetailMetaGrid } from "./AchievementDetailMetaGrid";
import { deleteAchievementAction } from "@/actions/achievements/deleteAchievementAction";
import type { SchoolAchievementRow } from "@/lib/achievements/types";

export function AchievementDetailDialog({
  achievement,
  canManage,
  onClose,
}: {
  achievement: SchoolAchievementRow | null;
  canManage: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("achievements");
  const [isPending, startTransition] = useTransition();

  if (!achievement) return null;

  const handleDelete = () => {
    if (!confirm(`${t("delete")}?`)) return;
    startTransition(async () => {
      await deleteAchievementAction(achievement.id);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-xl space-y-5 overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <AchievementCategoryBadge category={achievement.category} />
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {achievement.visibility === "public" ? t("public") : t("internal")}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{achievement.title_ar}</h2>
            {achievement.title_en && (
              <p className="mt-0.5 text-sm text-muted-foreground">{achievement.title_en}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <XIcon className="size-5" />
          </Button>
        </div>

        <AchievementDetailMetaGrid achievement={achievement} />

        {achievement.description && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {t("description")}
            </h4>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {achievement.description}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-4">
          {canManage ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
              className="gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20"
            >
              <Trash2Icon className="size-4" />
              <span>{t("delete")}</span>
            </Button>
          ) : (
            <div />
          )}
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
