<template>
  <div class="q-pa-md">
    <q-btn
      v-if="showScoredCard"
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
  import { computed, type PropType } from 'vue';
  import { denyActionsStore } from 'src/stores/deny-actions-store';
  import { DENY_ACTIONS } from 'src/constants/deny-actions.constants';

  const { isAbleToHandleAction } = denyActionsStore();

  defineProps({
    reportRows: {
      type: Array as PropType<Record<string, unknown>[]>,
      required: true,
      default: () => []
    }
  });

  const emits = defineEmits(['openScoreCard', 'tableAction']);

  const showScoredCard = computed(() =>
    isAbleToHandleAction(DENY_ACTIONS.SCAN_GET_SCORECARD_TRENDS)
  );

  function scoreCardTrendHandler(): void {
    emits('openScoreCard');
  }

  function tableActionHandler(action: unknown): void {
    emits('tableAction', action);
  }
</script>
