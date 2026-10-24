import { setRequestLocale } from "next-intl/server";
import { getPublicSchoolProfile } from "@/lib/school/getPublicSchoolProfile";
import { getPublicCalendarEvents } from "@/lib/calendar/getPublicCalendarEvents";
import { PublicHero } from "@/components/public/PublicHero";
import { PublicAboutSection } from "@/components/public/PublicAboutSection";
import { PublicEventsSection } from "@/components/public/PublicEventsSection";
import { PublicFooter } from "@/components/public/PublicFooter";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const school = await getPublicSchoolProfile();
  const events = await getPublicCalendarEvents(school?.id);

  return (
    <main className="flex min-h-screen flex-col justify-between bg-background text-foreground">
      <div>
        <PublicHero school={school} />
        <PublicAboutSection school={school} />
        <PublicEventsSection events={events} />
      </div>
      <PublicFooter school={school} />
    </main>
  );
}
