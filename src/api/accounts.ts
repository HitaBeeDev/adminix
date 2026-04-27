import type { PaginatedAccounts, AccountFilters, Account, CreateAccountPayload, UpdateAccountPayload } from '@/types/account';

export async function fetchAccount(id: string): Promise<Account> {
  const res = await fetch(`/api/accounts/${id}`);
  if (!res.ok) throw new Error('Account not found');
  return res.json() as Promise<Account>;
}

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

export async function createAccount(payload: CreateAccountPayload): Promise<Account> {
  const res = await fetch('/api/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create account');
  return res.json() as Promise<Account>;
}

export async function updateAccount(id: string, payload: UpdateAccountPayload): Promise<Account> {
  const res = await fetch(`/api/accounts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update account');
  return res.json() as Promise<Account>;
}
