<template>
  <div class="q-pa-md">
    <table-scan :rows="rows" @action="handlerEmitter" />
  </div>
</template>

<script setup lang="ts">
  import { useQuasar } from 'quasar';
  import type { Ref } from 'vue';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { TableScan, DialogScanInsight } from 'src/components';
  import type { Scan, ScanTableEventAction } from 'src/models';
  import { ScanActions } from 'src/models';
  import {
    formatScansForTable,
    // getScansFromService,
    getScanInsightsFromService,
    postScanCancelService
  } from 'src/utils';
  import { AUTH_TOKEN_NAMES } from 'src/constants/fusion-auth.constants';

  const scans: Ref<Scan[]> = ref([]);
  const $q = useQuasar();

  const rows = computed(() => formatScansForTable(scans.value));
  const connection = ref<WebSocket | null>(null);

  // const interval = setInterval(() => {
  //   setScansData().catch(err => new Error(err));
  // }, 3000);

  // async function setScansData(): Promise<void> {
  //   scans.value = await getScansFromService();
  // }

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

  onMounted(() => {
    const otp = sessionStorage.getItem(AUTH_TOKEN_NAMES.OTP);
    const tenantId = sessionStorage.getItem(AUTH_TOKEN_NAMES.TENANT_ID);
    connection.value = new WebSocket(`ws://localhost:8000/ws/scan?tenantId=${tenantId}&otp=${otp}`);
    connection.value.onmessage = (data: { data: string }) => {
      scans.value = JSON.parse(data.data);
    };
  });

  onUnmounted(() => {
    // clearInterval(interval);
  });
</script>
