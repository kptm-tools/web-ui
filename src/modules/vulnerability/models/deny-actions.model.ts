import type { DENY_ACTIONS_TYPES, USER_ROLES_TYPES } from 'src/constants/deny-actions.constants';

export interface DenyActionsResponse {
  user_role: USER_ROLES_TYPES[];
  denied_actions: DENY_ACTIONS_TYPES[];
  effective_permissions_last_updated: Date;
}
