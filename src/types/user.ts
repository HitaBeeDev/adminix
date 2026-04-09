export type UserRole = 'super_admin' | 'admin' | 'manager' | 'editor' | 'viewer' | 'guest';

export type UserStatus = 'active' | 'suspended' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  lastActive: string; // ISO date string
  dateJoined: string; // ISO date string
  lastIp?: string;
  twoFactorEnabled: boolean;
  accountId?: string; // org/tenant they belong to
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role: UserRole;
  accountId: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserFilters {
  search?: string;
  role?: UserRole | '';
  status?: UserStatus | '';
  sortBy?: keyof Pick<User, 'name' | 'email' | 'role' | 'status' | 'lastActive' | 'dateJoined'>;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
