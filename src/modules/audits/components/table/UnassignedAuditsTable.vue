<template>
  <q-table
    :rows="unassignedAuditsRows"
    :columns="unassignedAuditsColumns"
    :pagination="pagination"
    :loading="loading"
    @request="getTableData"
    binary-state-sort
    row-key="name"
  >
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          label="Asignar Analista"
          dense
          color="secondary"
          style="font-size: 0.8em"
          @click="$emit('setAnalyst', props.row.name, props.row.audit_id)"
        ></q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
  import { type QTableColumn } from 'quasar';
  import { computed, type ComputedRef, type PropType, ref } from 'vue';
  import type { UnassignedAuditRow, UnassignedAuditsResponse } from 'audits/models/admin';

  const props = defineProps({
    unassignedAuditsResponse: {
      type: Object as PropType<UnassignedAuditsResponse | null>,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    }
  });

  const emits = defineEmits(['fetchData', 'setAnalyst']);

  const unassignedAuditsColumns: QTableColumn[] = [
    {
      name: 'name',
      align: 'center',
      label: 'Nombre Auditoria',
      field: 'name',
      sortable: true
    },
    {
      name: 'created_at',
      align: 'center',
      label: 'Creación',
      field: 'created_at',
      sortable: true
    },
    {
      name: 'days_unassigned',
      align: 'center',
      label: 'Dias sin asignar',
      field: 'days_unassigned',
      sortable: true
    },
    {
      name: 'actions',
      align: 'center',
      label: '',
      field: 'actions',
      sortable: true
    }
  ];

  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 20,
    rowsNumber: 20
  });

  const unassignedAuditsRows: ComputedRef<UnassignedAuditRow[]> = computed(
    () => props.unassignedAuditsResponse?.audits || []
  );

  function getTableData(props: {
    pagination: {
      sortBy: string;
      descending: boolean;
      page: number;
      rowsPerPage: number;
      rowsNumber?: number;
    };
  }) {
    if (props.pagination) {
      const { page, rowsNumber } = props.pagination;
      emits('fetchData', page, rowsNumber);
    }
  }
</script>
