import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getSchoolDepartments } from "@/lib/school/getSchoolDepartments";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { CreateCircularForm } from "@/components/circulars";

export default async function NewCircularPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("circulars");

  const profile = await getCurrentProfile();
  const canCreate = profile?.school_id
    ? await hasPermission("circular.create", profile.school_id).catch(() => false)
    : false;

  if (!canCreate) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-center text-sm text-destructive">
        Unauthorized
      </div>
    );
  }

  const departments = await getSchoolDepartments(profile?.school_id);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/circulars">
          <Button variant="ghost" size="icon" aria-label={t("backToList")}>
            <ArrowLeftIcon className="size-4 rtl:rotate-180" />
          </Button>
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("newCircular")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <CreateCircularForm departments={departments} />
    </div>
  );
}
