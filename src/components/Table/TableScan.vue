<template>
  <q-btn
    label="New Scan"
    color="primary"
    class="q-mb-md"
    @click="newScan"
  ></q-btn>
  <table-regular
    :columns="columns"
    :rows="rows"
    :actions="['insight']"
    :show-actions="false"
    @action="handlerEmitter($event)"
  >
    <template #column="{ column, row }">
      <template v-if="column.field === 'id'"> </template>
      <template v-else-if="column.field === 'status'">
        <q-linear-progress
          :value="getProgressBarValue(column.value)"
          size="20px"
          rounded
          class="q-mt-sm"
          :indeterminate="column.value === ScanStatus.inProgress"
          :color="getProgressBarColor(column.value)"
        >
          <div class="absolute-full flex flex-center">
            <q-badge
              color="transparent"
              text-color="white"
              :label="column.value"
            />
          </div>
        </q-linear-progress>
      </template>
      <template v-else-if="column.field === 'severity'">
        <severity-chip :severity="column.value" />
      </template>

      <template v-else-if="column.field === 'durations'">
        {{ formatDuration(column.value) }}
      </template>

      <template v-else-if="column.field === 'actions'">
        <template v-for="action in tableActions" :key="action.name">
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
  import { QTableColumn, useQuasar } from 'quasar';
  import { ScanService } from 'src/services';
  import { getHosts } from 'src/services/host.service';
  import { Host } from 'src/models/hosts.models';
  import { ScanStatus, ScanActions } from 'src/models/scans.model';
  import { SeverityChip, TableRegular, DialogScan } from 'src/components';

  defineProps<{
    rows: Record<string, unknown>[];
  }>();

  const emits = defineEmits(['refreshTable', 'action']);

  const $q = useQuasar();
  const hosts: Ref<Host[]> = ref([]);

  function getProgressBarColor(status: string): string {
    return status === ScanStatus.completed
      ? 'positive'
      : status === ScanStatus.pending
      ? 'warning'
      : status === ScanStatus.cancelled
      ? 'grey'
      : 'negative';
  }

  function getProgressBarValue(status: string): number {
    return status === ScanStatus.completed || status === ScanStatus.cancelled
      ? 1
      : 0;
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

  const tableActions = [
    {
      name: ScanActions.insight,
      icon: 'fas fa-chart-simple',
      show: (value: string): boolean => value === ScanStatus.completed
    },
    {
      name: ScanActions.cancel,
      icon: 'close',
      show: (value: string): boolean => value === ScanStatus.inProgress
    }
  ];

  const columns: QTableColumn[] = [
    {
      name: 'ID',
      label: 'ID',
      align: 'left',
      field: 'id'
    },
    {
      name: 'Scan Date',
      label: 'ScanDate',
      align: 'left',
      field: 'scanDate'
    },
    {
      name: 'Host',
      label: 'Host',
      align: 'left',
      field: 'host'
    },
    {
      name: '# of vulnerabilities',
      label: 'NumVulnerabilities',
      align: 'left',
      field: 'numVulnerabilities'
    },
    {
      name: 'Severity',
      label: 'Severity',
      align: 'left',
      field: 'severity'
    },
    {
      name: 'Durations',
      label: 'Durations',
      align: 'left',
      field: 'durations'
    },
    {
      name: 'Status',
      label: 'Status',
      align: 'left',
      field: 'status'
    }
  ];

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
    console.log(action);
    emits('action', action);
  }

  onMounted(async () => {
    hosts.value = (await getHosts()).data;
  });
</script>

<style scoped></style>
