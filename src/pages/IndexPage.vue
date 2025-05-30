<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-8">
        <div class="row">
          <div class="col-6">
            <overall-security-posture-chart :dashboard="dashboardData" />
          </div>
          <div class="col-6">
            <vulnerability-heat-map :dashboard="dashboardData" />
          </div>
          <div class="col-12">
            <vulnerability-trend-chart :dashboard="dashboardData" @update-filter="filterHandler" />
          </div>
        </div>
      </div>
      <div class="col-4">
        <latest-scan-chart :dashboard="dashboardData" />
        <host-most-vulnerabilities-list :dashboard="dashboardData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Ref } from 'vue';
  import type { iMainDashboard } from 'src/models/dashboard.models';
  import { ref, onMounted } from 'vue';
  import { DashboardService } from 'src/services/dashboard';
  import VulnerabilityTrendChart from 'src/components/home/VulnerabilityTrendChart.vue';
  import HostMostVulnerabilitiesList from 'src/components/home/HostMostVulnerabilitiesList.vue';
  import LatestScanChart from 'src/components/home/LatestScanChart.vue';
  import OverallSecurityPostureChart from 'src/components/home/OverallSecurityPostureChart.vue';
  import VulnerabilityHeatMap from 'src/components/home/VulnerabilityHeatMap.vue';
  import { denyActionsStore } from 'src/stores/deny-actions-store';
  import { DENY_ACTIONS } from 'src/constants/deny-actions.constants';

  const dashboardData: Ref<iMainDashboard> = ref({} as iMainDashboard);
  const { isAbleToHandleAction } = denyActionsStore();

  async function fetchDashboardData(timePeriod?: string, severities?: string): Promise<void> {
    await DashboardService.getDashboard(timePeriod, severities).then(
      res => (dashboardData.value = res.data)
    );
  }

  async function filterHandler(data: { severities: string; period: string }): Promise<void> {
    await fetchDashboardData(data.period, data.severities);
  }

  onMounted(async () => {
    if (isAbleToHandleAction(DENY_ACTIONS.DASHBOARD_GET)) {
      await fetchDashboardData();
    } else {
      // TODO : HANDLE REDIRECTION
    }
  });
</script>
