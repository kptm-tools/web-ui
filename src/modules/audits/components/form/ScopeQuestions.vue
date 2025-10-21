<template>
  <q-form class="q-pa-md q-px-xl q-col-gutter-md" @submit.prevent="sendObservations">
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
          bottom-slots
          :readonly="!canEdit"
        >
          <template v-slot:append>
            <q-btn
              square
              flat
              :icon="!visibility[question.code] ? 'visibility' : 'check'"
              @click="visibility[question.code] = !visibility[question.code]"
              v-if="allowToMakeObservation"
            />
          </template>
          <template v-slot:hint>
            <template
              v-if="
                !visibility[question.code] &&
                comments[question.code] &&
                comments[question.code] !== ''
              "
            >
              {{ 'Observacion: ' + comments[question.code] }}
            </template>
            <template v-if="visibility[question.code]">
              <template v-if="allowToMakeObservation">
                <q-input
                  v-model="comments[question.code]"
                  dense
                  outlined
                  label="Observacion"
                  @blur="visibility[question.code] = false"
                ></q-input>
              </template>
            </template>
          </template>
        </q-input>
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
              !val ||
              val >= (question.validation_rules?.min || 0) ||
              `Valor minimo es de ${question.validation_rules?.min || 0}`,
            val =>
              !val ||
              val <= (question.validation_rules?.max || Number.MAX_VALUE) ||
              `Valor max es de ${question.validation_rules?.max || 0}`
          ]"
          class="q-mb-md"
          bottom-slots
          :readonly="!canEdit"
        >
          <template v-slot:append>
            <q-btn
              square
              flat
              :icon="!visibility[question.code] ? 'visibility' : 'check'"
              @click="visibility[question.code] = !visibility[question.code]"
              v-if="allowToMakeObservation"
            />
          </template>
          <template v-slot:hint>
            <template v-if="visibility[question.code]">
              <template v-if="allowToMakeObservation">
                <q-input
                  v-model="comments[question.code]"
                  dense
                  outlined
                  label="Observacion"
                  borderless
                ></q-input>
              </template>
            </template>
            <template v-else-if="comments[question.code]">
              {{ 'Observacion:' + comments[question.code] }}
            </template>
          </template>
        </q-input>
      </template>

      <template v-if="question.question_type === QuestionType.CHECKBOX">
        <div class="row">
          <q-checkbox
            left-label
            v-model="answers[question.code]"
            :label="question.label"
            true-value="true"
            false-value="false"
            :disable="!canEdit"
          />
          <q-btn
            square
            flat
            :icon="!visibility[question.code] ? 'visibility' : 'check'"
            @click="visibility[question.code] = !visibility[question.code]"
            v-if="allowToMakeObservation"
          />
        </div>
        <div class="row">
          <template v-if="visibility[question.code]">
            <div class="col-12">
              <template v-if="allowToMakeObservation">
                <q-input
                  v-model="comments[question.code]"
                  dense
                  outlined
                  label="Observacion"
                ></q-input>
              </template>
            </div>
          </template>
          <template v-else-if="comments[question.code]">
            <div class="text-weight-bolder col-12">Observacion</div>
            <div>{{ comments[question.code] }}</div>
          </template>
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
          bottom-slots
          :readonly="!canEdit"
        >
          <template v-slot:append>
            <q-btn
              square
              flat
              :icon="!visibility[question.code] ? 'visibility' : 'check'"
              @click="visibility[question.code] = !visibility[question.code]"
              v-if="allowToMakeObservation"
            />
          </template>
          <template v-slot:hint>
            <template v-if="visibility[question.code]">
              <template v-if="allowToMakeObservation">
                <q-input
                  v-model="comments[question.code]"
                  dense
                  outlined
                  label="Observacion"
                ></q-input>
              </template>
            </template>
            <template v-else-if="comments[question.code]">
              {{ 'Observacion: ' + comments[question.code] }}assa
            </template>
          </template></q-file
        >
      </template>

      <template v-if="question.question_type === QuestionType.MULTI_TEXT">
        <div class="q-mt-sm text-weight-bold">
          {{ question.label }}
          <q-btn
            square
            flat
            :icon="!visibility[question.code] ? 'visibility' : 'check'"
            @click="visibility[question.code] = !visibility[question.code]"
            v-if="allowToMakeObservation"
          />
        </div>
        <div class="row items-center" v-if="canEdit">
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
        <template v-if="visibility[question.code]">
          <template v-if="allowToMakeObservation">
            <q-input v-model="comments[question.code]" dense outlined label="Observacion"></q-input>
          </template>
        </template>
        <template v-if="comments[question.code]">
          <div class="text-weight-bolder">Observacion</div>
          <div>{{ comments[question.code] }}</div>
        </template>
      </template>
    </template>
    <div class="text-right q-mt-md">
      <template v-if="allowToMakeObservation">
        <q-btn
          label="Observacion"
          type="submit"
          color="primary"
          class="q-mr-md"
          v-if="!canApprove"
        />
        <q-btn label="Aprobar" type="submit" color="primary" @click="sendApprove" />
      </template>
      <template v-else>
        <q-btn
          label="Guardar"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
          @click="makeDraftHandler"
        />
        <q-btn
          label="Enviar"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
          @click="confirmSubmitForm()"
          v-if="isAllowedToSubmit"
        />
      </template>
    </div>
  </q-form>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue';
  import { computed, onMounted, ref, watch } from 'vue';
  // import { FrameworkService } from '../../services/framework';
  import { type ScopeQuestion, QuestionType } from '../../models/framework';
  import type {
    ScopeEvaluationFormAnswerReviewRequest,
    ScopeEvaluationFormDraftRequest,
    ScopeEvaluationFormResponse,
    ScopeEvaluationFormReviewRequest
  } from '../../models/scopeEvaluation';
  import { useAuthStore } from 'src/modules/auth/stores/auth-store';
  import { USER_ROLES } from 'src/constants/deny-actions.constants';
  import { ScopeFormActions } from '../../enums/audits';
  import { FrameworkService } from '../../services/framework';
  import { useQuasar } from 'quasar';

  const scopeQuestions = ref([] as ScopeQuestion[]);
  const answers = ref({} as { [key: string]: string });
  const comments = ref({} as { [key: string]: string });
  const visibility = ref({} as { [key: string]: boolean });
  const files = ref({} as { [key: string]: File });
  const multiText = ref({} as { [key: string]: string[] });
  const auxInputText = ref('');
  const indexBeforeSelectFunction = 17;
  const authStore = useAuthStore();
  const $q = useQuasar();

  const props = defineProps({
    scopeEvaluation: {
      type: Object as PropType<ScopeEvaluationFormResponse>,
      required: true
    }
  });

  const emits = defineEmits(['saveDraft', 'sendObservation', 'approve', 'submit']);

  function handlerMultiText(code: string) {
    if (!multiText.value[code]) {
      multiText.value[code] = [];
    }
    multiText.value[code]?.push(auxInputText.value);
    auxInputText.value = '';
  }

  const responseAnswers = computed(() => props.scopeEvaluation.answers);
  const isAllowedToSubmit = computed(() => props.scopeEvaluation.can_submit);
  const allowToMakeObservation = computed(
    () => authStore.userRole === USER_ROLES.ANALYST || authStore.userRole === USER_ROLES.SUPER_ADMIN
  );
  const canApprove = computed(() =>
    Object.values(comments.value).every(val => val === '' || val === undefined)
  );
  const canEdit = computed(() => authStore.userRole === USER_ROLES.MANAGER);

  function makeDraftHandler() {
    const saveDraftRequest: ScopeEvaluationFormDraftRequest = {
      answers: scopeQuestions.value.map(question => ({
        question_code: question.code,
        value: String(answers.value[question.code])
      }))
    };
    emits('saveDraft', saveDraftRequest);
  }

  function sendObservations() {
    const answerReviews: ScopeEvaluationFormAnswerReviewRequest[] = scopeQuestions.value
      .filter(question => {
        const observation = comments.value?.[question.code] ?? '';
        return observation.trim() !== '';
      })
      .map(question => {
        const observation = comments.value[question.code];

        return {
          observation: observation ?? '',
          question_code: question.code,
          status: ScopeFormActions.NEEDS_REVISION
        } as ScopeEvaluationFormAnswerReviewRequest;
      });

    if (answerReviews.length === 0) {
      return;
    }

    const observationsRequest: ScopeEvaluationFormReviewRequest = {
      action: ScopeFormActions.NEEDS_REVISION,
      answer_reviews: answerReviews
    };

    emits('sendObservation', observationsRequest);
  }

  function sendApprove() {
    const approveRequest: ScopeEvaluationFormReviewRequest = {
      action: ScopeFormActions.APPROVED,
      answer_reviews: scopeQuestions.value
        .map(val => {
          let answer: ScopeEvaluationFormAnswerReviewRequest =
            {} as ScopeEvaluationFormAnswerReviewRequest;
          if (answers.value[val.code]) {
            answer = {
              observation: '',
              question_code: val.code,
              status: ScopeFormActions.APPROVED
            };
            return answer;
          }
        })
        .filter(val => val !== undefined)
    };
    $q.dialog({
      title: 'Aprobar Auditoria',
      message: 'Comentario Final',
      ok: 'Aprobar',
      prompt: {
        model: '',
        type: 'text'
      },
      cancel: true,
      persistent: true
    }).onOk(data => {
      approveRequest.overall_feedback = data;
      emits('approve', approveRequest);
    });
  }

  function confirmSubmitForm(): void {
    $q.dialog({
      title: 'Enviar Formulario de Alcance',
      message: '¿Seguro que desea enviar el formulario de alcance?',
      ok: 'Enviar',
      cancel: true,
      persistent: true
    }).onOk(() => {
      emits('submit');
    });
  }

  watch(responseAnswers, () => {
    responseAnswers.value.forEach(val => {
      answers.value[val.question_code.toLowerCase()] = val.value;
      comments.value[val.question_code.toLowerCase()] = val.analyst_observation || '';
    });
  });

  onMounted(async () => {
    scopeQuestions.value = (await FrameworkService.getScopeQuestions()).data.questions;
  });
</script>
