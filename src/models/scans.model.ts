export interface Scan {
  scan_id: string;
  scan_date: string;
  host: string;
  vulnerabilities: number;
  severities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  duration: number;
  status: string;
}

export interface ScanTableColums {
  id: string;
  scanDate: string;
  host: string;
  numVulnerabilities: number;
  severity: SeverityCounts;
  durations: string;
  status: string;
}

interface SeverityCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface SeverityPerType {
  [key: string]: number;
}

export interface VulnerabilityItem {
  id: number;
  name: string;
  count: number;
}

export type SeverityKey = keyof SeverityPerType;

interface Metadata {
  scan_id: string;
  host_alias: string;
  scan_date: string;
}

export interface ScanInsight {
  severity_counts: SeverityCounts;
  severity_per_type: SeverityPerType;
  total_vulnerabilities: number;
  vulnerability_variation: number;
  protection_score: number;
  protection_score_variation: number;
  metadata: Metadata;
}

export enum ScanStatus {
  inProgress = 'InProgress',
  completed = 'Completed',
  pending = 'Pending',
  cancelled = 'Cancelled'
}

export type ScanStatusType = keyof ScanStatus;

export enum ScanActions {
  insight = 'insight',
  cancel = 'cancel'
}

export interface ScanTableAction {
  name: string;
  icon: string;
  show: (value: string) => boolean;
}

export interface ScanTableEventAction {
  action: ScanTableAction;
  row: ScanTableColums;
}

export interface ScanVulnerabilitesResponse {
  scan_date: string;
  alias: string;
  total_vulnerabilities: number;
  severity_counts: ScanVulnerabilitesServerityCounts;
  vulnerabilities: ScanVulnerability[];
}

export interface ScanVulnerabilitesServerityCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface ScanVulnerability {
  id: number;
  name: string;
  severity: string;
  max_cvss: number;
  risk_score: number;
  impact_score: number;
  likelihood: string;
  access: string;
  complexity: string;
  privileges: string;
  exploitability: string;
  comment: string;
  recommendation?: string;
  references: string[];
  description?: string;
  port?: {
    id: string;
    protocol: string;
  };
  host?: {
    ip_address: string;
    alias: string;
  };
  operating_system?: {
    name: string;
    type: string;
  };
  date?: {
    published: string;
    last_updated: string;
  };
  plugin?: {
    cpe: string;
    severity: string;
    version: string;
    type: string;
    family: string;
  };
  vpr_key_d?: {
    threat_intensity: string;
    exploit_code_maturity: string;
    age_of_vuln: number;
    product_coverage: string;
  };
  risk?: {
    risk_score: number;
    availability_impact: string;
    integrity_impact: string;
    cvss_v3_base: number;
    cvss_v3_vector: string;
  };
}

export interface ScanScoreTrend {
  alias: string;
  oldest_score: number | null;
  latest_score: number;
  latest_score_grade: string;
}
