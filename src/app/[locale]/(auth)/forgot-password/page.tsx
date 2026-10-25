import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { getSessionUser } from "@/lib/auth/getSessionUser";
import { getCurrentSchool } from "@/lib/school/getCurrentSchool";
import { SchoolLogoAvatar } from "@/components/layout/SchoolLogoAvatar";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSessionUser();
  if (user) redirect({ href: "/dashboard", locale });

  const t = await getTranslations("auth");
  const school = await getCurrentSchool();
  const schoolName = school ? (locale === "ar" ? school.name_ar : school.name_en) : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <SchoolLogoAvatar school={school} className="size-16" iconClassName="size-8" />
        {schoolName && (
          <h2 className="max-w-sm text-lg font-bold whitespace-pre-line text-foreground">
            {schoolName}
          </h2>
        )}
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground">{t("forgotPasswordTitle")}</h1>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">{t("forgotPasswordDesc")}</p>
      </div>
      <ForgotPasswordForm />
    </main>
  );
}
