import type { Role, Permission, CreateRolePayload, UpdateRolePayload } from '@/types/role';

interface RolesResponse {
  data: Role[];
  permissions: Permission[];
}

export async function fetchRoles(): Promise<RolesResponse> {
  const res = await fetch('/api/roles');
  if (!res.ok) throw new Error('Failed to fetch roles');
  return res.json() as Promise<RolesResponse>;
}

export async function createRole(payload: CreateRolePayload): Promise<Role> {
  const res = await fetch('/api/roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create role');
  return res.json() as Promise<Role>;
}

export async function updateRole(id: string, payload: UpdateRolePayload): Promise<Role> {
  const res = await fetch(`/api/roles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update role');
  return res.json() as Promise<Role>;
}

export async function deleteRole(id: string): Promise<void> {
  const res = await fetch(`/api/roles/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete role');
}
