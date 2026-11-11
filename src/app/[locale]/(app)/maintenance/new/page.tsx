import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { resolveSchoolForCaller } from "@/lib/school/resolveSchoolForCaller";
import { getSchoolLocations } from "@/lib/school/getSchoolLocations";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { CreateMaintenanceForm } from "@/components/maintenance/CreateMaintenanceForm";

export default async function NewMaintenancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await getCurrentProfile();
  if (!profile) {
    redirect(`/${locale}/login`);
  }

  const schoolId = await resolveSchoolForCaller(profile);
  if (!schoolId) {
    redirect(`/${locale}/login`);
  }

  const isOwner = await isPlatformOwner(profile.id);
  const canCreate =
    isOwner ||
    (await hasPermission(
      "maintenance.create",
      schoolId,
      profile.department_id,
    ).catch(() => false));
  if (!canCreate) {
    redirect(`/${locale}/maintenance`);
  }

  const allLocations = await getSchoolLocations(schoolId);
  const activeLocations = allLocations.filter((l) => l.is_active);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <CreateMaintenanceForm locations={activeLocations} />
    </div>
  );
}
