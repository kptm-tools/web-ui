export interface Report {
  scan_id: string;
  domain: string;
  ip: string;
  scan_date: string;
  total_severities: number;
  comment_status: ReportCommentStatus;
}

export interface GeneralSummary {
  total_vulnerabilities: number;
  severity_counts: SeverityCounts;
}

export interface SeverityCounts {
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
}

export interface VulnerabilitiesByCategory {
  category_data: CategoryData[];
}

export interface CategoryData {
  category: string;
  count: number;
}

export interface VulnerabilityTrends {
  time_periods: TimePeriod[];
  average_vulnerability_count: number;
}

export interface TimePeriod {
  time_period: string;
  vulnerability_count: number;
}

export interface ReportSummary {
  scan_id: string;
  domain: string;
  general_summary: GeneralSummary;
  vulnerabilities_by_category: VulnerabilitiesByCategory;
  vulnerability_trends: VulnerabilityTrends;
}

export interface ReportTableAction {
  name: string;
  icon: string;
  show: (value: string) => boolean;
}

export interface ReportTableEventAction {
  action: string;
  row: Report;
  col: Report;
}

export enum ReportSummarySeverity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}
export enum ReportSummaryTimeRange {
  MONTH = 'Month',
  QUARTER = 'Quarter',
  SEMESTER = 'Semester'
}

export type ReportSummarySeverityTypes =
  (typeof ReportSummarySeverity)[keyof typeof ReportSummarySeverity];

export type ReportCommentStatus = 'PENDING' | 'NEW COMMENT' | 'CRITICAL ';
export type ReportSummaryTimeRangeTypes =
  (typeof ReportSummaryTimeRange)[keyof typeof ReportSummaryTimeRange];
