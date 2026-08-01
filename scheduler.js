const MINUTE_IN_MILLISECONDS = 60 * 1000;
const DAY_IN_MILLISECONDS = 24 * 60 * MINUTE_IN_MILLISECONDS;

export function calculateNextSchedule(
  previousSchedule,
  difficulty,
  reviewedAt = Date.now(),
) {
  const previousInterval = previousSchedule?.intervalDays || 0;

  if (difficulty === "hard") {
    return {
      dueAt: reviewedAt + 10 * MINUTE_IN_MILLISECONDS,
      intervalDays: 0,
      lastReviewedAt: reviewedAt,
    };
  }

  const initialInterval = difficulty === "easy" ? 4 : 1;
  const multiplier = difficulty === "easy" ? 3 : 2;
  const intervalDays = previousInterval
    ? Math.max(initialInterval, Math.round(previousInterval * multiplier))
    : initialInterval;

  return {
    dueAt: reviewedAt + intervalDays * DAY_IN_MILLISECONDS,
    intervalDays,
    lastReviewedAt: reviewedAt,
  };
}

export function isCardDue(schedule, now = Date.now()) {
  return !schedule || schedule.dueAt <= now;
}
