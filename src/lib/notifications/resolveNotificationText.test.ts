import { describe, it, expect } from "vitest";
import { resolveNotificationText } from "./resolveNotificationText";

describe("resolveNotificationText", () => {
  const translations: Record<string, string> = {
    "templates.circular_published.title": "New Administrative Circular",
    "templates.circular_published.body": "A new circular has been published",
    "templates.circular_reminder.title": "Urgent Reminder",
    "templates.circular_reminder.bodyDefault": "Pending circulars need response",
    "templates.maintenance_assigned.title": "New Maintenance Request",
    "templates.maintenance_assigned.body": "A request has been assigned to you",
    "templates.circular_response_received.title": "New Circular Response",
    "templates.circular_response_received.body": "A department has submitted a response",
    "templates.circular_all_responded.title": "All Departments Responded",
    "templates.circular_all_responded.body": "All targeted departments have submitted responses",
    "templates.maintenance_submitted.title": "New Maintenance Ticket",
    "templates.maintenance_submitted.body": "A new ticket has been submitted",
  };

  const mockT = (key: string, values?: Record<string, string | number>) => {
    if (key === "templates.circular_reminder.bodyWithRef") {
      return `Review #${values?.ref} (${values?.title})`;
    }
    return translations[key] ?? key;
  };

  it("translates canonical template key for published circular", () => {
    const res = resolveNotificationText(
      { title: "circular_published", body: "circular_published" },
      mockT,
    );
    expect(res.title).toBe("New Administrative Circular");
    expect(res.body).toBe("A new circular has been published");
  });

  it("translates legacy Arabic string for published circular", () => {
    const res = resolveNotificationText(
      {
        title: "تعميم إداري جديد",
        body: "تم نشر تعميم إداري جديد يتطلب مراجعة واستجابة قسمكم",
      },
      mockT,
    );
    expect(res.title).toBe("New Administrative Circular");
    expect(res.body).toBe("A new circular has been published");
  });

  it("translates circular reminder with structured JSON body", () => {
    const res = resolveNotificationText(
      {
        title: "circular_reminder",
        body: JSON.stringify({ ref: "C-12", title: "Meeting" }),
      },
      mockT,
    );
    expect(res.title).toBe("Urgent Reminder");
    expect(res.body).toBe("Review #C-12 (Meeting)");
  });

  it("translates maintenance assignment notification", () => {
    const res = resolveNotificationText(
      { title: "maintenance_assigned", body: "maintenance_assigned" },
      mockT,
    );
    expect(res.title).toBe("New Maintenance Request");
    expect(res.body).toBe("A request has been assigned to you");
  });

  it("translates circular response received notification", () => {
    const res = resolveNotificationText(
      { title: "circular_response_received", body: "circular_response_received" },
      mockT,
    );
    expect(res.title).toBe("New Circular Response");
    expect(res.body).toBe("A department has submitted a response");
  });

  it("translates circular all responded notification", () => {
    const res = resolveNotificationText(
      { title: "circular_all_responded", body: "circular_all_responded" },
      mockT,
    );
    expect(res.title).toBe("All Departments Responded");
    expect(res.body).toBe("All targeted departments have submitted responses");
  });

  it("translates maintenance submitted notification", () => {
    const res = resolveNotificationText(
      { title: "maintenance_submitted", body: "maintenance_submitted" },
      mockT,
    );
    expect(res.title).toBe("New Maintenance Ticket");
    expect(res.body).toBe("A new ticket has been submitted");
  });

  it("preserves unmapped custom titles and bodies as fallback", () => {
    const res = resolveNotificationText(
      { title: "System Maintenance", body: "Server update at midnight" },
      mockT,
    );
    expect(res.title).toBe("System Maintenance");
    expect(res.body).toBe("Server update at midnight");
  });
});
