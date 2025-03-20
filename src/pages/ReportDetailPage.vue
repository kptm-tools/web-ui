<template>
  <Teleport v-if="isMounted" to="#header">
    <div class="q-py-sm">
      <q-btn :label="`DOMAIN: ${vulnerabilities.alias}`" size="lg" flat icon="arrow_back"
        @click="$router.push({ name: ROUTES_NAMES.reports })"></q-btn>
    </div>
  </Teleport>
  <Teleport v-if="isMounted" to="#aux-sidebar">
    <div style="background-color: #313541; height: 100%" class="q-pa-md">
      <p class="text-white text-h6">SEVERITY</p>
      <div class="row q-mb-sm">
        <div class="col-10">
          <span class="card-red">CRITICAL</span>
        </div>
        <div class="col-2 text-white text-weight-bold">
          {{ vulnerabilities.severity_counts.critical }}
        </div>
      </div>
      <div class="row q-mb-sm">
        <div class="col-10">
          <span class="card-orange">HIGH</span>
        </div>
        <div class="col-2 text-white text-weight-bold">
          {{ vulnerabilities.severity_counts.high }}
        </div>
      </div>
      <div class="row q-mb-sm">
        <div class="col-10"><span class="card-yellow">MEDIUM</span></div>
        <div class="col-2 text-white text-weight-bold">
          {{ vulnerabilities.severity_counts.medium }}
        </div>
      </div>
      <div class="row">
        <div class="col-10"><span class="card-green">LOW</span></div>
        <div class="col-2 text-white text-weight-bold">
          {{ vulnerabilities.severity_counts.low }}
        </div>
      </div>
      <q-separator class="q-my-sm text-white bg-white" />
      <div class="row text-white text-weight-bold">
        <div class="col-10">TOTAL</div>
        <div class="col-2">{{ totalSeverity }}</div>
      </div>
    </div>
  </Teleport>
  <div class="row q-col-gutter-md q-px-md container">
    <q-select v-model="sort" borderless dense :options="['Vulnerability', 'Cvss', 'Risk']"
      @update:model-value="sortList"></q-select>
    <div v-for="vul in vulnerabilities.vulnerabilities" :key="vul.id" class="col-12">
      <vulnerability-card :vul="vul" @comment-updated="handleCommentUpdated" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ScanVulnerabilitesResponse, ScanVulnerability } from 'src/models';
import { ReportService } from 'src/services';
import { computed, onMounted, Ref, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ROUTES_NAMES } from 'src/router/routes-names';
import { useQuasar } from 'quasar';
import VulnerabilityCard from 'src/components/report/VulnerabilityCard.vue';

const route = useRoute();
const scanId = route.params.id as string;
const vulnerabilities: Ref<ScanVulnerabilitesResponse> = ref(
  {} as ScanVulnerabilitesResponse
);
const sort = ref('Vulnerability');
const isMounted = ref(false);
const $q = useQuasar();

const totalSeverity = computed(() => {
  return Object.values(vulnerabilities.value.severity_counts).reduce(
    (aux = 0, item) => (aux = aux + item)
  );
});

function handleCommentUpdated(payload: { vulID: number; newComment: string }) {
  const vulnerabilityToUpdate = vulnerabilities.value.vulnerabilities.find(
    (vul) => vul.id === payload.vulID
  );

  if (vulnerabilityToUpdate) {
    vulnerabilityToUpdate.comment = payload.newComment;
  } else {
    console.warn(`Vulnerability with ID ${payload.vulID} not found.`)
  }
}

function sortList(type: string): void {
  let updatedList: ScanVulnerability[] = vulnerabilities.value.vulnerabilities;
  if (type === 'Vulnerability') {
    updatedList = vulnerabilities.value.vulnerabilities.sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }
  if (type === 'Cvss') {
    updatedList = vulnerabilities.value.vulnerabilities.sort(
      (a, b) => b.max_cvss - a.max_cvss
    );
  }
  if (type === 'Risk') {
    updatedList = vulnerabilities.value.vulnerabilities.sort(
      (a, b) => b.risk_score - a.risk_score
    );
  }
  vulnerabilities.value.vulnerabilities = updatedList;
}

onMounted(async () => {
  $q.loading.show();
  vulnerabilities.value = (
    await ReportService.getReportsVulnerabilities(scanId)
  ).data;
  $q.loading.hide();
  sortList('Vulnerability');
  isMounted.value = true;
});
</script>

<style lang="scss" scoped>
.container {
  max-height: 100%;
  overflow: auto;
}

.card {

  &-red,
  &-orange,
  &-yellow,
  &-green {
    border-radius: 4px;
    width: fit-content;
    padding: 2px 5px;
  }

  &-red {
    border: 1px solid #e5494d;
    background-color: #fa556a33;
    color: #e5494d;
  }

  &-orange {
    border: 1px solid #f3a488;
    background: #f3a48833;
    color: #f3a488;
  }

  &-yellow {
    border: 1px solid #eaa237;
    background: #f6be6333;
    color: #eaa237;
  }

  &-green {
    border: 1px solid #46a758;
    background: #46a75833;
    color: #46a758;
  }
}
</style>
