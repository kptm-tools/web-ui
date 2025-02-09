import { Scan, ScanInsight } from 'src/models/scans.model';
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
