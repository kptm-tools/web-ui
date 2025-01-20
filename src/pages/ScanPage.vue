<template>
  <div class="q-pa-md">
    <table-scan :rows="rows" />
  </div>
</template>

<script setup lang="ts">
  import TableScan from 'src/components/Table/TableScan.vue';
  import { getScans } from 'src/services/scan.service';
  import { Scan } from 'src/models/scans.model';
  import { onMounted, ref, Ref } from 'vue';

  const scans: Ref<Scan[]> = ref([]);

  const rows = [
    {
      scanDate: '2021-09-01',
      host: 'host1',
      numVulnerabilities: 10,
      severity: 5,
      durations: '1h 5m',
      status: 0.7
    },
    {
      scanDate: '2021-09-01',
      host: 'host3',
      numVulnerabilities: 4,
      severity: 4,
      durations: '1h 5m',
      status: 0.2
    }
  ];

  onMounted(async () => {
    scans.value = (await getScans()).data;
  });
</script>
