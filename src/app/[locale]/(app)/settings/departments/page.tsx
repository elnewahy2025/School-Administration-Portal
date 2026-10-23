import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getSchoolDepartments } from "@/lib/school/getSchoolDepartments";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { DepartmentList } from "@/components/settings/DepartmentList";
import { CreateDepartmentForm } from "@/components/settings/CreateDepartmentForm";

export default async function DepartmentsSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("settings");

  const profile = await getCurrentProfile();
  const departments = await getSchoolDepartments(profile?.school_id);
  const canManage = profile?.school_id
    ? await hasPermission("settings.school.update", profile.school_id).catch(() => false)
    : false;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("departments")}</h2>
        <p className="text-sm text-muted-foreground">{t("departmentsDesc")}</p>
      </div>

      {canManage && <CreateDepartmentForm />}

      <DepartmentList departments={departments} canManage={canManage} />
    </div>
  );
}
