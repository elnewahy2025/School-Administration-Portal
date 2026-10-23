"use client";

import { useTranslations } from "next-intl";
import { LogOutIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/actions/auth/logoutAction";
import { getUserInitials } from "@/lib/auth/getUserInitials";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";
import { AppUserLabel } from "./AppUserLabel";

export function AppUserMenu({ profile }: { profile: ProfileRow | null }) {
  const t = useTranslations("dashboard");
  const displayName = profile?.full_name ?? "User";
  const initials = getUserInitials(profile?.full_name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-accent focus:outline-hidden">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {initials || <UserIcon className="size-4" />}
        </div>
        <div className="hidden flex-col items-start text-start sm:flex">
          <span className="text-sm leading-none font-medium text-foreground">{displayName}</span>
          <span className="line-clamp-1 text-xs text-muted-foreground">
            {profile?.job_title ?? profile?.email ?? ""}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <AppUserLabel profile={profile} />
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <form action={logoutAction} className="w-full">
            <button type="submit" className="w-full">
              <DropdownMenuItem variant="destructive" className="w-full cursor-pointer">
                <LogOutIcon className="me-2 size-4" />
                <span>{t("signOut")}</span>
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
