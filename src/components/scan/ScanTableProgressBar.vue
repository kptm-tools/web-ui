<template>
  <q-linear-progress
    :value="getProgressBarValue(status)"
    size="20px"
    rounded
    class="q-mt-sm"
    :indeterminate="isIndeterminate(status)"
    :color="getProgressBarColor(status)"
  >
    <div class="absolute-full flex flex-center">
      <q-badge color="transparent" text-color="white" :label="status" />
    </div>
  </q-linear-progress>
</template>

<script setup lang="ts">
  import { ScanStatus } from 'src/models';
  defineProps<{
    status: ScanStatus;
  }>();

  function getProgressBarColor(status: ScanStatus): string {
    return status === ScanStatus.completed
      ? 'positive'
      : status === ScanStatus.pending
      ? 'warning'
      : status === ScanStatus.cancelled
      ? 'grey'
      : status === ScanStatus.inProgress
      ? 'positive'
      : 'negative';
  }

  function getProgressBarValue(status: ScanStatus): number {
    return status === ScanStatus.completed || status === ScanStatus.cancelled
      ? 1
      : 0;
  }

  function isIndeterminate(status: ScanStatus): boolean {
    return status === ScanStatus.inProgress || status === ScanStatus.pending;
  }
</script>
