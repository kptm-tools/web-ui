export interface EvidenceFile {
  access_level: string;
  filename: string;
  id: string;
  size: number;
  status: string;
  tags: string[];
  uploaded_at: string;
  uploaded_by: string;
}

export interface GetAllEvidencesResponse {
  evidence_files: EvidenceFile[];
  pagination: {
    has_next: boolean;
    has_prev: boolean;
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface EvidenceFileDetail extends EvidenceFile {
  audit_id: string;
  checksum: string;
  content_type: string;
  deleted_at: string;
  description: string;
  retention_policy: string;
  source: string;
  updated_at: string;
}

export interface EvidenceDownloadUrlResponse {
  download_url: string;
  expires_at: string;
  method: string;
  request_id: string;
}

export interface EvidenceMetadataResponse {
  bucket: string;
  content_type: string;
  etag: string;
  key: string;
  last_modified: string;
  size: number;
  storage_class: string;
}

export interface EvidenceConfirmRequest {
  checksum: string;
  confirmed_at: string;
  confirmed_by: string;
  status: string;
}

export interface EvidenceUploadRequest {
  audit_id: string;
  content_type: string;
  description: string;
  filename: string;
  size: number;
  source: string;
  tags: string[];
}

export interface EvidenceUploadRequestResponse {
  expires_at: string;
  file_id: string;
  max_file_size: number;
  method: string;
  request_id: string;
  upload_url: string;
}
