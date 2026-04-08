import type { AuthUser } from '@/types/auth';

export const mockCurrentUser: AuthUser = {
  id: 'usr_01',
  name: 'Alex Morgan',
  email: 'alex.morgan@adminix.dev',
  role: 'super_admin',
  avatarUrl: 'https://i.pravatar.cc/150?u=usr_01',
};
