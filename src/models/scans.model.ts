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

interface SeverityPerType {
  RCE: number;
  'SQL Injection': number;
  XSS: number;
  'Open Port': number;
}

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
  metadata: Metadata;
}
