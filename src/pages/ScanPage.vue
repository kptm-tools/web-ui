<template>
  <div class="q-pa-md">
    <table-scan :rows="rows" @action="handlerEmitter" />
  </div>
</template>

<script setup lang="ts">
  import { useQuasar } from 'quasar';
  import { computed, onMounted, onUnmounted, ref, Ref } from 'vue';
  import { TableScan, DialogScanInsight } from 'src/components';
  import { Scan } from 'src/models/scans.model';
  import {
    formatScansForTable,
    getScansFromService,
    getScanInsightsFromService
  } from 'src/utils/scan.utils';

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

  async function handlerEmitter(action: {
    action: string;
    col: { id: string };
  }): Promise<void> {
    if (action.action === 'insight') {
      await insightActionHandler(action.col.id);
    }
  }

  onMounted(async () => {
    setScansData();
  });

  onUnmounted(() => {
    clearInterval(interval);
  });
</script>
