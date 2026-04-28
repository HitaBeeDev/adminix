import { DAYS } from "./accountDetail.constants";

export function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;

  return `${Math.floor(hrs / 24)}d ago`;
}

export function mockWeeklyActivity(accountId: string, membersCount: number) {
  const seed = accountId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return DAYS.map((day, index) => ({
    day,
    events: Math.max(1, Math.round(((seed * (index + 3)) % 17) + membersCount * 0.4)),
  }));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
