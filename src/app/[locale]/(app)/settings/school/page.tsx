import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getSchoolFullDetails } from "@/lib/school/getSchoolFullDetails";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
import { SchoolProfileForm } from "@/components/settings/SchoolProfileForm";

export default async function SchoolSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("settings");
  const tCommon = await getTranslations("common");

  const profile = await getCurrentProfile();
  const [school, perms, hasPerm] = await Promise.all([
    getSchoolFullDetails(profile?.school_id),
    getEffectivePermissions().catch((): string[] => []),
    profile?.school_id
      ? hasPermission("settings.school.update", profile.school_id).catch(() => false)
      : false,
  ]);

  const isOwner = perms.includes("settings.platform.update") || perms.includes("roles.manage");
  const canManage = isOwner || hasPerm;

  if (!school) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
        {tCommon("noData")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("school")}</h2>
        <p className="text-sm text-muted-foreground">{t("schoolDesc")}</p>
      </div>

      <SchoolProfileForm school={school} canManage={canManage} />
    </div>
  );
}
