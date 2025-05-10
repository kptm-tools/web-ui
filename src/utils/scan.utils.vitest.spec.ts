/* eslint-disable @typescript-eslint/unbound-method */
import { describe, expect, it, vi } from 'vitest';
import type { Scan, ScanInsight, ScanTableAction } from 'src/models/scans.model';
import { ScanActions, ScanStatus } from 'src/models/scans.model';
import { ScanService } from 'src/services';
import {
  formatScansForTable,
  getScansFromService,
  getScanInsightsFromService,
  postScanCancelService,
  formatDuration,
  SCAN_TABLE_ACTIONS
} from './scan.utils';

// Mock the ScanService
vi.mock('src/services', () => ({
  ScanService: {
    getScans: vi.fn(),
    getScanInsights: vi.fn(),
    cancelScan: vi.fn()
  }
}));

describe('formatScansForTable', () => {
  it('should correctly format an array of Scans for a QTable', () => {
    const mockScans: Scan[] = [
      {
        scan_id: '1',
        scan_date: '2023-01-01',
        host: 'localhost',
        vulnerabilities: 5,
        severities: { critical: 2, high: 3, medium: 0, low: 0 },
        duration: 120,
        status: ScanStatus.completed
      },
      {
        scan_id: '2',
        scan_date: '2023-01-02',
        host: 'example.com',
        vulnerabilities: 10,
        severities: { critical: 1, high: 4, medium: 3, low: 2 },
        duration: 300,
        status: ScanStatus.inProgress
      }
    ];

    const expectedFormattedScans = [
      {
        id: '1',
        scanDate: '2023-01-01',
        host: 'localhost',
        numVulnerabilities: 5,
        severity: { critical: 2, high: 3, medium: 0, low: 0 },
        durations: 120,
        status: ScanStatus.completed
      },
      {
        id: '2',
        scanDate: '2023-01-02',
        host: 'example.com',
        numVulnerabilities: 10,
        severity: { critical: 1, high: 4, medium: 3, low: 2 },
        durations: 300,
        status: ScanStatus.inProgress
      }
    ];

    expect(formatScansForTable(mockScans)).toEqual(expectedFormattedScans);
  });

  it('should return an empty array if the input array is empty', () => {
    expect(formatScansForTable([])).toEqual([]);
  });
});

describe('getScansFromService', () => {
  it('should call ScanService.getScans and return the data', async () => {
    const mockScanData: Scan[] = [
      {
        scan_id: '3',
        scan_date: '2023-01-03',
        host: 'test.local',
        vulnerabilities: 2,
        severities: { critical: 0, high: 0, medium: 1, low: 1 },
        duration: 60,
        status: ScanStatus.completed
      }
    ];
    (ScanService.getScans as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockScanData });

    const result = await getScansFromService();

    expect(ScanService.getScans).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockScanData);
  });
});

describe('getScanInsightsFromService', () => {
  const mockInsightData: ScanInsight = {
    total_vulnerabilities: 15,
    vulnerabilities_by_severity: { critical: 3, high: 5, medium: 4, low: 3 },
    severity_counts: {
      critical: 1,
      high: 1,
      medium: 1,
      low: 1
    },
    protection_score: 1,
    severity_per_type: { val: '2' },
    vulnerability_variation: 1,
    protection_score_variation: 1,
    metadata: {
      scan_id: '1',
      host_alias: '1',
      scan_date: '1'
    }
  } as ScanInsight;

  it('should call ScanService.getScanInsights with the provided scan_id and return the data', async () => {
    (ScanService.getScanInsights as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockInsightData
    });
    const scanId = 'test-scan-id';

    const result = await getScanInsightsFromService(scanId);
    expect(ScanService.getScanInsights).toHaveBeenCalledWith(scanId);
    expect(result).toEqual(mockInsightData);
  });

  it('should call ScanService.getScanInsights with an empty string if no scan_id is provided', async () => {
    (ScanService.getScanInsights as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockInsightData
    });

    await getScanInsightsFromService();
    expect(ScanService.getScanInsights).toHaveBeenCalledWith('');
  });
});

describe('postScanCancelService', () => {
  it('should call ScanService.cancelScan with the provided scan_id and return the data', async () => {
    const mockCancelResponse = 'Scan cancellation initiated.';
    (ScanService.cancelScan as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockCancelResponse
    });
    const scanId = 'cancel-scan-id';

    const result = await postScanCancelService(scanId);
    expect(ScanService.cancelScan).toHaveBeenCalledWith(scanId);
    expect(result).toEqual(mockCancelResponse);
  });

  it('should call ScanService.cancelScan with an empty string if no scan_id is provided', async () => {
    const mockCancelResponse = 'No scan ID provided for cancellation.';
    (ScanService.cancelScan as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockCancelResponse
    });

    const result = await postScanCancelService();
    expect(ScanService.cancelScan).toHaveBeenCalledWith('');
    expect(result).toEqual(mockCancelResponse);
  });
});

describe('formatDuration', () => {
  it('should format duration in seconds correctly', () => {
    expect(formatDuration(30)).toBe('30s');
  });

  it('should format duration in minutes and seconds correctly', () => {
    expect(formatDuration(90)).toBe('1m 30s');
  });

  it('should format duration in hours and minutes correctly', () => {
    expect(formatDuration(3660)).toBe('1h 1m');
  });

  it('should format duration in hours, minutes, and seconds correctly', () => {
    expect(formatDuration(3725)).toBe('1h 2m');
  });

  it('should handle zero seconds correctly', () => {
    expect(formatDuration(0)).toBe('0s');
  });

  it('should handle durations less than a minute correctly', () => {
    expect(formatDuration(59)).toBe('59s');
  });

  it('should handle durations less than an hour correctly', () => {
    expect(formatDuration(3599)).toBe('59m 59s');
  });
});

describe('SCAN_TABLE_ACTIONS', () => {
  it('should define the correct actions for the scan table', () => {
    const expectedActions: ScanTableAction[] = [
      { name: ScanActions.insight, icon: 'fas fa-chart-simple', show: expect.any(Function) },
      { name: ScanActions.cancel, icon: 'close', show: expect.any(Function) }
    ];
    expect(SCAN_TABLE_ACTIONS).toEqual(expectedActions);
  });

  it('the "insight" action should be visible only when the status is "completed"', () => {
    const insightAction = SCAN_TABLE_ACTIONS.find(action => action.name === ScanActions.insight);
    expect(insightAction?.show(ScanStatus.completed)).toBe(true);
    expect(insightAction?.show(ScanStatus.inProgress)).toBe(false);
    expect(insightAction?.show(ScanStatus.pending)).toBe(false);
    expect(insightAction?.show(ScanStatus.cancelled)).toBe(false);
  });

  it('the "cancel" action should be visible when the status is "inProgress" or "pending"', () => {
    const cancelAction = SCAN_TABLE_ACTIONS.find(action => action.name === ScanActions.cancel);
    expect(cancelAction?.show(ScanStatus.completed)).toBe(false);
    expect(cancelAction?.show(ScanStatus.inProgress)).toBe(true);
    expect(cancelAction?.show(ScanStatus.pending)).toBe(true);
    expect(cancelAction?.show(ScanStatus.cancelled)).toBe(false);
  });
});
