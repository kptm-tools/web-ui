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
      <template v-if="props.col.name !== 'ID'">
        <q-th :class="props.col.__thClass" class="table-header"> {{ props.col.name }}</q-th>
      </template>
    </template>
    <template #body="props">
      <q-tr :props="props" class="">
        <template v-for="col in props.cols" :key="col.name">
          <template v-if="col.name !== 'ID'">
            <q-td>
              <slot name="column" :column="col" :row="props.row">
                {{ col.value }}
              </slot>
              <template v-if="col.field === 'actions' && showActions">
                <q-btn
                  v-for="action in componentProps.actions"
                  :key="action"
                  :icon="getIcon(action)"
                  class="button-table-action"
                  dense
                  flat
                  @click="() => handlerEmitter(action, props.row)"
                >
                  <q-tooltip>{{ getTooltip(action) }}</q-tooltip>
                </q-btn>
              </template>
            </q-td>
          </template>
        </template>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  import type { QTableColumn } from 'quasar';
  import { computed } from 'vue';
  import { TableActions, type tableActions } from 'shared/models/table';
  import { TABLE_ACTIONS_COLUMN } from 'src/constants/table.constants';

  const componentProps = withDefaults(
    defineProps<{
      columns: QTableColumn[];
      rows: Record<string, unknown>[];
      actions?: tableActions[];
      showActions?: boolean;
    }>(),
    {
      actions: () => [],
      showActions: true
    }
  );

  const emits = defineEmits<{
    action: unknown;
  }>();

  const updateColumns = computed(() => {
    const columns = [...componentProps.columns];
    if (componentProps.actions?.length) columns.push(TABLE_ACTIONS_COLUMN);
    return columns;
  });

  function getIcon(action: tableActions): string {
    switch (action) {
      case TableActions.EDIT:
        return 'fas fa-pen-to-square';
      case TableActions.DELETE:
        return 'fas fa-trash-can';
      case TableActions.INSIGHT:
        return 'fas fa-microscope';
      case TableActions.SEARCH:
        return 'fas fa-magnifying-glass';
      case TableActions.VIEW_ASSETS:
        return 'fas fa-shield-halved';
      case TableActions.DETAIL:
        return 'fas fa-eye';
      case TableActions.POLAR_REPORT:
        return 'fas fa-chart-pie';
      case TableActions.INFORMATION:
        return 'fas fa-info-circle';
      default:
        return 'fas fa-eye';
    }
  }

  function getTooltip(action: tableActions): string {
    switch (action) {
      case TableActions.EDIT:
        return 'Edit';
      case TableActions.DELETE:
        return 'Delete';
      case TableActions.INSIGHT:
        return 'View vulnerability analysis summary';
      case TableActions.SEARCH:
        return 'Search';
      case TableActions.VIEW_ASSETS:
        return 'View assets and vulnerabilities';
      case TableActions.DETAIL:
        return 'View details';
      case TableActions.POLAR_REPORT:
        return 'View Polar Graph Report';
      case TableActions.INFORMATION:
        return 'View host information (DNS, WHOIS, emails)';
      default:
        return 'View';
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
