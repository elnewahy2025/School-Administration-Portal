"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useMounted } from "./useMounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const t = useTranslations("theme");

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label={t("toDark")}
        className="h-9 w-9 rounded-md border border-border bg-background"
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label={t(isDark ? "toLight" : "toDark")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-9 w-9 rounded-md border border-border bg-background hover:bg-accent"
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
