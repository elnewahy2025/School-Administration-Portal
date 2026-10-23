import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n";
import {
  SchoolIcon,
  Building2Icon,
  MapPinIcon,
  UsersIcon,
  ShieldAlertIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("settings");

  const cards = [
    {
      href: "/settings/school",
      title: t("school"),
      desc: t("schoolDesc"),
      icon: SchoolIcon,
    },
    {
      href: "/settings/departments",
      title: t("departments"),
      desc: t("departmentsDesc"),
      icon: Building2Icon,
    },
    {
      href: "/settings/locations",
      title: t("locations"),
      desc: t("locationsDesc"),
      icon: MapPinIcon,
    },
    {
      href: "/settings/users",
      title: t("users"),
      desc: t("usersDesc"),
      icon: UsersIcon,
    },
    {
      href: "/settings/audit",
      title: t("audit"),
      desc: t("auditDesc"),
      icon: ShieldAlertIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.href}
            href={card.href}
            className="group transition-transform hover:-translate-y-0.5"
          >
            <Card className="h-full border border-border transition-colors group-hover:border-primary/50 group-hover:bg-accent/30">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{card.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col justify-between gap-4">
                <CardDescription className="text-xs leading-relaxed">{card.desc}</CardDescription>
                <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <span>{card.title}</span>
                  <ArrowRightIcon className="size-3.5 rtl:rotate-180" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
