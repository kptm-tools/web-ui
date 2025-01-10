<template>
  <q-table
    :rows="componentProps.rows"
    :columns="updateColumns"
    flat
    separator="none"
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
              color="secondary"
              class="q-mt-sm"
            />
          </template>
          <template v-else-if="col.name === 'Severity'">
            <template v-if="col.value == 5">
              <q-chip
                square
                color="red"
                text-color="white"
                :label="col.value"
              />
              <q-chip square color="warning" text-color="white" label="3" />
              <q-chip square color="positive" text-color="white" label="1" />
            </template>
            <template v-if="col.value == 4">
              <q-chip square color="orange" text-color="white" label="4" />
              <q-chip square color="positive" text-color="white" label="1" />
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
            {{ col.value }}
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
    const columns = componentProps.columns;
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
