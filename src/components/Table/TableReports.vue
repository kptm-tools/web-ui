<template>
  <div style="height: 80vh; overflow-y: auto">
    <table-regular
      :actions="REPORT_TABLE_ACTIONS"
      :columns="REPORT_TABLE_COLUMNS"
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
          <q-chip square color="secondary" text-color="white" :label="column.value" />
        </template>

        <template v-else> {{ column.value }} </template>
      </template>
    </table-regular>
  </div>
</template>

<script setup lang="ts">
  import TableRegular from './TableRegular.vue';
  import { REPORT_TABLE_ACTIONS, REPORT_TABLE_COLUMNS } from 'src/constants/table.constants';

  defineProps<{
    rows: Record<string, unknown>[];
  }>();

  const emits = defineEmits(['refreshTable', 'action']);

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  function handlerEmitter(action: unknown): void {
    const actionType = action as { action: string; row: unknown };
    emits('action', actionType);
  }
</script>

<style scoped></style>
