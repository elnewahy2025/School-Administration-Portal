import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getSchoolLocations } from "@/lib/school/getSchoolLocations";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
import { LocationList } from "@/components/settings/LocationList";
import { CreateLocationForm } from "@/components/settings/CreateLocationForm";

export default async function LocationsSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("settings");

  const profile = await getCurrentProfile();
  const [locations, perms, hasPerm] = await Promise.all([
    getSchoolLocations(profile?.school_id),
    getEffectivePermissions().catch((): string[] => []),
    profile?.school_id
      ? hasPermission("settings.school.update", profile.school_id).catch(() => false)
      : false,
  ]);

  const isOwner = perms.includes("settings.platform.update") || perms.includes("roles.manage");
  const canManage = isOwner || hasPerm;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("locations")}</h2>
        <p className="text-sm text-muted-foreground">{t("locationsDesc")}</p>
      </div>

      {canManage && <CreateLocationForm />}

      <LocationList locations={locations} canManage={canManage} />
    </div>
  );
}
