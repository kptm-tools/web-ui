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

export enum ScanActions {
  insight = 'insight',
  cancel = 'cancel'
}
