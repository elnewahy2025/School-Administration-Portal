import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { getSchoolAuditLogs } from "@/lib/school/getSchoolAuditLogs";
import { AuditLogList } from "@/components/settings/AuditLogList";

export default async function AuditSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("settings");

  const profile = await getCurrentProfile();
  const isOwner = profile?.id ? await isPlatformOwner(profile.id) : false;

  if (!isOwner) {
    redirect({ href: "/settings", locale });
  }

  const logs = await getSchoolAuditLogs(profile?.school_id).catch(() => []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("audit")}</h2>
        <p className="text-sm text-muted-foreground">{t("auditDesc")}</p>
      </div>

      <AuditLogList logs={logs} />
    </div>
  );
}
