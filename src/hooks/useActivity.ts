import { useQuery } from '@tanstack/react-query';
import { fetchActivity } from '@/api/activity';
import type { ActivityEvent, ActivityFilters } from '@/types/activity';

export function useActivity(filters: ActivityFilters = {}) {
  return useQuery({
    queryKey: ['activity', filters],
    queryFn: () => fetchActivity(filters),
    placeholderData: (prev) => prev,
  });
}

export async function fetchAllActivity(filters: ActivityFilters = {}) {
  const firstPage = await fetchActivity({ ...filters, page: 1, pageSize: 100 });
  const events: ActivityEvent[] = [...firstPage.data];

  for (let page = 2; page <= firstPage.totalPages; page += 1) {
    const nextPage = await fetchActivity({ ...filters, page, pageSize: firstPage.pageSize });
    events.push(...nextPage.data);
  }

  return events;
}
