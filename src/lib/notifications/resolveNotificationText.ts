import { resolveReminderBody } from "./resolveReminderBody";

type NotificationLike = {
  title: string;
  body: string | null;
  type?: string;
};

type Translator = (key: string, values?: Record<string, string | number>) => string;

const STATIC_TEMPLATES: Record<string, { titleKey: string; bodyKey: string }> = {
  circular_published: {
    titleKey: "templates.circular_published.title",
    bodyKey: "templates.circular_published.body",
  },
  "تعميم إداري جديد": {
    titleKey: "templates.circular_published.title",
    bodyKey: "templates.circular_published.body",
  },
  maintenance_assigned: {
    titleKey: "templates.maintenance_assigned.title",
    bodyKey: "templates.maintenance_assigned.body",
  },
  "تم إسناد بلاغ صيانة جديد لك": {
    titleKey: "templates.maintenance_assigned.title",
    bodyKey: "templates.maintenance_assigned.body",
  },
  circular_response_received: {
    titleKey: "templates.circular_response_received.title",
    bodyKey: "templates.circular_response_received.body",
  },
  circular_all_responded: {
    titleKey: "templates.circular_all_responded.title",
    bodyKey: "templates.circular_all_responded.body",
  },
  maintenance_submitted: {
    titleKey: "templates.maintenance_submitted.title",
    bodyKey: "templates.maintenance_submitted.body",
  },
};

export function resolveNotificationText(
  notification: NotificationLike,
  t: Translator,
): { title: string; body: string | null } {
  const rawTitle = notification.title;

  const match = STATIC_TEMPLATES[rawTitle];
  if (match) {
    return {
      title: t(match.titleKey),
      body: t(match.bodyKey),
    };
  }

  if (rawTitle === "circular_reminder" || rawTitle === "تذكير عاجل: استجابة تعميم إداري") {
    return {
      title: t("templates.circular_reminder.title"),
      body: resolveReminderBody(notification.body, t),
    };
  }

  return {
    title: notification.title,
    body: notification.body,
  };
}
