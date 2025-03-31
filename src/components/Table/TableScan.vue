<template>
  <q-tabs v-model="tab" class="text-teal q-mb-md" content-class="justify-start text-primary">
    <q-tab name="scans" label="Scans" />
    <q-tab name="scheduled" label="Scheduled Scans" />
  </q-tabs>
  <q-btn label="New Scan" color="primary" class="q-mb-md" @click="newScan"></q-btn>
  <template v-if="tab === 'scans'">
    <table-regular :columns="SCAN_TABLE_COLUMNS" :rows="rows" :actions="['insight']" :show-actions="false"
      @action="handlerEmitter($event)">
      <template #column="{ column, row }">
        <template v-if="column.field === 'id'"> </template>
        <template v-if="column.field === 'scanDate'">
          {{ formatTableDate(column.value) }}
        </template>
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
            <q-btn v-if="action.show(row.status)" :icon="action.icon" class="button-table-action" dense flat
              @click="() => handlerEmitter({ action, row })" />
          </template>
        </template>

        <template v-else>
          {{ column.value }}
        </template>
      </template>
    </table-regular>
  </template>
  <template v-if="tab === 'scheduled'">
    <table-regular :columns="SCAN_TABLE_SCHEDULE_COLUMNS" :rows="scheduleScan" :actions="['edit', 'delete']"
      :show-actions="false" @action="handlerEmitter($event)">
      <template #column="{ column, row }">
        <template v-if="column.field === 'id'"> </template>
        <template v-if="column.field === 'scheduled_date'">
          {{ formatTableDate(column.value) }}</template>
        <template v-else-if="column.field === 'actions'">
          <template v-for="action in SCAN_TABLE_ACTIONS" :key="action.name">
            <q-btn v-if="action.show(row.status)" :icon="action.icon" class="button-table-action" dense flat
              @click="() => handlerEmitter({ action, row })" />
          </template>
        </template>

        <template v-else>
          {{ column.value }}
        </template>
      </template>
    </table-regular>
  </template>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import { onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
// import { ScanService, HostService } from 'src/services';
import { ScanSchedulesService } from 'src/services/scan-schedules.service';
import { HostService, ScanService } from 'src/services';
import type { CreateScanBody, Host, HostSchedule } from 'src/models';
import { SeverityChip, TableRegular, DialogScan } from 'src/components';
import {
  formatDuration,
  SCAN_TABLE_COLUMNS,
  SCAN_TABLE_ACTIONS,
  SCAN_TABLE_SCHEDULE_COLUMNS
} from 'src/utils';
import { ScanTableProgressBar } from 'src/components';

defineProps<{
  rows: Record<string, unknown>[];
}>();

const emits = defineEmits(['refreshTable', 'action']);

const $q = useQuasar();
const hosts: Ref<Host[]> = ref([]);
const tab = ref('scans');
const scheduleScan = ref([]);

function newScan(): void {
  $q.dialog({
    component: DialogScan,
    componentProps: {
      hosts: hosts.value
    }
  })
    .onOk((data: HostSchedule[]) => {
      const body: CreateScanBody[] = data
        .map(val => ({
          host_id: Number(val.id),
          repeat_frequency: {
            quantity: val.repeat_frequency.quantity,
            unit_of_frequency: val.repeat_frequency.unit_of_frequency
          },
          schedule_at: formatDate(
            val.scanDateTime.date,
            val.scanDateTime.time
          )
        }))
        .filter(scan => scan.host_id);
      body.forEach(value => {
        ScanService.createScan(value).catch(err => new Error(err));
      });
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

function formatDate(
  dateFormat: string | null = '',
  timeFormat: string | null = ''
): string | null {
  if (dateFormat && timeFormat) {
    const [year, month, day] = dateFormat.split('/').map(Number);
    const [hours, minutes] = timeFormat.split(':').map(Number);
    const date =
      dateFormat !== '' && dateFormat
        ? new Date(year || 0, (month || 0) - 1, day, hours, minutes, 0, 0)
        : new Date();
    const formattedDate = date.toISOString();
    return formattedDate;
  } else {
    return null;
  }
}

function formatTableDate(date: string): string {
  const now = new Date(date);
  const formattedDate =
    now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
  return formattedDate;
}

watch(tab, () => {
  if (tab.value === 'scheduled') {
    ScanSchedulesService.getScanSchedules().then(res => {
      scheduleScan.value = res.data;
    }).catch((err) => new Error(err));
  }
});
</script>

<style scoped></style>
