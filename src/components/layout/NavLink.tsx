"use client";

import { usePathname } from "@/i18n";
import { Link } from "@/i18n";
import { cn } from "cn";
import type { LucideIcon } from "lucide-react";

export function NavLink({
  href,
  label,
  icon: Icon,
  badge,
  exact = false,
  excludedPrefixes,
  onClick,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
  exact?: boolean;
  excludedPrefixes?: string[];
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isExcluded = excludedPrefixes?.some((prefix) => pathname.startsWith(prefix)) ?? false;
  const isActive =
    !isExcluded && (exact || href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-primary font-semibold text-sidebar-primary-foreground shadow-xs"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "ms-auto rounded-full px-2 py-0.5 text-xs font-semibold",
            isActive
              ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground"
              : "bg-sidebar-accent text-sidebar-accent-foreground",
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
