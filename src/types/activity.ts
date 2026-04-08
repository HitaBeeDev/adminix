export type ActionType =
  | 'user:created'
  | 'user:updated'
  | 'user:deleted'
  | 'user:suspended'
  | 'user:reactivated'
  | 'user:password_reset'
  | 'user:role_changed'
  | 'account:created'
  | 'account:updated'
  | 'account:suspended'
  | 'account:deleted'
  | 'role:created'
  | 'role:updated'
  | 'role:deleted'
  | 'auth:login'
  | 'auth:logout'
  | 'settings:updated';

export interface ActivityEvent {
  id: string;
  timestamp: string; // ISO date string
  actorId: string;
  actorName: string;
  actorEmail: string;
  action: ActionType;
  targetId?: string;
  targetName?: string;
  targetType?: 'user' | 'account' | 'role' | 'settings';
  ipAddress?: string;
  metadata?: Record<string, string>;
}

export interface ActivityFilters {
  userId?: string;
  actionType?: ActionType | '';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedActivity {
  data: ActivityEvent[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
