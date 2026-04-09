import type { PaginatedUsers, UserFilters, CreateUserPayload, UpdateUserPayload, User } from '@/types/user';

function buildQuery(filters: UserFilters): string {
  const params = new URLSearchParams();
  if (filters.search)   params.set('search', filters.search);
  if (filters.role)     params.set('role', filters.role);
  if (filters.status)   params.set('status', filters.status);
  if (filters.sortBy)   params.set('sortBy', filters.sortBy);
  if (filters.sortDir)  params.set('sortDir', filters.sortDir);
  if (filters.page)     params.set('page', String(filters.page));
  if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
  return params.toString();
}

export async function fetchUsers(filters: UserFilters = {}): Promise<PaginatedUsers> {
  const res = await fetch(`/api/users?${buildQuery(filters)}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json() as Promise<PaginatedUsers>;
}

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error('User not found');
  return res.json() as Promise<User>;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json() as Promise<User>;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json() as Promise<User>;
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete user');
}
