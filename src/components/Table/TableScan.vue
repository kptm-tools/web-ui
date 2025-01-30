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
    @action="handlerEmitter($event)"
  />
</template>

<script setup lang="ts">
  import { QTableColumn } from 'quasar';
  import TableRegular from './TableRegular.vue';
  import DialogScan from '../Dialog/DialogScan.vue';
  import { useQuasar } from 'quasar';
  import { getHosts } from 'src/services/host.service';
  import { onMounted, ref, Ref } from 'vue';
  import { Host } from 'src/models/hosts.models';
  import { createScans } from 'src/services/scan.service';

  defineProps<{
    rows: Record<string, unknown>[];
  }>();

  const emits = defineEmits(['refreshTable', 'action']);

  const $q = useQuasar();
  const hosts: Ref<Host[]> = ref([]);

  const columns: QTableColumn[] = [
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
        createScans(data.map((s: Host) => s.id));
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
    hosts.value = (await getHosts()).data;
  });
</script>

<style scoped></style>
