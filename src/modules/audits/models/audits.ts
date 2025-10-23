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

export interface AuditSubmitFileResponse {
  expiration: string;
  file_id: number;
  upload_url: string;
}

export interface AuditGeneralResponse {
  audits: AuditResponse[];
  pagination: {
    has_next: true;
    has_prev: false;
    page: 1;
    page_size: 20;
    total: 100;
    total_pages: 5;
  };
}

export interface AuditRequest {
  name: string;
  // overall_status: OverallAuditStatus;
  // report_file_id: number;
  // scope_status: ReviewStatus;
  // step: AudiSteps;
  // tenant_id: string;
}
