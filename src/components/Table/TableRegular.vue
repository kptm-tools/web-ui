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
        <q-th :class="props.col.__thClass" class="table-header">
          {{ props.col.name }}</q-th
        >
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
              <template v-if="col.field === 'actions'">
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
            </q-td>
          </template>
        </template>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  import { QTableColumn } from 'quasar';
  import { computed, onMounted, ref } from 'vue';

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

  // function isDate(date: string): boolean {
  //   return new Date(date).toString() !== 'Invalid Date';
  // }

  // function formatDate(date: Date): string {
  //   return new Date(date).toLocaleDateString();
  // }

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
