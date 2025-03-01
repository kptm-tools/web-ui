<template>
  <div style="height: 80vh; overflow-y: auto">
    <table-regular
      :actions="['insight', 'search']"
      :columns="columns"
      :rows="rows"
      @action="handlerEmitter($event)"
    >
      >
      <template #column="{ column }">
        <template v-if="column.field === 'id'"> </template>
        <template v-else-if="column.field === 'scan_date'"
          >{{ formatDate(column.value) }}
        </template>
        <template v-else-if="column.field === 'comment_status'">
          <q-chip
            square
            color="secondary"
            text-color="white"
            :label="column.value"
          />
        </template>

        <template v-else> {{ column.value }} </template>
      </template>
    </table-regular>
  </div>
</template>

<script setup lang="ts">
  import { QTableColumn } from 'quasar';
  import TableRegular from './TableRegular.vue';

  defineProps<{
    rows: Record<string, unknown>[];
  }>();

  const emits = defineEmits(['refreshTable', 'action']);

  const columns: QTableColumn[] = [
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

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  function handlerEmitter(action: unknown): void {
    const actionType = action as { action: string; row: unknown };
    emits('action', actionType);
  }
</script>

<style scoped></style>
