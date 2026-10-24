import { setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
import { getUserRoleKey } from "@/lib/rbac/getUserRoleKey";
import { getSchoolCalendarEvents } from "@/lib/calendar/getSchoolCalendarEvents";
import { getSchoolAchievements } from "@/lib/achievements/getSchoolAchievements";
import { getSchoolDepartments } from "@/lib/school/getSchoolDepartments";
import { getSchoolCirculars } from "@/lib/circulars/getSchoolCirculars";
import { CalendarHub } from "@/components/calendar/CalendarHub";

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await getCurrentProfile();
  const schoolId = profile?.school_id;

  const [permissions, hasManagePerm, events, achievements, departments, roleKey, circulars] =
    await Promise.all([
      getEffectivePermissions().catch((): string[] => []),
      schoolId ? hasPermission("calendar.manage", schoolId).catch(() => false) : false,
      getSchoolCalendarEvents(schoolId),
      getSchoolAchievements(schoolId),
      getSchoolDepartments(schoolId),
      getUserRoleKey(profile?.id, schoolId),
      getSchoolCirculars(schoolId).catch(() => []),
    ]);

  const isOwner =
    permissions.includes("settings.platform.update") || permissions.includes("roles.manage");
  const canManageEvents = isOwner || hasManagePerm;
  const canManageAchievements = canManageEvents || roleKey === "department_head";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <CalendarHub
        events={events}
        circulars={circulars}
        achievements={achievements}
        departments={departments}
        canManageEvents={canManageEvents}
        canManageAchievements={canManageAchievements}
      />
    </div>
  );
}
