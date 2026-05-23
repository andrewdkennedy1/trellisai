const DEFAULT_FARM_TIME_ZONE = process.env.FARM_TIME_ZONE || "America/Los_Angeles";

export function farmIsoDate(date = new Date(), timeZone = DEFAULT_FARM_TIME_ZONE): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error(`Could not format farm date for time zone ${timeZone}`);
  }

  return `${year}-${month}-${day}`;
}

export function farmIsoDateOffset(days: number, base = new Date()): string {
  return farmIsoDate(new Date(base.getTime() + days * 24 * 60 * 60 * 1000));
}
