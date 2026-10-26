"use client";

import type { DonutSegment } from "@/lib/dashboard/computeDonutSegments";

export function DashboardComplianceLegend({
  segments,
  hoveredId,
  onHover,
}: {
  segments: DonutSegment[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <div className="flex max-h-48 w-full flex-col gap-1.5 overflow-y-auto pr-1">
      {segments.map((seg) => {
        const isHovered = hoveredId === seg.id;
        return (
          <div
            key={seg.id}
            onMouseEnter={() => onHover(seg.id)}
            onMouseLeave={() => onHover(null)}
            className={`flex items-center justify-between rounded-lg px-2.5 py-1 text-xs transition-colors cursor-pointer ${
              isHovered ? "bg-muted font-bold" : "hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="truncate text-foreground">{seg.name}</span>
            </div>
            <span className="font-mono text-muted-foreground">{seg.value}%</span>
          </div>
        );
      })}
    </div>
  );
}
