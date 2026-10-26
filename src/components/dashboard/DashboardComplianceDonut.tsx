"use client";

import { useState } from "react";
import type { DashboardDepartmentComplianceSlice } from "@/lib/dashboard/types";

import { computeDonutSegments } from "@/lib/dashboard/computeDonutSegments";
import { DashboardComplianceLegend } from "./DashboardComplianceLegend";

export function DashboardComplianceDonut({
  slices,
  centerPercent,
  centerLabel,
}: {
  slices: DashboardDepartmentComplianceSlice[];
  centerPercent: number;
  centerLabel: string;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const radius = 68;
  const strokeWidth = 18;
  const segments = computeDonutSegments(slices, radius);

  const activeSegment = hoveredId ? segments.find((s) => s.id === hoveredId) : null;

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
      <div className="relative size-44 shrink-0 sm:size-48">
        <svg
          viewBox="0 0 200 200"
          className="size-full -rotate-90 transition-transform duration-500"
          aria-label="Department Compliance Donut Chart"
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />

          {segments.map((seg) => (
            <circle
              key={seg.id}
              cx="100"
              cy="100"
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={hoveredId === seg.id ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={seg.dashArray}
              strokeDashoffset={seg.dashOffset}
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onMouseEnter={() => setHoveredId(seg.id)}
              onMouseLeave={() => setHoveredId(null)}
            />
          ))}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-heading text-2xl font-black text-foreground sm:text-3xl">
            {activeSegment ? `${activeSegment.value}%` : `${centerPercent}%`}
          </span>
          <span className="max-w-[90px] truncate text-[11px] font-medium text-muted-foreground">
            {activeSegment ? activeSegment.name : centerLabel}
          </span>
        </div>
      </div>

      <DashboardComplianceLegend
        segments={segments}
        hoveredId={hoveredId}
        onHover={setHoveredId}
      />
    </div>
  );
}
