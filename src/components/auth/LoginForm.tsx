"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { loginAction } from "@/actions/auth/loginAction";
import { Link, useRouter } from "@/i18n";

export function LoginForm() {
  const t = useTranslations("auth");
  const [state, formAction, pending] = useActionState(loginAction, {
    ok: false,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    if (state.ok) router.push("/dashboard");
  }, [state.ok, router]);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        {t("email")}
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          dir="ltr"
          className="h-9 rounded-md border border-input bg-background px-3"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        {t("passwordLabel")}
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          dir="ltr"
          className="h-9 rounded-md border border-input bg-background px-3"
        />
      </label>
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
        >
          {t("forgotPassword")}
        </Link>
      </div>
      {state.error ? (
        <p className="text-sm text-destructive">
          {state.error === "disabled" ? t("disabled") : t("error")}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="h-9 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
      >
        {t("signIn")}
      </button>
    </form>
  );
}
