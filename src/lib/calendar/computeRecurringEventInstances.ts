import type { CalendarRecurrenceFrequency } from "./types";
import { advanceRecurrenceDate } from "./advanceRecurrenceDate";
import { isWeekendDay } from "./isWeekendDay";
import { parseRecurrenceDates } from "./parseRecurrenceDates";
import { resolveRecurrenceLimits } from "./resolveRecurrenceLimits";

export interface RecurrenceParams {
  startsAt: string;
  endsAt: string;
  frequency?: CalendarRecurrenceFrequency;
  untilDate?: string | null;
  maxCount?: number;
  workingDays?: number[] | null;
}

export function computeRecurringEventInstances(
  params: RecurrenceParams,
): Array<{ startsAt: string; endsAt: string }> {
  const dates = parseRecurrenceDates(params.startsAt, params.endsAt);
  if (!dates) return [];

  const { freq, untilTimestamp, countLimit } = resolveRecurrenceLimits(params);
  if (freq === "none") {
    if (isWeekendDay(dates.start, params.workingDays)) return [];
    return [{ startsAt: dates.start.toISOString(), endsAt: dates.end.toISOString() }];
  }

  const instances: Array<{ startsAt: string; endsAt: string }> = [];
  let currentStart = new Date(dates.start);
  let iterations = 0;
  const maxIterations = Math.max(countLimit * 7, 365);

  while (instances.length < countLimit && iterations < maxIterations) {
    iterations++;
    if (currentStart.getTime() > untilTimestamp) {
      break;
    }

    if (!isWeekendDay(currentStart, params.workingDays)) {
      instances.push({
        startsAt: currentStart.toISOString(),
        endsAt: new Date(currentStart.getTime() + dates.durationMs).toISOString(),
      });
    }

    currentStart = advanceRecurrenceDate(currentStart, freq);
  }

  return instances;
}
