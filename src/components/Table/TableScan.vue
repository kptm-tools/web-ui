<template>
  <q-btn
    label="New Scan"
    color="primary"
    class="q-mb-md"
    @click="newScan"
  ></q-btn>
  <table-regular
    :columns="SCAN_TABLE_COLUMNS"
    :rows="rows"
    :actions="['insight']"
    :show-actions="false"
    @action="handlerEmitter($event)"
  >
    <template #column="{ column, row }">
      <template v-if="column.field === 'id'"> </template>
      <template v-else-if="column.field === 'status'">
        <scan-table-progress-bar :status="column.value" />
      </template>
      <template v-else-if="column.field === 'severity'">
        <severity-chip :severity="column.value" />
      </template>

      <template v-else-if="column.field === 'durations'">
        {{ formatDuration(column.value) }}
      </template>

      <template v-else-if="column.field === 'actions'">
        <template v-for="action in SCAN_TABLE_ACTIONS" :key="action.name">
          <q-btn
            v-if="action.show(row.status)"
            :icon="action.icon"
            class="button-table-action"
            dense
            flat
            @click="() => handlerEmitter({ action, row })"
          />
        </template>
      </template>

      <template v-else>
        {{ column.value }}
      </template>
    </template>
  </table-regular>
</template>

<script setup lang="ts">
  import { onMounted, ref, Ref } from 'vue';
  import { useQuasar } from 'quasar';
  import { ScanService, HostService } from 'src/services';
  import { Host } from 'src/models';
  import { SeverityChip, TableRegular, DialogScan } from 'src/components';
  import {
    formatDuration,
    SCAN_TABLE_COLUMNS,
    SCAN_TABLE_ACTIONS
  } from 'src/utils';
  import { ScanTableProgressBar } from 'src/components';

  defineProps<{
    rows: Record<string, unknown>[];
  }>();

  const emits = defineEmits(['refreshTable', 'action']);

  const $q = useQuasar();
  const hosts: Ref<Host[]> = ref([]);

  function newScan(): void {
    $q.dialog({
      component: DialogScan,
      componentProps: {
        hosts: hosts.value
      }
    })
      .onOk(data => {
        ScanService.createScans(data.map((s: Host) => s.id));
      })
      .onCancel(() => {
        console.log('Cancel');
      })
      .onDismiss(() => {
        console.log('Called on OK or Cancel');
      });
  }

  function handlerEmitter(action: unknown): void {
    emits('action', action);
  }

  onMounted(async () => {
    hosts.value = (await HostService.getHosts()).data;
  });
</script>

<style scoped></style>
