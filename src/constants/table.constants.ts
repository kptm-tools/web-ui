import type { QTableColumn } from 'quasar';
import { type tableActions, TableActions } from 'shared/models/table';

export const TABLE_ACTIONS_COLUMN: QTableColumn = {
  name: 'actions',
  label: 'Actions',
  align: 'center',
  field: 'actions'
};

export const HOST_TABLE_ACTIONS: tableActions[] = [TableActions.EDIT, TableActions.DELETE];
export const HOST_TABLE_COLUMNS: QTableColumn[] = [
  {
    name: 'Host Name',
    label: 'HostName',
    align: 'left',
    field: 'hostName'
  },
  {
    name: 'Domain',
    label: 'Domain',
    align: 'left',
    field: 'domain'
  },
  {
    name: 'IP',
    label: 'Ip',
    align: 'left',
    field: 'ip'
  },
  {
    name: 'Creation Date',
    label: 'CreationDate',
    align: 'left',
    field: 'creationDate'
  },
  {
    name: 'Email',
    label: 'Email',
    align: 'left',
    field: 'email'
  }
];

export const REPORT_TABLE_ACTIONS: tableActions[] = [
  TableActions.INFORMATION,
  TableActions.VIEW_ASSETS,
  TableActions.INSIGHT,
  TableActions.POLAR_REPORT
];
export const REPORT_TABLE_COLUMNS: QTableColumn[] = [
  {
    name: 'Domain',
    label: 'Domain',
    align: 'left',
    field: 'domain'
  },
  {
    name: 'IP',
    label: 'Ip',
    align: 'left',
    field: 'ip'
  },
  {
    name: 'Scan Date',
    label: 'ScanDate',
    align: 'left',
    field: 'scan_date'
  },
  {
    name: 'Total Severities',
    label: 'TotalSeverities',
    align: 'left',
    field: 'total_severities'
  },
  {
    name: 'Comment Status',
    label: 'CommentStatus',
    align: 'left',
    field: 'comment_status'
  }
];

export const SCAN_SCHEDULE_TABLE_COLUMNS: QTableColumn[] = [
  {
    name: 'ID',
    label: 'ID',
    align: 'left',
    field: 'id'
  },
  {
    name: 'Host',
    label: 'Host',
    align: 'left',
    field: 'host'
  },
  {
    name: 'Scan Date',
    label: 'ScanDate',
    align: 'left',
    field: 'scheduled_date'
  },
  {
    name: 'Frequency',
    label: 'Frequency',
    align: 'left',
    field: 'frequency'
  }
];

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
    name: 'Duration',
    label: 'Duration',
    align: 'left',
    field: 'duration'
  },
  {
    name: 'Status',
    label: 'Status',
    align: 'left',
    field: 'status'
  },
  TABLE_ACTIONS_COLUMN
];
