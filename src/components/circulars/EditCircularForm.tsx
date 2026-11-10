"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PANEL } from "@/components/ui/diamond-card-styles";
import { DepartmentTargetPicker } from "./DepartmentTargetPicker";
import { CircularFileUpload } from "./CircularFileUpload";
import { CircularAttachmentsList } from "./CircularAttachmentsList";
import { EditCircularFieldsGrid } from "./EditCircularFieldsGrid";
import { EditCircularActions } from "./EditCircularActions";
import { useEditCircularForm } from "./useEditCircularForm";
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
  const { isBusy, files, setFiles, handleSubmit, router } = useEditCircularForm(circular);

  const initialDeptIds = circular.targets
    .map((t) => t.department_id)
    .filter((id): id is string => Boolean(id));

  return (
    <form action={handleSubmit} className={`${PANEL} flex flex-col gap-6 p-6 sm:p-8`}>
      <div className="space-y-2">
        <Label htmlFor="title">{t("circularTitle")}</Label>
        <Input id="title" name="title" required defaultValue={circular.title} />
      </div>

      <EditCircularFieldsGrid
        priority={circular.priority}
        visibility={circular.visibility}
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

      <CircularFileUpload files={files} onFilesChange={setFiles} disabled={isBusy} />

      <EditCircularActions
        isPending={isBusy}
        onCancel={() => router.push(`/circulars/${circular.id}`)}
      />
    </form>
  );
}
