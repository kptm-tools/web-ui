import type { QTableColumn } from 'quasar';
export const AUDITS_COLUMNS: QTableColumn[] = [
  {
    name: 'name',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: 'name',
    sortable: true
  },
  {
    name: 'status',
    required: true,
    label: 'ORGANIZACION',
    align: 'left',
    field: 'overall_status',
    sortable: true
  },
  {
    name: 'PASO',
    align: 'center',
    label: 'PASO',
    field: 'step',
    sortable: true
  }
];
