import { setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
import { getSchoolCalendarEvents } from "@/lib/calendar/getSchoolCalendarEvents";
import { getSchoolCirculars } from "@/lib/circulars/getSchoolCirculars";
import { CalendarHub } from "@/components/calendar/CalendarHub";

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await getCurrentProfile();
  const schoolId = profile?.school_id;

  const [permissions, hasManagePerm, events, circulars] = await Promise.all([
    getEffectivePermissions().catch((): string[] => []),
    schoolId ? hasPermission("calendar.manage", schoolId).catch(() => false) : false,
    getSchoolCalendarEvents(schoolId),
    getSchoolCirculars(schoolId).catch(() => []),
  ]);

  const isOwner =
    permissions.includes("settings.platform.update") || permissions.includes("roles.manage");
  const canManageEvents = isOwner || hasManagePerm;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <CalendarHub events={events} circulars={circulars} canManageEvents={canManageEvents} />
    </div>
  );
}
