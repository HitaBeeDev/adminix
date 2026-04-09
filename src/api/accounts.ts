import type { PaginatedAccounts, AccountFilters } from '@/types/account';

function buildQuery(filters: AccountFilters): string {
  const params = new URLSearchParams();
  if (filters.search)   params.set('search', filters.search);
  if (filters.plan)     params.set('plan', filters.plan);
  if (filters.status)   params.set('status', filters.status);
  if (filters.page)     params.set('page', String(filters.page));
  if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
  return params.toString();
}

export async function fetchAccounts(filters: AccountFilters = {}): Promise<PaginatedAccounts> {
  const res = await fetch(`/api/accounts?${buildQuery(filters)}`);
  if (!res.ok) throw new Error('Failed to fetch accounts');
  return res.json() as Promise<PaginatedAccounts>;
}
