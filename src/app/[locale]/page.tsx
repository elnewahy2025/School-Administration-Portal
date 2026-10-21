import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { ThemeToggle } from "@/components/theme";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
      <ThemeToggle />
      <p className="text-sm text-muted-foreground">{t("comingSoon")}</p>
    </main>
  );
}
