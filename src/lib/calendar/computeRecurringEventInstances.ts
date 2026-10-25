import type { CalendarRecurrenceFrequency } from "./types";
import { parseUntilTimestamp } from "./parseUntilTimestamp";
import { advanceRecurrenceDate } from "./advanceRecurrenceDate";

export interface RecurrenceParams {
  startsAt: string;
  endsAt: string;
  frequency?: CalendarRecurrenceFrequency;
  untilDate?: string | null;
  maxCount?: number;
}

export function computeRecurringEventInstances(
  params: RecurrenceParams,
): Array<{ startsAt: string; endsAt: string }> {
  const start = new Date(params.startsAt);
  const end = new Date(params.endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end.getTime() < start.getTime()) {
    return [];
  }

  const durationMs = end.getTime() - start.getTime();
  const freq = params.frequency ?? "none";
  if (freq === "none") {
    return [{ startsAt: params.startsAt, endsAt: params.endsAt }];
  }

  const untilTimestamp = parseUntilTimestamp(params.untilDate);
  const countLimit = Math.min(Math.max(params.maxCount ?? 52, 1), 100);
  const instances: Array<{ startsAt: string; endsAt: string }> = [];
  let currentStart = new Date(start);

  while (instances.length < countLimit) {
    if (untilTimestamp !== null && currentStart.getTime() > untilTimestamp) {
      break;
    }

    const currentEnd = new Date(currentStart.getTime() + durationMs);
    instances.push({
      startsAt: currentStart.toISOString(),
      endsAt: currentEnd.toISOString(),
    });

    currentStart = advanceRecurrenceDate(currentStart, freq);
  }

  return instances;
}
