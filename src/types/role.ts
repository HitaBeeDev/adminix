export type PermissionKey =
  | 'users:read'
  | 'users:create'
  | 'users:edit'
  | 'users:delete'
  | 'users:suspend'
  | 'accounts:read'
  | 'accounts:create'
  | 'accounts:edit'
  | 'accounts:suspend'
  | 'roles:read'
  | 'roles:create'
  | 'roles:edit'
  | 'roles:delete'
  | 'activity:read'
  | 'activity:export'
  | 'settings:read'
  | 'settings:edit';

export interface Permission {
  key: PermissionKey;
  label: string;
  description: string;
  group: 'Users' | 'Accounts' | 'Roles' | 'Activity' | 'Settings';
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissions?: PermissionKey[];
}

export interface CreateRolePayload {
  name: string;
  description: string;
  permissions: PermissionKey[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: PermissionKey[];
  isSystem: boolean; // system roles (Admin, Viewer, etc.) can't be deleted
  usersCount: number;
  createdDate: string; // ISO date string
}
