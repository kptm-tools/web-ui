<template>
  <scope-questions
    :scopeEvaluation="scopeEvaluationForm"
    @save-draft="saveDraft"
    @send-observation="sendObservation"
  />
</template>
<script setup lang="ts">
  import ScopeQuestions from 'audits/components/form/ScopeQuestions.vue';
  import { ScopeEvaluationService } from '../services/scopeEvaluation';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';

  import {
    type ScopeEvaluationFormReviewRequest,
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
      await fetchData();
    } catch (err) {
      const error = (err as AxiosError).message;
      errorQuasarNotify(error);
      console.error(error);
    } finally {
      $q.loading.hide();
    }
  }

  async function sendObservation(body: ScopeEvaluationFormReviewRequest) {
    try {
      $q.loading.show();
      await ScopeEvaluationService.postScopeEvaluationFormReview(
        String(route.params.id ?? ''),
        body
      );
      await fetchData();
    } catch (err) {
      const error = (err as AxiosError).message;
      errorQuasarNotify(error);
      console.error(error);
    } finally {
      $q.loading.hide();
    }
  }

  async function fetchData() {
    scopeEvaluationForm.value = (
      await ScopeEvaluationService.getScopeEvaluationForm(String(route.params.id ?? ''))
    ).data;
  }

  onMounted(async () => {
    await fetchData();
  });
</script>
