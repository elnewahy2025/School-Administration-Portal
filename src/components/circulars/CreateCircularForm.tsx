"use client";

import { useTranslations } from "next-intl";
import { PlusIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PANEL } from "@/components/ui/diamond-card-styles";
import { DepartmentTargetPicker } from "./DepartmentTargetPicker";
import { CircularMetaFields } from "./CircularMetaFields";
import { CircularFileUpload } from "./CircularFileUpload";
import { useCreateCircularForm } from "./useCreateCircularForm";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";

export function CreateCircularForm({ departments }: { departments: DepartmentRow[] }) {
  const t = useTranslations("circulars");
  const { isBusy, files, setFiles, handleSubmit } = useCreateCircularForm();

  return (
    <form action={handleSubmit} className={`${PANEL} flex flex-col gap-6 p-6 sm:p-8`}>
      <div className="space-y-2">
        <Label htmlFor="title">{t("circularTitle")}</Label>
        <Input id="title" name="title" required placeholder={t("titlePlaceholder")} />
      </div>

      <CircularMetaFields />

      <div className="space-y-2">
        <Label htmlFor="body">{t("circularBody")}</Label>
        <Textarea id="body" name="body" required rows={6} placeholder={t("bodyPlaceholder")} />
      </div>

      <DepartmentTargetPicker departments={departments} label={t("targetedDepartments")} />

      <CircularFileUpload files={files} onFilesChange={setFiles} disabled={isBusy} />

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isBusy} className="gap-2">
          {isBusy ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <PlusIcon className="size-4" />
          )}
          <span>{t("newCircular")}</span>
        </Button>
      </div>
    </form>
  );
}
