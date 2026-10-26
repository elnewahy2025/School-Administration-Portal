"use client";

import type { CircularRow } from "@/lib/circulars/types";
import type { MaintenanceRequestRow } from "@/lib/maintenance/types";
import type { CalendarEventRow } from "@/lib/calendar/types";
import type { SchoolAchievementRow } from "@/lib/achievements/types";

export function NewDashboardStatModalContent({
  statId,
  circulars,
  maintenance,
  events,
  achievements,
}: {
  statId: string;
  circulars: CircularRow[];
  maintenance: MaintenanceRequestRow[];
  events: CalendarEventRow[];
  achievements: SchoolAchievementRow[];
}) {
  if (statId === "circulars") {
    return (
      <div className="space-y-2">
        {circulars.slice(0, 5).map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border bg-muted/30 p-2.5">
            <div>
              <div className="text-xs font-bold text-foreground">{c.title}</div>
              <div className="text-[10px] text-muted-foreground">
                {new Date(c.created_at).toLocaleDateString("ar-KW")}
              </div>
            </div>
            <span className="text-[11px] font-bold text-blue-600">منشور</span>
          </div>
        ))}
      </div>
    );
  }

  if (statId === "maintenance") {
    return (
      <div className="space-y-2">
        {maintenance.slice(0, 5).map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-lg border bg-muted/30 p-2.5">
            <div>
              <div className="text-xs font-bold text-foreground">{m.title}</div>
              <div className="text-[10px] text-muted-foreground">
                تذكرة: {m.ticket_number} · الفئة: {m.category}
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-600">{m.status}</span>
          </div>
        ))}
      </div>
    );
  }

  if (statId === "events") {
    return (
      <div className="space-y-2">
        {events.slice(0, 5).map((ev) => (
          <div key={ev.id} className="flex items-center justify-between rounded-lg border bg-muted/30 p-2.5">
            <div>
              <div className="text-xs font-bold text-foreground">{ev.title_ar}</div>
              <div className="text-[10px] text-muted-foreground">
                {new Date(ev.starts_at).toLocaleDateString("ar-KW")} · {ev.location}
              </div>
            </div>
            <span className="text-[11px] font-bold text-purple-600">معتمد</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {achievements.map((a) => (
        <div key={a.id} className="flex items-center justify-between rounded-lg border bg-muted/30 p-2.5">
          <div>
            <div className="text-xs font-bold text-foreground">{a.title_ar}</div>
            <div className="text-[10px] text-muted-foreground">{a.description}</div>
          </div>
          <span className="text-[11px] font-bold text-emerald-600">🏆 موثق</span>
        </div>
      ))}
    </div>
  );
}
