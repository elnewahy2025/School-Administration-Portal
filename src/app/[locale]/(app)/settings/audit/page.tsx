import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getSchoolAuditLogs } from "@/lib/school/getSchoolAuditLogs";
import { hasPermission } from "@/lib/rbac/hasPermission";
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
  const isOwner =
    (await hasPermission("settings.platform.update").catch(() => false)) ||
    (await hasPermission("roles.manage").catch(() => false));
  const hasPerm = profile?.school_id
    ? await hasPermission("audit.view", profile.school_id).catch(() => false)
    : false;
  const canView = isOwner || hasPerm;

  if (!canView) {
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
