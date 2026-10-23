import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getSchoolCirculars } from "@/lib/circulars/getSchoolCirculars";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { getSchoolDepartments } from "@/lib/school/getSchoolDepartments";
import { CircularList } from "@/components/circulars";

export default async function CircularsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("circulars");

  const profile = await getCurrentProfile();
  const [circulars, departments, isOwner, hasPerm] = await Promise.all([
    getSchoolCirculars(profile?.school_id),
    getSchoolDepartments(profile?.school_id),
    hasPermission("settings.platform.update")
      .catch(() => false)
      .then(async (v) => v || (await hasPermission("roles.manage").catch(() => false))),
    profile?.school_id
      ? hasPermission("circular.create", profile.school_id).catch(() => false)
      : false,
  ]);
  const canCreate = isOwner || hasPerm;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        {canCreate ? (
          <Link href="/circulars/new">
            <Button className="gap-2">
              <PlusIcon className="size-4" />
              <span>{t("newCircular")}</span>
            </Button>
          </Link>
        ) : null}
      </div>

      <CircularList circulars={circulars} departments={departments} canManage={canCreate} />
    </div>
  );
}
