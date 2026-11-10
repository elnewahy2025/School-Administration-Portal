import { setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getSchoolMaintenanceRequests } from "@/lib/maintenance/getSchoolMaintenanceRequests";
import { resolveMaintenanceListPermissions } from "@/lib/maintenance/resolveMaintenanceListPermissions";
import { getSchoolLocations } from "@/lib/school";
import { MaintenanceList } from "@/components/maintenance/MaintenanceList";

export default async function MaintenancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await getCurrentProfile();
  const [tickets, permissions, locations] = await Promise.all([
    getSchoolMaintenanceRequests(profile?.school_id),
    resolveMaintenanceListPermissions(profile),
    getSchoolLocations(profile?.school_id),
  ]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <MaintenanceList
        tickets={tickets}
        canCreate={permissions.canCreate}
        locations={locations}
        currentUserId={profile?.id}
        canManageAll={permissions.canManageAll}
      />
    </div>
  );
}
