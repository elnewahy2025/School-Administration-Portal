"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AchievementFormFields } from "./AchievementFormFields";
import { updateAchievementAction } from "@/actions/achievements/updateAchievementAction";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";
import type { SchoolAchievementRow } from "@/lib/achievements/types";

export function EditAchievementForm({
  achievement,
  departments,
  onSuccess,
  onCancel,
}: {
  achievement: SchoolAchievementRow;
  departments: DepartmentRow[];
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("achievements");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await updateAchievementAction(achievement.id, formData);
      if (res.success) {
        toast.success(tCommon("saved"));
        onSuccess();
      } else {
        toast.error(res.error ?? tCommon("error"));
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-5">
      <AchievementFormFields departments={departments} defaultValues={achievement} />
      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          {tCommon("cancel")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
