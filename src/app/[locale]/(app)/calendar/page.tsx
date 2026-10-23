import { setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { getSchoolCalendarEvents } from "@/lib/calendar/getSchoolCalendarEvents";
import { getSchoolAchievements } from "@/lib/achievements/getSchoolAchievements";
import { getSchoolDepartments } from "@/lib/school/getSchoolDepartments";
import { CalendarHub } from "@/components/calendar/CalendarHub";

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await getCurrentProfile();
  const schoolId = profile?.school_id;

  const [events, achievements, departments, canManage] = await Promise.all([
    getSchoolCalendarEvents(schoolId),
    getSchoolAchievements(schoolId),
    getSchoolDepartments(schoolId),
    schoolId ? hasPermission("calendar.manage", schoolId).catch(() => false) : false,
  ]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <CalendarHub
        events={events}
        achievements={achievements}
        departments={departments}
        canManage={canManage}
      />
    </div>
  );
}
