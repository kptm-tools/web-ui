import type { QTableColumn } from 'quasar';

export const AUDITS_COLUMNS: QTableColumn[] = [
  {
    name: 'name',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: 'audit_name',
    sortable: true
  },
  {
    name: 'organizacion',
    required: true,
    label: 'ORGANIZACION',
    align: 'left',
    field: 'tenant_name',
    sortable: true
  },
  {
    name: 'analista',
    align: 'center',
    label: 'ANALISTA',
    field: 'analyst_name',
    sortable: true
  }
];
