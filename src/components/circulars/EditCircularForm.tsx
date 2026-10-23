"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n";
import { toast } from "sonner";
import { SaveIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateCircularAction } from "@/actions/circulars/updateCircularAction";
import { DepartmentTargetPicker } from "./DepartmentTargetPicker";
import { CircularFileUpload } from "./CircularFileUpload";
import { CircularAttachmentsList } from "./CircularAttachmentsList";
import { EditCircularFieldsGrid } from "./EditCircularFieldsGrid";
import type { CircularDetail } from "@/lib/circulars/getCircularById";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";

export function EditCircularForm({
  circular,
  departments,
}: {
  circular: CircularDetail;
  departments: DepartmentRow[];
}) {
  const t = useTranslations("circulars");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await updateCircularAction(circular.id, formData);
      if (res.success) {
        toast.success(tCommon("saved"));
        router.push(`/circulars/${circular.id}`);
      } else {
        toast.error(res.error ?? "Failed to update circular");
      }
    });
  };

  const initialDeptIds = circular.targets
    .map((t) => t.department_id)
    .filter((id): id is string => Boolean(id));

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-xs"
    >
      <div className="space-y-2">
        <Label htmlFor="title">{t("circularTitle")}</Label>
        <Input id="title" name="title" required defaultValue={circular.title} />
      </div>

      <EditCircularFieldsGrid
        priority={circular.priority}
        status={circular.status}
        dueAt={circular.due_at}
      />

      <div className="space-y-2">
        <Label htmlFor="body">{t("circularBody")}</Label>
        <Textarea id="body" name="body" required rows={6} defaultValue={circular.body} />
      </div>

      <DepartmentTargetPicker
        departments={departments}
        initialSelectedIds={initialDeptIds}
        label={t("targetedDepartments")}
      />

      {circular.attachments && circular.attachments.length > 0 ? (
        <CircularAttachmentsList
          attachments={circular.attachments}
          circularId={circular.id}
          canManage={true}
        />
      ) : null}

      <CircularFileUpload />

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/circulars/${circular.id}`)}
          disabled={isPending}
        >
          {tCommon("cancel")}
        </Button>
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <SaveIcon className="size-4" />
          )}
          <span>{tCommon("save")}</span>
        </Button>
      </div>
    </form>
  );
}
