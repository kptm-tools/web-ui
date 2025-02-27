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
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
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
  references: string[];
}
