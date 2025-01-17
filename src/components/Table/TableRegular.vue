<template>
  <q-table
    :rows="componentProps.rows"
    :columns="updateColumns"
    flat
    separator="none"
    style="max-height: 80vh"
    virtual-scroll
  >
    <template #header-cell="props">
      <q-th :class="props.col.__thClass" class="table-header">
        {{ props.col.name }}</q-th
      >
    </template>
    <template #body="props">
      <q-tr :props="props" class="">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <template v-if="col.name === 'Status'">
            <q-linear-progress
              :value="col.value"
              class="q-mt-sm"
              color="secondary"
            />
          </template>
          <template v-else-if="col.name === 'Severity'">
            <template v-if="col.value == 5">
              <q-chip
                :label="col.value"
                color="red"
                square
                text-color="white"
              />
              <q-chip color="warning" label="3" square text-color="white" />
              <q-chip color="positive" label="1" square text-color="white" />
            </template>
            <template v-if="col.value == 4">
              <q-chip color="orange" label="4" square text-color="white" />
              <q-chip color="positive" label="1" square text-color="white" />
            </template>
          </template>
          <template v-else-if="col.name === 'actions'">
            <q-btn
              v-for="action in componentProps.actions"
              :key="action"
              :icon="getIcon(action)"
              class="button-table-action"
              dense
              flat
              @click="() => handlerEmitter(action, props.row)"
            />
          </template>
          <template v-else>
            <template v-if="isDate(col.value)">
              {{ formatDate(col.value) }}
            </template>
            <template v-else>{{ col.value }}</template>
          </template>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  import { QTableColumn } from 'quasar';
  import { computed } from 'vue';

  type tableActions = 'edit' | 'delete';

  const componentProps = defineProps<{
    columns: QTableColumn[];
    rows: Record<string, unknown>[];
    actions?: tableActions[];
  }>();

  const emits = defineEmits<{
    action: unknown;
  }>();

  const updateColumns = computed(() => {
    const columns = [...componentProps.columns];
    if (componentProps.actions?.length)
      columns.push({
        name: 'actions',
        label: 'Actions',
        align: 'center',
        field: 'actions'
      });
    return columns;
  });

  function getIcon(action: tableActions): string {
    switch (action) {
      case 'edit':
        return 'fas fa-pen-to-square';
      case 'delete':
        return 'fas fa-trash-can';
      default:
        return '';
    }
  }

  function handlerEmitter(action: tableActions, col: unknown): void {
    emits('action', { action, col });
  }

  function isDate(date: string): boolean {
    return new Date(date).toString() !== 'Invalid Date';
  }

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
</script>

<style scoped>
  .button-table-action {
    color: #5c7288;
    font-size: 0.8em;
  }

  .table-header {
    color: #5c7288;
    text-transform: uppercase;
  }
</style>
