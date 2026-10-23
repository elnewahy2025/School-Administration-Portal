import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { FileTextIcon, WrenchIcon, CalendarIcon, InfoIcon } from "lucide-react";
import type { NotificationType } from "@/lib/notifications/types";

export function NotificationBadge({ type }: { type: NotificationType }) {
  const t = useTranslations("notifications.types");

  if (type === "circular") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
      >
        <FileTextIcon className="size-3" />
        <span>{t("circular")}</span>
      </Badge>
    );
  }

  if (type === "maintenance") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
      >
        <WrenchIcon className="size-3" />
        <span>{t("maintenance")}</span>
      </Badge>
    );
  }

  if (type === "calendar") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400"
      >
        <CalendarIcon className="size-3" />
        <span>{t("calendar")}</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1 border-muted-foreground/30 bg-muted text-muted-foreground"
    >
      <InfoIcon className="size-3" />
      <span>{t("system")}</span>
    </Badge>
  );
}
