import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { getCircularById } from "@/lib/circulars/getCircularById";
import { getSchoolDepartments } from "@/lib/school/getSchoolDepartments";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
import { EditCircularForm } from "@/components/circulars/EditCircularForm";

export default async function EditCircularPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("circulars");

  const profile = await getCurrentProfile();
  if (!profile) redirect(`/${locale}/login`);

  const [circular, departments, perms, isOwner] = await Promise.all([
    getCircularById(id),
    getSchoolDepartments(profile.school_id),
    getEffectivePermissions().catch((): string[] => []),
    isPlatformOwner(profile.id),
  ]);

  if (!circular) notFound();

  const canEdit =
    isOwner || perms.includes("circular.create") || perms.includes("circular.publish");
  if (!canEdit) redirect(`/${locale}/circulars/${id}`);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href={`/circulars/${circular.id}`}>
          <Button variant="ghost" size="icon" aria-label={t("backToList")}>
            <ArrowLeftIcon className="size-4 rtl:rotate-180" />
          </Button>
        </Link>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-foreground">{t("editCircular")}</h1>
          <span className="font-mono text-xs text-muted-foreground">{circular.ref_number}</span>
        </div>
      </div>

      <EditCircularForm circular={circular} departments={departments} />
    </div>
  );
}
