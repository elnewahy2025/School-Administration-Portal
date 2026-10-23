import { setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getSchoolMaintenanceRequests } from "@/lib/maintenance/getSchoolMaintenanceRequests";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { MaintenanceList } from "@/components/maintenance/MaintenanceList";

export default async function MaintenancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await getCurrentProfile();
  const tickets = await getSchoolMaintenanceRequests(profile?.school_id);
  const canCreate = profile?.school_id
    ? await hasPermission("maintenance.create", profile.school_id).catch(() => false)
    : false;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <MaintenanceList tickets={tickets} canCreate={canCreate} />
    </div>
  );
}
