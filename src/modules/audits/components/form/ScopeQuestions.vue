<template>
  <q-form class="q-pa-md q-px-xl q-col-gutter-md">
    <h4 class="text-center text-weight-bold">Formulario de Alcance</h4>
    <template v-for="(question, index) in scopeQuestions" :key="question.code">
      <div v-if="index === indexBeforeSelectFunction" class="q-mt-sm text-weight-bold">
        Funciones a Evaluar
      </div>
      <template v-if="question.question_type === QuestionType.TEXT">
        <q-input
          outlined
          stack-label
          v-model="answers[question.code]"
          :label="question.label"
          :maxlength="question.validation_rules?.max_length"
          :hint="'Observacion: ' + comments[question.code]"
        ></q-input>
      </template>

      <template v-if="question.question_type === QuestionType.NUMBER">
        <q-input
          outlined
          v-model="answers[question.code]"
          :label="question.label"
          type="number"
          stack-label
          :rules="[
            val =>
              val >= (question.validation_rules?.min || 0) ||
              `Valor minimo es de ${question.validation_rules?.min || 0}`,
            val =>
              val <= (question.validation_rules?.max || Number.MAX_VALUE) ||
              `Valor max es de ${question.validation_rules?.max || 0}`
          ]"
          :hint="'Observacion: ' + comments[question.code]"
        />
      </template>

      <template v-if="question.question_type === QuestionType.CHECKBOX">
        <div class="row">
          <q-checkbox left-label v-model="answers[question.code]" :label="question.label" />
        </div>
      </template>

      <template v-if="question.question_type === QuestionType.FILE">
        <q-file
          outlined
          stack-label
          v-model="files[question.code]"
          :label="question.label"
          :multiple="Boolean((question.validation_rules?.max_files || 0) > 1)"
          :accept="'.' + question.validation_rules?.file_type"
          :hint="'Observacion: ' + comments[question.code]"
        />
      </template>

      <template v-if="question.question_type === QuestionType.MULTI_TEXT">
        <div class="q-mt-sm text-weight-bold">{{ question.label }}</div>
        <div class="row items-center">
          <div class="col">
            <q-input
              outlined
              v-model="auxInputText"
              type="text"
              :maxlength="question.validation_rules?.max_length_per_item"
              :hint="'Observacion: ' + comments[question.code]"
            />
          </div>
          <div class="col-2 text-center">
            <q-btn
              color="primary"
              square
              icon="add"
              @click="handlerMultiText(question.code)"
            ></q-btn>
          </div>
        </div>
        <div class="row">
          <ul>
            <li v-for="(item, index) in multiText[question.code]" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </template>
    </template>
    <div class="text-right">
      <q-btn
        label="Guardar"
        type="reset"
        color="primary"
        flat
        class="q-ml-sm"
        v-if="allowSaveDraft"
        @click="makeDraftHandler"
      />
      <q-btn label="Enviar" type="submit" color="primary" v-if="props.scopeEvaluation.can_submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import { FrameworkService } from '../../services/framework';
  import { type ScopeQuestion, QuestionType } from '../../models/framework';
  import type {
    ScopeEvaluationFormDraftRequest,
    ScopeEvaluationFormResponse
  } from '../../models/scopeEvaluation';
  import { useAuthStore } from 'src/modules/auth/stores/auth-store';

  const scopeQuestions = ref([] as ScopeQuestion[]);
  const answers = ref({} as { [key: string]: string });
  const comments = ref({} as { [key: string]: string });
  const files = ref({} as { [key: string]: File });
  const multiText = ref({} as { [key: string]: string[] });
  const auxInputText = ref('');
  const indexBeforeSelectFunction = 17;
  const authStore = useAuthStore();

  const props = defineProps({
    scopeEvaluation: {
      type: Object as PropType<ScopeEvaluationFormResponse>,
      required: true
    }
  });

  const emits = defineEmits(['saveDraft']);

  function handlerMultiText(code: string) {
    if (!multiText.value[code]) {
      multiText.value[code] = [];
    }
    multiText.value[code]?.push(auxInputText.value);
    auxInputText.value = '';
  }

  const responseAnswers = computed(() => props.scopeEvaluation.answers);
  const allowSaveDraft = computed(() => authStore.userRole === 'client');

  function makeDraftHandler() {
    const saveDraftRequest: ScopeEvaluationFormDraftRequest = {
      answers: scopeQuestions.value.map(question => ({
        question_code: question.code,
        value: String(answers.value[question.code])
      }))
    };
    emits('saveDraft', saveDraftRequest);
  }

  watch(responseAnswers, () => {
    responseAnswers.value.forEach(val => {
      answers.value[val.question_code.toLowerCase()] = val.value;
      comments.value[val.question_code.toLowerCase()] = val.analyst_observation;
    });
  });

  onMounted(async () => {
    scopeQuestions.value = (await FrameworkService.getScopeQuestions()).data.questions;
  });
</script>
