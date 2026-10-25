"use client";

import { useTranslations } from "next-intl";
import { logoutAction } from "@/actions/auth/logoutAction";
import { purgeClientCaches } from "@/lib/pwa";

export function SignOutButton() {
  const t = useTranslations("dashboard");
  return (
    <form
      action={logoutAction}
      onSubmit={async () => {
        await purgeClientCaches();
      }}
    >
      <button
        type="submit"
        className="h-9 rounded-md border border-border px-4 hover:bg-accent"
        onClick={async () => {
          await purgeClientCaches();
        }}
      >
        {t("signOut")}
      </button>
    </form>
  );
}
