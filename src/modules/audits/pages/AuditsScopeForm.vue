<template>
  <scope-questions :scopeEvaluation="scopeEvaluationForm" @saveDraft="saveDraft" />
</template>
<script setup lang="ts">
  import ScopeQuestions from 'audits/components/form/ScopeQuestions.vue';
  import { ScopeEvaluationService } from '../services/scopeEvaluation';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import {
    type ScopeEvaluationFormResponse,
    type ScopeEvaluationFormDraftRequest
  } from '../models/scopeEvaluation';
  import type { AxiosError } from 'axios';
  import { useQuasar } from 'quasar';
  import { errorQuasarNotify } from 'src/utils';

  const route = useRoute();
  const scopeEvaluationForm = ref({} as ScopeEvaluationFormResponse);
  const $q = useQuasar();

  async function saveDraft(body: ScopeEvaluationFormDraftRequest) {
    try {
      $q.loading.show();
      await ScopeEvaluationService.putDraftScopeEvaluationForm(String(route.params.id ?? ''), body);
    } catch (err) {
      const error = (err as AxiosError).message;
      errorQuasarNotify(error);
      console.error(error);
    } finally {
      $q.loading.hide();
    }
  }

  onMounted(async () => {
    scopeEvaluationForm.value = (
      await ScopeEvaluationService.getScopeEvaluationForm(String(route.params.id ?? ''))
    ).data;
  });
</script>
