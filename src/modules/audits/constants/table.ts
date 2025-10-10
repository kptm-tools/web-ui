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
    name: 'organizacion',
    required: true,
    label: 'ORGANIZACION',
    align: 'left',
    field: 'organization_name',
    sortable: true
  },
  {
    name: 'status',
    align: 'center',
    label: 'ESTADO',
    field: 'status',
    sortable: true
  },
  {
    name: 'alcance_temporal',
    label: 'ALCANCE TEMPORAL',
    field: 'temporal_scope',
    sortable: true
  },
  { name: 'step', label: 'PASO', field: 'step' },
  { name: 'actions', label: '', field: 'actions' }
];
