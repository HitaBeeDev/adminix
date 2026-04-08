import type { Role, Permission, PermissionKey } from '@/types/role';

export const ALL_PERMISSIONS: Permission[] = [
  { key: 'users:read',      label: 'View Users',        description: 'View user list and profiles',          group: 'Users' },
  { key: 'users:create',    label: 'Create Users',       description: 'Invite and create new users',          group: 'Users' },
  { key: 'users:edit',      label: 'Edit Users',         description: 'Edit user details and roles',          group: 'Users' },
  { key: 'users:delete',    label: 'Delete Users',       description: 'Permanently delete users',             group: 'Users' },
  { key: 'users:suspend',   label: 'Suspend Users',      description: 'Suspend or reactivate users',          group: 'Users' },
  { key: 'accounts:read',   label: 'View Accounts',      description: 'View account list and details',        group: 'Accounts' },
  { key: 'accounts:create', label: 'Create Accounts',    description: 'Create new accounts/organizations',    group: 'Accounts' },
  { key: 'accounts:edit',   label: 'Edit Accounts',      description: 'Edit account details and plan',        group: 'Accounts' },
  { key: 'accounts:suspend',label: 'Suspend Accounts',   description: 'Suspend or reactivate accounts',       group: 'Accounts' },
  { key: 'roles:read',      label: 'View Roles',         description: 'View role list and permissions',       group: 'Roles' },
  { key: 'roles:create',    label: 'Create Roles',       description: 'Create new custom roles',              group: 'Roles' },
  { key: 'roles:edit',      label: 'Edit Roles',         description: 'Edit role names and permissions',      group: 'Roles' },
  { key: 'roles:delete',    label: 'Delete Roles',       description: 'Delete custom roles',                  group: 'Roles' },
  { key: 'activity:read',   label: 'View Activity',      description: 'View audit log and activity events',   group: 'Activity' },
  { key: 'activity:export', label: 'Export Activity',    description: 'Export audit log as CSV',              group: 'Activity' },
  { key: 'settings:read',   label: 'View Settings',      description: 'View app and profile settings',        group: 'Settings' },
  { key: 'settings:edit',   label: 'Edit Settings',      description: 'Modify app and profile settings',      group: 'Settings' },
];

const ALL_KEYS = ALL_PERMISSIONS.map((p) => p.key);

const ADMIN_PERMISSIONS: PermissionKey[] = ALL_KEYS;

const MANAGER_PERMISSIONS: PermissionKey[] = [
  'users:read', 'users:create', 'users:edit', 'users:suspend',
  'accounts:read', 'accounts:edit',
  'roles:read',
  'activity:read',
  'settings:read', 'settings:edit',
];

const EDITOR_PERMISSIONS: PermissionKey[] = [
  'users:read', 'users:edit',
  'accounts:read',
  'roles:read',
  'activity:read',
  'settings:read', 'settings:edit',
];

const VIEWER_PERMISSIONS: PermissionKey[] = [
  'users:read',
  'accounts:read',
  'roles:read',
  'activity:read',
  'settings:read',
];

const GUEST_PERMISSIONS: PermissionKey[] = [
  'users:read',
  'settings:read',
];

export const mockRoles: Role[] = [
  {
    id: 'role_01',
    name: 'Super Admin',
    description: 'Full access to all features and settings.',
    permissions: ADMIN_PERMISSIONS,
    isSystem: true,
    usersCount: 2,
    createdDate: '2020-01-01T00:00:00Z',
  },
  {
    id: 'role_02',
    name: 'Manager',
    description: 'Can manage users and accounts but cannot delete or modify roles.',
    permissions: MANAGER_PERMISSIONS,
    isSystem: true,
    usersCount: 8,
    createdDate: '2020-01-01T00:00:00Z',
  },
  {
    id: 'role_03',
    name: 'Editor',
    description: 'Can edit user and account details. Read-only on roles and activity.',
    permissions: EDITOR_PERMISSIONS,
    isSystem: false,
    usersCount: 15,
    createdDate: '2021-04-12T08:00:00Z',
  },
  {
    id: 'role_04',
    name: 'Viewer',
    description: 'Read-only access across the dashboard.',
    permissions: VIEWER_PERMISSIONS,
    isSystem: true,
    usersCount: 20,
    createdDate: '2020-01-01T00:00:00Z',
  },
  {
    id: 'role_05',
    name: 'Guest',
    description: 'Minimal access — can only view their own profile and settings.',
    permissions: GUEST_PERMISSIONS,
    isSystem: false,
    usersCount: 5,
    createdDate: '2022-06-01T10:00:00Z',
  },
];
