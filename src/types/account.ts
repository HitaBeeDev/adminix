export type AccountPlan = 'free' | 'starter' | 'pro' | 'enterprise';

export type AccountStatus = 'active' | 'suspended' | 'trial';

export interface Account {
  id: string;
  name: string;
  plan: AccountPlan;
  status: AccountStatus;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  membersCount: number;
  createdDate: string; // ISO date string
  domain?: string;
}

export interface AccountFilters {
  search?: string;
  plan?: AccountPlan | '';
  status?: AccountStatus | '';
  page?: number;
  pageSize?: number;
}

export interface PaginatedAccounts {
  data: Account[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
