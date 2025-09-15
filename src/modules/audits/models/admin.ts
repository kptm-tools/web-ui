export interface AssignAnalystAuditRequest {
  analyst_user_id: string;
}

export interface AssignAnalystAuditResponse {
  analyst: AuditAnalyst;
  assigned_at: string;
  assigned_by: AssignedByAudit;
  audit_id: string;
}

export interface UnassignedAuditsResponse {
  data: UnassignedAuditRow[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export type AvailableAnalystsResponse = AvailableAnalyst[];

export interface AvailableAnalyst {
  name: string;
  user_id: string;
  workload: {
    active_audits: number;
    completed_audits: number;
  };
}

export interface UnassignedAuditRow {
  audit_id: string;
  created_at: string;
  days_unassigned: number;
  name: string;
  title: string;
}

export interface AuditAnalyst {
  created_at: string;
  display_name: string;
  email: string;
  id: string;
  role: string;
  tenant_id: string;
}

export interface AssignedByAudit {
  created_at: string;
  display_name: string;
  email: string;
  id: string;
  role: string;
  tenant_id: string;
}
