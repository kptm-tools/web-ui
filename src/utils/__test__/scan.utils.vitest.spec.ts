import { describe, expect, it, vi } from 'vitest';
import type { Scan, ScanTableAction } from 'vulnerability/models/scans';
import { ScanActions, ScanStatus } from 'vulnerability/models/scans';
import { formatScansForTable, formatDuration, SCAN_TABLE_ACTIONS } from '../scan.utils';

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
