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
  audits: UnassignedAuditRow[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export interface AuditsResponse {
  audits: AuditRow[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export interface AvailableAnalystsResponse {
  analysts: AvailableAnalyst[];
}

export interface AvailableAnalyst {
  display_name: string;
  id: string;
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

export interface AuditRow {
  analyst_name: string;
  audit_id: string;
  audit_name: string;
  created_at: string;
  days_unassigned: number;
  is_assigned: boolean;
  tenant_id: string;
  tenant_name: string;
  updated_at: string;
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
