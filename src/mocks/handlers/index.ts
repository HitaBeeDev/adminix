import { usersHandlers } from './users';
import { accountsHandlers } from './accounts';
import { rolesHandlers } from './roles';
import { activityHandlers } from './activity';
import { authHandlers } from './auth';
import { dashboardHandlers } from './dashboard';

export const handlers = [
  ...usersHandlers,
  ...accountsHandlers,
  ...rolesHandlers,
  ...activityHandlers,
  ...authHandlers,
  ...dashboardHandlers,
];
