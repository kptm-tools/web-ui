<template>
  <Teleport v-if="isMounted" to="#header">
    <div>Reports</div>
  </Teleport>
  <table-reports :rows="reportsRow" @action="handleTableAction" />
</template>

<script setup lang="ts">
  import { ReportService } from 'src/services';
  import { onMounted, ref, Ref } from 'vue';
  import {
    Report,
    ReportSummaryTimeRange,
    ReportTableEventAction
  } from 'src/models';
  import { TableReports, DialogReportInsight } from 'src/components';
  import { useQuasar } from 'quasar';
  import { ROUTES_NAMES } from 'src/router/routes-names';
  import { useRouter } from 'vue-router';
  // import { SCAN_INSIGHT_VULNERABILITY_OPTIONS } from 'src/constants/apexcharts.constants';

  const reports: Ref<Report[]> = ref([]);
  const router = useRouter();
  const reportsRow: Ref<Record<string, unknown>[]> = ref([]);
  const isMounted = ref(false);
  const $q = useQuasar();

  function handleTableAction(action: ReportTableEventAction): void {
    if (action.action === 'insight') {
      ReportService.getReportsVulnerabilitiesSummary(
        action.col.scan_id,
        '',
        ReportSummaryTimeRange.MONTH
      ).then(response => {
        $q.dialog({
          component: DialogReportInsight,
          componentProps: {
            insight: response.data
          }
        });
      });
    } else if (action.action === 'search') {
      router.push({
        name: ROUTES_NAMES.reportsDetail,
        params: { id: action.col.scan_id }
      });
    }
  }

  onMounted(() => {
    ReportService.getReports().then(response => {
      reports.value = response.data;
      reportsRow.value = response.data.map(data => ({
        ...data
      }));
    });
    isMounted.value = true;
  });
</script>
