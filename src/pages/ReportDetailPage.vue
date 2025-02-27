<template>
  <div class="row q-col-gutter-md q-px-md container">
    <q-select
      v-model="sort"
      borderless
      dense
      :options="['Vulnerability', 'cvss', 'Risk']"
      @update:model-value="sortList"
    ></q-select>
    <div
      v-for="vul in vulnerabilites.vulnerabilities"
      :key="vul.id"
      class="col-12"
    >
      <vulnerability-card :vul="vul" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ScanVulnerabilitesResponse, ScanVulnerability } from 'src/models';
  import { ReportService } from 'src/services';
  import { onMounted, Ref, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import VulnerabilityCard from 'src/components/report/VulnerabilityCard.vue';

  const route = useRoute();
  const scanId = route.params.id as string;
  const vulnerabilites: Ref<ScanVulnerabilitesResponse> = ref(
    {} as ScanVulnerabilitesResponse
  );
  const sort = ref('vulnerability');

  function sortList(type: string): void {
    let updatedList: ScanVulnerability[] = [];
    if (type === 'Vulnerability') {
      updatedList = vulnerabilites.value.vulnerabilities.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }
    if (type === 'cvss') {
      updatedList = vulnerabilites.value.vulnerabilities.sort(
        (a, b) => b.max_cvss - a.max_cvss
      );
    }
    if (type === 'Risk') {
      updatedList = vulnerabilites.value.vulnerabilities.sort(
        (a, b) => b.risk_score - a.risk_score
      );
    }
    vulnerabilites.value.vulnerabilities = updatedList;
  }

  onMounted(async () => {
    vulnerabilites.value = (
      await ReportService.getReportsVulnerabilities(scanId)
    ).data;
    sortList('Vulnerability');
  });
</script>

<style lang="scss" scoped>
  .container {
    max-height: 100%;
    overflow: auto;
  }
</style>
