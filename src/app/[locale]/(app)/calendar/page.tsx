import { setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { getSchoolCalendarEvents } from "@/lib/calendar/getSchoolCalendarEvents";
import { CalendarHub } from "@/components/calendar/CalendarHub";

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await getCurrentProfile();
  const events = await getSchoolCalendarEvents(profile?.school_id);
  const canManage = profile?.school_id
    ? await hasPermission("calendar.manage", profile.school_id).catch(() => false)
    : false;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <CalendarHub events={events} canManage={canManage} />
    </div>
  );
}
