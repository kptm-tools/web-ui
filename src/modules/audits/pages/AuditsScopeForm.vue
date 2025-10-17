<template>
  <scope-questions
    :scopeEvaluation="scopeEvaluationForm"
    @save-draft="saveDraft"
    @send-observation="sendObservation"
    @approve="approveAudit"
    @submit="submitAudit"
  />
</template>
<script setup lang="ts">
  import ScopeQuestions from 'audits/components/form/ScopeQuestions.vue';
  import { ScopeEvaluationService } from '../services/scopeEvaluation';
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import {
    type ScopeEvaluationFormReviewRequest,
    type ScopeEvaluationFormResponse,
    type ScopeEvaluationFormDraftRequest
  } from '../models/scopeEvaluation';
  import type { AxiosError } from 'axios';
  import { useQuasar } from 'quasar';
  import { errorQuasarNotify, successQuasarNotify } from 'src/utils';
  import { AUDITS_ROUTES } from '../routes/route-names';

  const route = useRoute();
  const router = useRouter();
  const scopeEvaluationForm = ref({} as ScopeEvaluationFormResponse);
  const $q = useQuasar();

  async function saveDraft(body: ScopeEvaluationFormDraftRequest) {
    try {
      $q.loading.show();
      await ScopeEvaluationService.putDraftScopeEvaluationForm(String(route.params.id ?? ''), body);
      await fetchData();
      successQuasarNotify('Auditoria guardada');
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
      successQuasarNotify('Auditoria Observada');
      await router.push({ name: AUDITS_ROUTES.home.name });
    } catch (err) {
      const error = (err as AxiosError).message;
      errorQuasarNotify(error);
      console.error(error);
    } finally {
      $q.loading.hide();
    }
  }

  async function submitAudit() {
    try {
      $q.loading.show();
      await ScopeEvaluationService.submitScopeEvaluationFormReview(String(route.params.id ?? ''));
      await fetchData();
      successQuasarNotify('Auditoria Enviada');
      await router.push({ name: AUDITS_ROUTES.home.name });
    } catch (err) {
      const error = (err as AxiosError).message;
      errorQuasarNotify(error);
      console.error(error);
    } finally {
      $q.loading.hide();
    }
  }

  async function approveAudit(body: ScopeEvaluationFormReviewRequest) {
    try {
      $q.loading.show();
      await ScopeEvaluationService.postScopeEvaluationFormReview(
        String(route.params.id ?? ''),
        body
      );
      await fetchData();
      successQuasarNotify('Auditoria Aprovada');
      await router.push({ name: AUDITS_ROUTES.home.name });
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
