<template>
  <div class="q-pa-md">
    <table-scan :rows="[]" />
  </div>
</template>

<script setup lang="ts">
  import TableScan from 'src/components/Table/TableScan.vue';
  import { getScans } from 'src/services/scan.service';
  import { Scan } from 'src/models/scans.model';
  import { onMounted, ref, Ref } from 'vue';

  const scans: Ref<Scan[]> = ref([]);

  onMounted(async () => {
    scans.value = (await getScans()).data;
  });
</script>
