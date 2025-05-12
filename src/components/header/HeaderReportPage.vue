<template>
  <Teleport :to="HEADER_ID">
    <template v-if="showTitle">
      <div>{{ $t('report.header.title') }}</div>
    </template>
    <template v-else>
      <div class="q-py-md">
        <q-btn
          icon="arrow_back"
          flat
          :label="$t('report.header.backButton')"
          @click="goBackHandler"
        ></q-btn>
      </div>
    </template>
  </Teleport>
</template>

<script setup lang="ts">
  import { HEADER_ID } from 'src/constants/idHtmlReference.constants';

  defineProps({
    showTitle: {
      required: true,
      type: Boolean
    }
  });

  const emits = defineEmits(['goBack']);

  function goBackHandler(): void {
    emits('goBack');
  }
</script>
