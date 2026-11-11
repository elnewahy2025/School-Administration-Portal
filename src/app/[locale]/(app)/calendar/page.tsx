import { setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isCurrentUserPlatformOwner } from "@/lib/auth/isCurrentUserPlatformOwner";
import { resolveSchoolForCaller } from "@/lib/school/resolveSchoolForCaller";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { getSchoolCalendarEvents } from "@/lib/calendar/getSchoolCalendarEvents";
import { CalendarHub } from "@/components/calendar/CalendarHub";

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await getCurrentProfile();
  const schoolId = await resolveSchoolForCaller(profile);

  const [hasManagePerm, events, isOwner] = await Promise.all([
    schoolId
      ? hasPermission("calendar.manage", schoolId, profile?.department_id).catch(() => false)
      : false,
    getSchoolCalendarEvents(schoolId),
    isCurrentUserPlatformOwner(profile?.id),
  ]);

  const canManageEvents = isOwner || hasManagePerm;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <CalendarHub events={events} canManageEvents={canManageEvents} />
    </div>
  );
}
