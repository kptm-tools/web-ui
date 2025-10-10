import type { AudiSteps, OverallAuditStatus } from '../enums/audits';
import type { ReviewStatus } from '../enums/review';

export interface AuditResponse {
  created_at: string;
  id: number;
  name: string;
  overall_status: OverallAuditStatus;
  report_file_id: number;
  scope_status: ReviewStatus;
  step: AudiSteps;
  tenant_id: string;
  updated_at: string;
}

export interface AuditGeneralResponse {
  id: number;
  name: string;
  organization_name: string;
  start_date: string;
  status: string;
  step: AudiSteps;
  temporal_scope: string;
}

export interface AuditRequest {
  name: string;
  // overall_status: OverallAuditStatus;
  // report_file_id: number;
  // scope_status: ReviewStatus;
  // step: AudiSteps;
  // tenant_id: string;
}
