import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n";
import { ClaimOwnerButton } from "@/components/auth/ClaimOwnerButton";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getSessionUser } from "@/lib/auth/getSessionUser";
import { hasAnyPlatformOwner } from "@/lib/auth/hasAnyPlatformOwner";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getSessionUser();
  if (!user) redirect({ href: "/login", locale });

  const [profile, ownerExists] = await Promise.all([getCurrentProfile(), hasAnyPlatformOwner()]);
  const t = await getTranslations("dashboard");

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <SignOutButton />
      </header>
      {profile ? (
        <p>{t("signedInAs", { name: profile.full_name })}</p>
      ) : ownerExists ? (
        <p className="text-muted-foreground">{t("pendingAccount")}</p>
      ) : (
        <section className="flex flex-col gap-3 rounded-lg border border-border p-4">
          <p>{t("claimIntro")}</p>
          <ClaimOwnerButton />
        </section>
      )}
    </main>
  );
}
