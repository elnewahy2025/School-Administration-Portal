import type { DashboardDepartmentComplianceSlice } from "./types";

export interface DonutSegment {
  id: string;
  name: string;
  value: number;
  percent: number;
  color: string;
  dashArray: string;
  dashOffset: number;
}

export function computeDonutSegments(
  slices: DashboardDepartmentComplianceSlice[],
  radius = 68,
): DonutSegment[] {
  const circumference = 2 * Math.PI * radius;
  const validSlices = slices.filter((s) => s.targetedCount > 0);
  const totalTargets = validSlices.reduce((sum, s) => sum + s.targetedCount, 0);

  let acc = 0;
  return validSlices.map((slice) => {
    const slicePercent =
      totalTargets > 0 ? (slice.respondedCount / totalTargets) * 100 : 0;
    const strokeLength = (slicePercent / 100) * circumference;
    const offset = -(acc / 100) * circumference;
    acc += slicePercent;

    return {
      id: slice.id,
      name: slice.name,
      value: slice.complianceRate,
      percent: Math.round(slicePercent),
      color: slice.color,
      dashArray: `${strokeLength} ${circumference}`,
      dashOffset: offset,
    };
  });
}
