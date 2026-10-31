import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { resolveSchoolForCaller } from "@/lib/school/resolveSchoolForCaller";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
import { resolveLayoutNavigationAccess } from "@/lib/auth/resolveLayoutNavigationAccess";
import { SchoolDocumentView } from "@/components/documents/SchoolDocumentView";
import type { SchoolDocumentSlug } from "@/components/documents/SchoolDocumentView";

const VALID_SLUGS = ["operational-plan", "committees-guide", "counseling-guide"] as const;
type DocumentSlug = (typeof VALID_SLUGS)[number];

export default async function SchoolDocumentPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!VALID_SLUGS.includes(slug as DocumentSlug)) {
    notFound();
  }

  const profile = await getCurrentProfile();
  if (!profile || !profile.is_active) {
    redirect({ href: "/login", locale });
    return null;
  }

  const schoolId = await resolveSchoolForCaller(profile);
  const [isOwner, permissions] = await Promise.all([
    isPlatformOwner(profile.id),
    getEffectivePermissions(schoolId).catch(() => []),
  ]);

  const { canViewDocuments } = resolveLayoutNavigationAccess(
    isOwner,
    permissions,
    Boolean(profile.school_id),
  );

  if (!canViewDocuments) {
    redirect({ href: "/dashboard", locale });
    return null;
  }

  const tHome = await getTranslations({ locale, namespace: "home" });

  const documentConfig = {
    "operational-plan": {
      title: tHome("docOperationalPlanTitle"),
      description: tHome("docOperationalPlanDesc"),
    },
    "committees-guide": {
      title: tHome("docCommitteesGuideTitle"),
      description: tHome("docCommitteesGuideDesc"),
    },
    "counseling-guide": {
      title: tHome("docCounselingGuideTitle"),
      description: tHome("docCounselingGuideDesc"),
    },
  }[slug as DocumentSlug];

  return (
    <SchoolDocumentView
      slug={slug as SchoolDocumentSlug}
      title={documentConfig.title}
      description={documentConfig.description}
    />
  );
}
