import type { PaginatedActivity, ActivityFilters } from '@/types/activity';

function buildQuery(filters: ActivityFilters): string {
  const params = new URLSearchParams();
  if (filters.userId)     params.set('userId', filters.userId);
  if (filters.actionType) params.set('actionType', filters.actionType);
  if (filters.dateFrom)   params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo)     params.set('dateTo', filters.dateTo);
  if (filters.page)       params.set('page', String(filters.page));
  if (filters.pageSize)   params.set('pageSize', String(filters.pageSize));
  return params.toString();
}

export async function fetchActivity(filters: ActivityFilters = {}): Promise<PaginatedActivity> {
  const res = await fetch(`/api/activity?${buildQuery(filters)}`);
  if (!res.ok) throw new Error('Failed to fetch activity');
  return res.json() as Promise<PaginatedActivity>;
}
