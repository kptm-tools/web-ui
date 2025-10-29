import type { ScopeFormActions } from '../enums/audits';
import type { AuditResponse } from './audits';

export interface ScopeEvaluationFormResponse {
  answers: ScopeEvaluationFormAnswer[];
  audit: AuditResponse;
  can_submit: boolean;
  scope_status: ScopeFormActions;
}

export interface ScopeEvaluationFormDraftRequest {
  answers: ScopeEvaluationFormDraftAnswerRequest[];
}

export interface ScopeEvaluationFormDraftResponse {
  answers: ScopeEvaluationFormDraftAnswerResponse[];
}

export interface ScopeEvaluationFormReviewRequest {
  action: ScopeFormActions;
  answer_reviews: ScopeEvaluationFormAnswerReviewRequest[];
  overall_feedback?: string;
}

export interface ScopeEvaluationFormReviewResponse {
  message: string;
  reviewed_at: string;
  status: string;
}

export interface ScopeEvaluationUploadFileRequest {
  file_name: string;
  file_size: number;
  file_type: string;
  question_code: string;
}

export interface ScopeEvaluationUploadFileResponse {
  expiration: string;
  file_id: number;
  upload_url: string;
}

export interface ScopeEvaluationFormAnswer {
  analyst_observation: string;
  files: ScopeEvaluationFormAnswerFile[];
  id: number;
  question_code: string;
  status: string;
  updated_at: string;
  value: string;
}

export interface ScopeEvaluationFormAnswerFile {
  audit_id: number;
  created_at: string;
  file_name: string;
  file_size_bytes: number;
  file_type: string;
  id: number;
  s3_key: string;
  status: string;
  uploader_id: string;
}

export interface ScopeEvaluationFormDraftAnswerRequest {
  file_ids?: number[] | undefined;
  question_code: string;
  value: string;
}

export interface ScopeEvaluationFormDraftAnswerResponse
  extends ScopeEvaluationFormDraftAnswerRequest {
  audit_id: number;
  created_at: string;
  updated_at: string;
}

export interface ScopeEvaluationFormAnswerReviewRequest {
  observation: string;
  question_code: string;
  status: string;
}
