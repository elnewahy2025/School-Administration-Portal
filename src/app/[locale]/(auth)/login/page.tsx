import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n";
import { LoginForm } from "@/components/auth/LoginForm";
import { getSessionUser } from "@/lib/auth/getSessionUser";
import { getCurrentSchool } from "@/lib/school/getCurrentSchool";
import { SchoolLogoAvatar } from "@/components/layout/SchoolLogoAvatar";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
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
      <h1 className="text-2xl font-semibold">{t("loginTitle")}</h1>
      <LoginForm />
    </main>
  );
}
