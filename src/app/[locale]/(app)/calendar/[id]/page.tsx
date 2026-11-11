import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { resolveSchoolForCaller } from "@/lib/school/resolveSchoolForCaller";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { getCalendarEventById } from "@/lib/calendar/getCalendarEventById";
import { CalendarEventDetailCard } from "@/components/calendar/CalendarEventDetailCard";

export default async function CalendarEventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
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
  const event = await getCalendarEventById(id);
  if (!event || (!isOwner && event.school_id !== schoolId)) {
    notFound();
  }

  const hasManagePerm = isOwner
    ? true
    : await hasPermission("calendar.manage", schoolId, profile.department_id).catch(() => false);

  const canManage = isOwner || hasManagePerm;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <Link href={`/${locale}/calendar`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeftIcon className="size-4 rtl:rotate-180" />
            <span>Back to Calendar</span>
          </Button>
        </Link>
      </div>

      <CalendarEventDetailCard event={event} canManage={canManage} />
    </div>
  );
}
