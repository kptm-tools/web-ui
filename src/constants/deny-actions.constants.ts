export enum DENY_ACTIONS {
  USER_GET = 'user:get',
  USER_GET_PERMISSIONS = 'user:get_permissions',
  HOST_CREATE = 'host:create',
  HOST_VALIDATE = 'host:validate',
  HOST_VALIDATE_ALIAS = 'host:validate_alias',
  HOST_GET_ALL = 'host:get_all',
  HOST_GET_BY_ID = 'host:get_by_id',
  HOST_DELETE_BY_ID = 'host:delete_by_id',
  HOST_PATCH_BY_ID = 'host:patch_by_id',
  TENANT_GET_ALL = 'tenant:get_all',
  SCAN_CREATE = 'scan:create',
  SCAN_CANCEL_BY_ID = 'scan:cancel_by_id',
  SCAN_GET_INSIGHTS_BY_ID = 'scan:get_insights_by_id',
  SCAN_GET_VULNERABILITIES_BY_ID = 'scan:get_vulnerabilities_by_id',
  SCAN_GET_VULNERABILITY_SUMMARY_BY_ID = 'scan:get_vulnerability_summary_by_id',
  SCAN_GET_SCORECARD_TRENDS = 'scan:get_scorecard_trends',
  SCAN_SCHEDULE_DELETE_BY_ID = 'scan_schedule:delete_by_id',
  SCAN_SCHEDULE_PATCH_BY_ID = 'scan_schedule:patch_by_id',
  SCAN_SCHEDULE_GET_ALL = 'scan_schedule:get_all',
  REPORT_GET_ALL = 'report:get_all',
  VULNERABILITY_GET_BY_ID = 'vulnerability:get_by_id',
  VULNERABILITY_CREATE_COMMENT = 'vulnerability:create_comment',
  VULNERABILITY_PATCH_COMMENT = 'vulnerability:patch_comment',
  VULNERABILITY_DELETE_COMMENT = 'vulnerability:delete_comment',
  DASHBOARD_GET = 'dashboard:get'
}

export type DENY_ACTIONS_TYPES = keyof typeof DENY_ACTIONS;

export enum USER_ROLES {
  OPERATOR = 'operator',
  ANALYST = 'analyst',
  ADMIN = 'admin'
}

export type USER_ROLES_TYPES = keyof typeof USER_ROLES;
