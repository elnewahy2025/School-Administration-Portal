import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n";
import { LoginForm } from "@/components/auth/LoginForm";
import { getSessionUser } from "@/lib/auth/getSessionUser";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getSessionUser();
  if (user) redirect({ href: "/dashboard", locale });
  const t = await getTranslations("auth");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-semibold">{t("loginTitle")}</h1>
      <LoginForm />
    </main>
  );
}
