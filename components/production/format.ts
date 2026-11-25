// "Nov 25, 2026, 3:42 PM". The time zone is fixed so the server and the
// browser always print the same text.
const TIME_ZONE = "Asia/Manila";

export function formatRecorded(date: Date): string {
  return date.toLocaleString("en-US", {
    timeZone: TIME_ZONE,
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
