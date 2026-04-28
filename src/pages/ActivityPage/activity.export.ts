import { fetchAllActivity } from "@/hooks/useActivity";
import type { ActivityFilters } from "@/types/activity";
import { buildActivityCsv, downloadActivityCsv } from "./activity.utils";

export async function exportActivityCsv(filters: ActivityFilters) {
  const events = await fetchAllActivity(filters);
  downloadActivityCsv(buildActivityCsv(events));

  return events.length;
}
