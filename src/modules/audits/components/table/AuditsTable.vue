<template>
  <q-table
    :rows="auditsRows"
    :columns="allAuditsColumns"
    :pagination="pagination"
    :loading="loading"
    @request="getTableData"
    binary-state-sort
    row-key="name"
  >
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <template v-if="props.row.is_assigned">
          <q-btn
            label="Desasignar Analista"
            dense
            color="primary"
            style="font-size: 0.8em"
            @click="$emit('unsetAnalyst', props.row.analyst_name, props.row.audit_id)"
          ></q-btn>
        </template>
        <template v-else>
          <q-btn
            label="Asignar Analista"
            dense
            color="secondary"
            style="font-size: 0.8em"
            @click="$emit('setAnalyst', props.row.name, props.row.audit_id)"
          ></q-btn>
        </template>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
  import { type QTableColumn } from 'quasar';
  import { computed, type ComputedRef, type PropType, ref } from 'vue';
  import type { AuditRow, AuditsResponse } from 'audits/models/admin';

  const props = defineProps({
    auditsResponse: {
      type: Object as PropType<AuditsResponse | null>,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    }
  });

  const emits = defineEmits(['fetchData', 'setAnalyst', 'unsetAnalyst']);

  const allAuditsColumns: QTableColumn[] = [
    {
      name: 'audit_name',
      align: 'center',
      label: 'Nombre Auditoria',
      field: 'audit_name',
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
      name: 'analyst_name',
      align: 'center',
      label: 'Analista',
      field: 'analyst_name',
      sortable: true
    },
    {
      name: 'tenant_name',
      align: 'center',
      label: 'Tenant',
      field: 'tenant_name',
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

  const auditsRows: ComputedRef<AuditRow[]> = computed(() => props.auditsResponse?.audits || []);

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
