"use client";

import { useTranslations } from "next-intl";
import { logoutAction } from "@/actions/auth/logoutAction";

export function SignOutButton() {
  const t = useTranslations("dashboard");
  return (
    <form action={logoutAction}>
      <button type="submit" className="h-9 rounded-md border border-border px-4 hover:bg-accent">
        {t("signOut")}
      </button>
    </form>
  );
}
