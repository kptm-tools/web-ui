import { QTableColumn } from 'quasar';
import {
  Scan,
  ScanActions,
  ScanInsight,
  ScanStatus,
  ScanTableAction
} from 'src/models/scans.model';
import { ScanService } from 'src/services';

export function formatScansForTable(scans: Scan[]): Record<string, unknown>[] {
  return scans.map(scan => ({
    id: scan.scan_id,
    scanDate: scan.scan_date,
    host: scan.host,
    numVulnerabilities: scan.vulnerabilities,
    severity: scan.severities,
    durations: scan.duration,
    status: scan.status
  }));
}

export async function getScansFromService(): Promise<Scan[]> {
  return (await ScanService.getScans()).data;
}

export async function getScanInsightsFromService(
  scan_id: string = ''
): Promise<ScanInsight> {
  return (await ScanService.getScanInsights(scan_id)).data;
}

export async function postScanCancelService(
  scan_id: string = ''
): Promise<string> {
  return (await ScanService.cancelScan(scan_id)).data;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  let result = '';
  if (hours > 0) result += `${hours}h ${minutes}m`;
  if (minutes > 0 && hours < 1) result += `${minutes}m ${secs.toFixed(0)}s`;
  if ((secs > 0 && seconds < 60) || result === '')
    result += `${secs.toFixed(0)}s`;

  return result.trim();
}

export const SCAN_TABLE_COLUMNS: QTableColumn[] = [
  {
    name: 'ID',
    label: 'ID',
    align: 'left',
    field: 'id'
  },
  {
    name: 'Scan Date',
    label: 'ScanDate',
    align: 'left',
    field: 'scanDate'
  },
  {
    name: 'Host',
    label: 'Host',
    align: 'left',
    field: 'host'
  },
  {
    name: '# of vulnerabilities',
    label: 'NumVulnerabilities',
    align: 'left',
    field: 'numVulnerabilities'
  },
  {
    name: 'Severity',
    label: 'Severity',
    align: 'left',
    field: 'severity'
  },
  {
    name: 'Durations',
    label: 'Durations',
    align: 'left',
    field: 'durations'
  },
  {
    name: 'Status',
    label: 'Status',
    align: 'left',
    field: 'status'
  }
];

export const SCAN_TABLE_ACTIONS: ScanTableAction[] = [
  {
    name: ScanActions.insight,
    icon: 'fas fa-chart-simple',
    show: (value: string): boolean => value === ScanStatus.completed
  },
  {
    name: ScanActions.cancel,
    icon: 'close',
    show: (value: string): boolean =>
      value === ScanStatus.inProgress || value === ScanStatus.inProgress
  }
];
