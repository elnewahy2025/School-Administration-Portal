"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCircularAction } from "@/actions/circulars/createCircularAction";
import { DepartmentTargetPicker } from "./DepartmentTargetPicker";
import { CircularMetaFields } from "./CircularMetaFields";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";

export function CreateCircularForm({ departments }: { departments: DepartmentRow[] }) {
  const t = useTranslations("circulars");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await createCircularAction(formData);
      if (res.success && res.circularId) {
        toast.success(tCommon("saved"));
        router.push(`/circulars/${res.circularId}`);
      } else {
        toast.error(res.error ?? "Failed to create circular");
      }
    });
  };

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="title">{t("circularTitle")}</Label>
        <Input id="title" name="title" required placeholder="عنوان التعميم..." />
      </div>

      <CircularMetaFields />

      <div className="space-y-2">
        <Label htmlFor="body">{t("circularBody")}</Label>
        <Textarea
          id="body"
          name="body"
          required
          rows={6}
          placeholder="تفاصيل التعميم والتعليمات..."
        />
      </div>

      <DepartmentTargetPicker departments={departments} label={t("targetedDepartments")} />

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending} className="gap-2">
          <PlusIcon className="size-4" />
          <span>{t("newCircular")}</span>
        </Button>
      </div>
    </form>
  );
}
