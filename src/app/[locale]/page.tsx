import { setRequestLocale } from "next-intl/server";
import { getPublicSchoolProfile } from "@/lib/school/getPublicSchoolProfile";
import { getPublicCalendarEvents } from "@/lib/calendar/getPublicCalendarEvents";
import { PublicHero } from "@/components/public/PublicHero";
import { PublicFeaturesSection } from "@/components/public/PublicFeaturesSection";
import { PublicAboutSection } from "@/components/public/PublicAboutSection";
import { PublicEventsSection } from "@/components/public/PublicEventsSection";
import { PublicFooter } from "@/components/public/PublicFooter";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const school = await getPublicSchoolProfile();
  const events = await getPublicCalendarEvents(school?.id);

  return (
    <div className="flex min-h-screen flex-col justify-between scroll-smooth bg-background text-foreground">
      <main className="flex-1">
        <PublicHero school={school} />
        <PublicFeaturesSection />
        <PublicAboutSection school={school} />
        <PublicEventsSection events={events} />
      </main>
      <PublicFooter />
    </div>
  );
}
