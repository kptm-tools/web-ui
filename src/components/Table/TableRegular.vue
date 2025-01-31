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
          <template v-if="col.field === 'status'">
            <q-linear-progress
              :value="
                col.value === 'Completed' || col.value === 'Cancelled' ? 1 : 0
              "
              size="20px"
              rounded
              class="q-mt-sm"
              :indeterminate="col.value === 'InProgress'"
              :color="
                col.value === 'Completed'
                  ? 'positive'
                  : col.value === 'Pending'
                  ? 'warning'
                  : col.value === 'Cancelled'
                  ? 'grey'
                  : 'negative'
              "
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  color="transparent"
                  text-color="white"
                  :label="col.value"
                />
              </div>
            </q-linear-progress>
          </template>
          <template v-else-if="col.field === 'severity'">
            <severity-chip :severity="col.value" />
          </template>
          <template v-else-if="col.field === 'actions'">
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

          <template v-else-if="col.field === 'numVulnerabilities'">
            {{ col.value }}
          </template>

          <template v-else-if="col.field === 'durations'">
            <tempate v-if="secondTick">
              {{
                props.row.status === 'InProgress'
                  ? formatDuration(
                      getElapsedSeconds(new Date(props.row.scanDate))
                    )
                  : formatDuration(col.value)
              }}
            </tempate>
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
  import { computed, onMounted, ref } from 'vue';
  import SeverityChip from '../shared/SeverityChip.vue';

  type tableActions = 'edit' | 'delete' | 'insight';

  const componentProps = defineProps<{
    columns: QTableColumn[];
    rows: Record<string, unknown>[];
    actions?: tableActions[];
  }>();

  const emits = defineEmits<{
    action: unknown;
  }>();

  const secondTick = ref(true);

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
      case 'insight':
        return 'fas fa-chart-simple';
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

  function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let result = '';
    if (hours > 0) result += `${hours}h ${minutes}m`;
    if (minutes > 0 && hours < 1) result += `${minutes}m ${secs.toFixed(0)}s`;
    if ((secs > 0 && seconds < 60) || result === '')
      result += `${secs.toFixed(0)}s`;

    return result.trim();
  }

  function getElapsedSeconds(startDate: Date): number {
    const startTs = Math.floor(startDate.getTime() / 1000);
    const currentTs = Math.floor(Date.now() / 1000);
    return currentTs - startTs;
  }

  onMounted(() => {
    setInterval(async function () {
      secondTick.value = false;
      secondTick.value = true;
    }, 1000);
  });
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
