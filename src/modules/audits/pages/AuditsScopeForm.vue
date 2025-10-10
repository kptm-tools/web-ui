<template>
  <scope-questions :scopeEvaluation="scopeEvaluationForm" />
</template>
<script setup lang="ts">
  import ScopeQuestions from 'audits/components/form/ScopeQuestions.vue';
  import { ScopeEvaluationService } from '../services/scopeEvaluation';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { type ScopeEvaluationFormResponse } from '../models/scopeEvaluation';

  const route = useRoute();
  const scopeEvaluationForm = ref({} as ScopeEvaluationFormResponse);

  onMounted(async () => {
    scopeEvaluationForm.value = (
      await ScopeEvaluationService.getScopeEvaluationForm(String(route.params.id ?? ''))
    ).data;
  });
</script>
