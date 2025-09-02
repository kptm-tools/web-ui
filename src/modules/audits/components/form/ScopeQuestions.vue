<template>
  <q-form class="q-pa-md q-px-xl q-col-gutter-md">
    <h4 class="text-center text-weight-bold">Formulario de Alcance</h4>
    <template v-for="(question, index) in scopeQuestions" :key="question.code">
      <div v-if="index === 17" class="q-mt-sm text-weight-bold">Funcion a Evaluar</div>
      <template v-if="question.question_type === 'text'">
        <q-input
          outlined
          stack-label
          v-model="answers[question.code]"
          :label="question.label"
          :maxlength="question.validation_rules?.max_length"
        />
      </template>

      <template v-if="question.question_type === 'number'">
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
        />
      </template>

      <template v-if="question.question_type === 'checkbox'">
        <div class="row">
          <q-checkbox left-label v-model="answers[question.code]" :label="question.label" />
        </div>
      </template>

      <template v-if="question.question_type === 'file'">
        <q-file
          outlined
          stack-label
          v-model="files[question.code]"
          :label="question.label"
          :multiple="Boolean((question.validation_rules?.max_files || 0) > 1)"
          :accept="'.' + question.validation_rules?.file_type"
        />
      </template>

      <template v-if="question.question_type === 'multi-text'">
        <div class="q-mt-sm text-weight-bold">{{ question.label }}</div>
        <div class="row items-center">
          <div class="col">
            <q-input
              outlined
              v-model="auxInputText"
              type="text"
              :maxlength="question.validation_rules?.max_length_per_item"
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
      <q-btn label="Guardar" type="reset" color="primary" flat class="q-ml-sm" />
      <q-btn label="Enviar" type="submit" color="primary" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { FrameworkService } from '../../services/framework';
  import { type ScopeQuestion } from '../../models/framework';

  const scopeQuestions = ref([] as ScopeQuestion[]);
  const answers = ref({} as { [key: string]: string });
  const files = ref({} as { [key: string]: File });
  const multiText = ref({} as { [key: string]: string[] });
  const auxInputText = ref('');

  function handlerMultiText(code: string) {
    if (!multiText.value[code]) {
      multiText.value[code] = [];
    }
    multiText.value[code]?.push(auxInputText.value);
    auxInputText.value = '';
  }

  onMounted(async () => {
    scopeQuestions.value = (await FrameworkService.getScopeQuestions()).data.questions;
  });
</script>
