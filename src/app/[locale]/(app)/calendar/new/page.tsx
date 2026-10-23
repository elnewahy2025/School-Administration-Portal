import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { CreateCalendarEventForm } from "@/components/calendar/CreateCalendarEventForm";

export default async function NewCalendarEventPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    redirect(`/${locale}/login`);
  }

  const canManage = await hasPermission("calendar.manage", profile.school_id).catch(() => false);
  if (!canManage) {
    redirect(`/${locale}/calendar`);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <CreateCalendarEventForm />
    </div>
  );
}
