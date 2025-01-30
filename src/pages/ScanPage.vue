<template>
  <div class="q-pa-md">
    <table-scan :rows="rows" @action="handlerEmitter" />
  </div>
</template>

<script setup lang="ts">
  import TableScan from 'src/components/Table/TableScan.vue';
  import { getScanInsights, getScans } from 'src/services/scan.service';
  import { Scan } from 'src/models/scans.model';
  import { computed, onMounted, ref, Ref } from 'vue';
  import DialogScanInsight from 'src/components/Dialog/DialogScanInsight.vue';
  import { useQuasar } from 'quasar';

  const scans: Ref<Scan[]> = ref([]);
  const $q = useQuasar();

  const rows = computed(() =>
    scans.value.map(scan => ({
      scanDate: scan.scan_date,
      host: scan.host,
      numVulnerabilities: scan.vulnerabilities,
      severity: scan.severities,
      durations: scan.duration,
      status: scan.status
    }))
  );

  async function handlerEmitter(action: {
    action: string;
    col: { host: string };
  }): Promise<void> {
    if (action.action === 'insight') {
      try {
        const scan = scans.value.find(scan => scan.host === action.col.host);
        $q.loading.show();
        const insight = await getScanInsights(scan?.scan_id || '');
        $q.loading.hide();
        $q.dialog({
          component: DialogScanInsight,
          componentProps: {
            insight
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  onMounted(async () => {
    scans.value = (await getScans()).data;
  });
</script>
