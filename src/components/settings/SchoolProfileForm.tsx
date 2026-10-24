"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateSchoolAction } from "@/actions/settings/updateSchoolAction";
import type { SchoolFullDetails } from "@/lib/school/getSchoolFullDetails";
import { SchoolIdentityFields } from "./SchoolIdentityFields";
import { SchoolLeadershipFields } from "./SchoolLeadershipFields";
import { SchoolContactFields } from "./SchoolContactFields";
import { SchoolLogoFields } from "./SchoolLogoFields";
import { SchoolNarrativeFields } from "./SchoolNarrativeFields";

export function SchoolProfileForm({
  school,
  canManage,
}: {
  school: SchoolFullDetails;
  canManage: boolean;
}) {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await updateSchoolAction(formData);
      if (res.success) {
        toast.success(tCommon("saved"));
      } else {
        toast.error(res.error ?? tCommon("error"));
      }
    });
  };

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SchoolIdentityFields school={school} canManage={canManage} />
        <SchoolLeadershipFields school={school} canManage={canManage} />
        <SchoolContactFields school={school} canManage={canManage} />
        <SchoolLogoFields logoPath={school.logo_path} canManage={canManage} />
        <SchoolNarrativeFields
          visionAr={school.vision_ar ?? school.vision ?? ""}
          visionEn={school.vision_en ?? ""}
          missionAr={school.mission_ar ?? school.mission ?? ""}
          missionEn={school.mission_en ?? ""}
          disabled={!canManage}
        />
      </div>

      {canManage && (
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isPending} className="gap-2">
            <SaveIcon className="size-4" />
            <span>{t("saveSchool")}</span>
          </Button>
        </div>
      )}
    </form>
  );
}
