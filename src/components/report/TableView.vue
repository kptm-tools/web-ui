<template>
  <div class="q-pa-md">
    <q-btn
      :label="$t('report.table.scoredCardTrendsButton')"
      color="primary"
      class="q-mb-md"
      @click="scoreCardTrendHandler"
    ></q-btn>

    <table-reports :rows="reportRows" @action="tableActionHandler" />
  </div>
</template>

<script setup lang="ts">
  import { TableReports } from 'src/components';
  import { type PropType } from 'vue';

  defineProps({
    reportRows: {
      type: Array as PropType<Record<string, unknown>[]>,
      required: true,
      default: () => []
    }
  });

  const emits = defineEmits(['openScoreCard', 'tableAction']);

  function scoreCardTrendHandler(): void {
    emits('openScoreCard');
  }

  function tableActionHandler(action: unknown): void {
    emits('tableAction', action);
  }
</script>
