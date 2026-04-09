import { useQuery } from '@tanstack/react-query';
import { fetchActivity } from '@/api/activity';
import type { ActivityFilters } from '@/types/activity';

export function useActivity(filters: ActivityFilters = {}) {
  return useQuery({
    queryKey: ['activity', filters],
    queryFn: () => fetchActivity(filters),
    placeholderData: (prev) => prev,
  });
}
