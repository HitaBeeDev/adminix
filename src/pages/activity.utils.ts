import { DOT_COLOR } from "./activity.constants";
import type { ActionType, ActivityEvent } from "@/types/activity";

export function dotColor(action: ActionType) {
  return DOT_COLOR[action] ?? "bg-indigo-500";
}

export function formatActivityDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatActivityRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;

  return `${Math.floor(hrs / 24)}d ago`;
}

export function csvCell(value: string | undefined) {
  const text = value ?? "";
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function buildActivityCsv(events: ActivityEvent[]) {
  return [
    ["Timestamp", "Actor", "Email", "Action", "Target", "IP"].join(","),
    ...events.map((event) =>
      [
        csvCell(event.timestamp),
        csvCell(event.actorName),
        csvCell(event.actorEmail),
        csvCell(event.action),
        csvCell(event.targetName),
        csvCell(event.ipAddress),
      ].join(","),
    ),
  ].join("\n");
}

export function downloadActivityCsv(rows: string) {
  const blob = new Blob([rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `activity-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function getActivityPaginationItems(currentPage: number, totalPages: number) {
  return Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
    .reduce<(number | "...")[]>((items, page, index, pages) => {
      if (index > 0 && page - pages[index - 1] > 1) items.push("...");
      items.push(page);
      return items;
    }, []);
}
