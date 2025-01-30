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
              :indeterminate="col.value === 'Pending'"
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
            <q-chip
              v-if="col.value.critical"
              :label="col.value.critical"
              color="red"
              square
              text-color="white"
            />
            <q-chip
              v-if="col.value.high"
              color="amber-10"
              :label="col.value.high"
              square
              text-color="white"
            />
            <q-chip
              v-if="col.value.medium"
              color="warning"
              :label="col.value.medium"
              square
              text-color="white"
            />
            <q-chip
              v-if="col.value.low"
              color="positive"
              :label="col.value.low"
              square
              text-color="white"
            />
            <template v-if="col.value == 4">
              <q-chip color="orange" label="4" square text-color="white" />
              <q-chip color="positive" label="1" square text-color="white" />
            </template>
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

          <template
            v-else-if="
              col.field === 'numVulnerabilities' || col.field === 'durations'
            "
          >
            {{ col.value }}
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

  type tableActions = 'edit' | 'delete' | 'insight';

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
