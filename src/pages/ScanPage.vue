<template>
  <div class="q-pa-md">
    <table-scan :rows="rows" @action="handlerEmitter" />
  </div>
</template>

<script setup lang="ts">
  import { useQuasar } from 'quasar';
  import { computed, onMounted, onUnmounted, ref, Ref } from 'vue';
  import { TableScan, DialogScanInsight } from 'src/components';
  import { Scan, ScanActions, ScanTableEventAction } from 'src/models';
  import {
    formatScansForTable,
    getScansFromService,
    getScanInsightsFromService,
    postScanCancelService
  } from 'src/utils';

  const scans: Ref<Scan[]> = ref([]);
  const $q = useQuasar();

  const rows = computed(() => formatScansForTable(scans.value));

  const interval = setInterval(async () => {
    await setScansData();
  }, 3000);

  async function setScansData(): Promise<void> {
    scans.value = await getScansFromService();
  }

  async function insightActionHandler(scanId: string): Promise<void> {
    try {
      $q.loading.show();
      const insight = await getScanInsightsFromService(scanId);
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

  async function cancelActionHandler(scanId: string): Promise<void> {
    try {
      $q.loading.show();
      await postScanCancelService(scanId);
      $q.loading.hide();
    } catch (error) {
      console.error(error);
    }
  }

  async function handlerEmitter(data: ScanTableEventAction): Promise<void> {
    const {
      action: { name: scanAction },
      row: { id: scanId }
    } = data;
    if (scanAction === ScanActions.insight) {
      await insightActionHandler(scanId);
    } else if (scanAction === ScanActions.cancel) {
      await cancelActionHandler(scanId);
    }
  }

  onMounted(async () => {
    setScansData();
  });

  onUnmounted(() => {
    clearInterval(interval);
  });
</script>
