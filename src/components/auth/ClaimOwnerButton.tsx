"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { claimPlatformOwnerAction } from "@/actions/auth/claimPlatformOwnerAction";
import { useRouter } from "@/i18n";

export function ClaimOwnerButton() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={pending}
        className="h-9 rounded-md bg-primary px-4 text-primary-foreground disabled:opacity-50"
        onClick={() =>
          startTransition(async () => {
            const result = await claimPlatformOwnerAction();
            if (result.ok) {
              setMessage(t("claimed"));
              router.refresh();
            } else {
              setMessage(t("claimError"));
            }
          })
        }
      >
        {t("claimOwner")}
      </button>
      {message ? <span className="text-sm text-muted-foreground">{message}</span> : null}
    </div>
  );
}
