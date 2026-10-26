import type { MessageBoxType } from "./types";

export interface MessageBoxTheme {
  borderClass: string;
  badgeBgClass: string;
  badgeTextClass: string;
  buttonClass: string;
  defaultTitleKey: string;
}

export function getMessageBoxTheme(type: MessageBoxType): MessageBoxTheme {
  switch (type) {
    case "error":
      return {
        borderClass: "border-destructive/40 shadow-[0_0_35px_-12px_var(--destructive)]",
        badgeBgClass: "bg-destructive/10 ring-1 ring-destructive/20",
        badgeTextClass: "text-destructive",
        buttonClass: "bg-destructive hover:bg-destructive/90 text-white shadow-sm focus:ring-destructive/40",
        defaultTitleKey: "error",
      };
    case "warning":
      return {
        borderClass: "border-amber-500/30 dark:border-amber-400/30 shadow-[0_0_35px_-12px_rgba(245,158,11,0.2)]",
        badgeBgClass: "bg-amber-500/10 ring-1 ring-amber-500/20",
        badgeTextClass: "text-amber-600 dark:text-amber-400",
        buttonClass: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm focus:ring-primary/40",
        defaultTitleKey: "warning",
      };
    case "success":
      return {
        borderClass: "border-primary/40 shadow-[0_0_35px_-12px_var(--primary)]",
        badgeBgClass: "bg-primary/10 ring-1 ring-primary/20",
        badgeTextClass: "text-primary",
        buttonClass: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm focus:ring-primary/40",
        defaultTitleKey: "success",
      };
    case "info":
    default:
      return {
        borderClass: "border-primary/40 shadow-[0_0_35px_-12px_var(--primary)]",
        badgeBgClass: "bg-primary/10 ring-1 ring-primary/20",
        badgeTextClass: "text-primary",
        buttonClass: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm focus:ring-primary/40",
        defaultTitleKey: "notice",
      };
  }
}
