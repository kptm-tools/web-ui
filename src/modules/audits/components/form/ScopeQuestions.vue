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
          bottom-slots
          :readonly="!canEdit"
          :disable="
            scopeEvaluation.scope_status === ScopeFormActions.NEEDS_REVISION &&
            canEdit &&
            comments[question.code] == ''
          "
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
          :disable="
            scopeEvaluation.scope_status === ScopeFormActions.NEEDS_REVISION &&
            canEdit &&
            comments[question.code] == ''
          "
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
            :disable="
              !canEdit ||
              (scopeEvaluation.scope_status === ScopeFormActions.NEEDS_REVISION &&
                canEdit &&
                comments[question.code] == '')
            "
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
          :accept="'.' + question.validation_rules?.file_type"
          bottom-slots
          :readonly="!canEdit"
          :disable="
            scopeEvaluation.scope_status === ScopeFormActions.NEEDS_REVISION &&
            canEdit &&
            comments[question.code] == ''
          "
          @update:model-value="uploadFile($event, question.code)"
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
              {{ 'Observacion: ' + comments[question.code] }}
            </template>
          </template></q-file
        >

        <q-table
          :rows="fileUrl[question.code] || []"
          flat
          :columns="[
            { name: 'file', label: 'File', align: 'left', field: 'name' },
            { name: 'action', label: 'Action', align: 'center', field: 'action' }
          ]"
        >
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn
                icon="visibility"
                color="primary"
                dense
                @click="openFileUrl($event, props.row)"
              ></q-btn>
              <q-btn icon="delete" color="primary" dense class="q-ml-md"></q-btn>
            </q-td>
          </template>
        </q-table>
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
        <div
          class="row items-center"
          v-if="
            canEdit ||
            !(
              scopeEvaluation.scope_status === ScopeFormActions.NEEDS_REVISION &&
              canEdit &&
              comments[question.code] == ''
            )
          "
        >
          <div class="col">
            <q-input
              outlined
              v-model="auxInputText"
              type="text"
              :readonly="!canEdit"
              :disable="
                scopeEvaluation.scope_status === ScopeFormActions.NEEDS_REVISION &&
                canEdit &&
                comments[question.code] == ''
              "
              :maxlength="question.validation_rules?.max_length_per_item"
            />
          </div>
          <div class="col-2 text-center">
            <q-btn
              color="primary"
              square
              icon="add"
              :disable="
                (scopeEvaluation.scope_status === ScopeFormActions.NEEDS_REVISION &&
                  canEdit &&
                  comments[question.code] == '') ||
                !canEdit
              "
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
          color="primary"
          class="q-mr-md"
          @click="sendObservations"
          v-if="!canApprove"
        />
        <q-btn label="Aprobar" color="primary" @click="sendApprove" />
      </template>
      <template v-else>
        <q-btn label="Guardar" color="primary" flat class="q-ml-sm" @click="makeDraftHandler" />
        <q-btn
          label="Enviar"
          color="primary"
          flat
          class="q-ml-sm"
          @click="confirmSubmitForm()"
          :disable="!isAllowedToSubmit"
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
    ScopeEvaluationFormReviewRequest,
    ScopeEvaluationFormDraftAnswerRequest
  } from '../../models/scopeEvaluation';
  import { useAuthStore } from 'src/modules/auth/stores/auth-store';
  import { USER_ROLES } from 'src/constants/deny-actions.constants';
  import { ScopeFormActions } from '../../enums/audits';
  import { FrameworkService } from '../../services/framework';
  import { useQuasar } from 'quasar';
  import { useScopeForm } from '../../composables/scope-form';

  const scopeQuestions = ref([] as ScopeQuestion[]);
  const answers = ref({} as { [key: string]: string });
  const comments = ref({} as { [key: string]: string });
  const answerStatus = ref({} as { [key: string]: string });
  const visibility = ref({} as { [key: string]: boolean });
  const files = ref({} as { [key: string]: File });
  const fileReference = ref({} as { [key: string]: number[] });
  const multiText = ref({} as { [key: string]: string[] });
  const fileUrl = ref({} as { [key: string]: { url: string; name: string }[] });
  const auxInputText = ref('');
  const indexBeforeSelectFunction = 17;
  const authStore = useAuthStore();
  const $q = useQuasar();
  const scopeForm = useScopeForm();

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
    answers.value[code] = multiText.value[code].join(',');
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
      answers: scopeQuestions.value
        .map(question => {
          const answerValue = answers.value[question.code];
          if (answerValue !== undefined && answerValue !== null) {
            const data: ScopeEvaluationFormDraftAnswerRequest = {
              question_code: question.code,
              value: fileReference.value[question.code] ? '' : String(answerValue),
              file_ids: fileReference.value[question.code] || undefined
            };
            return data;
          }
          return null;
        })
        .filter(item => item !== null)
    };

    if (props.scopeEvaluation.scope_status === ScopeFormActions.NEEDS_REVISION) {
      saveDraftRequest.answers = saveDraftRequest.answers
        .map(answer => {
          const hasObservation = comments.value[answer.question_code] !== undefined;
          if (hasObservation) {
            return {
              ...answer,
              status: ScopeFormActions.NEEDS_REVISION
            };
          }
        })
        .filter(item => item !== undefined);
    }

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

    $q.dialog({
      title: 'Enviar Observaciones',
      message: '¿Seguro que desea enviar las observaciones?',
      ok: 'Enviar',
      cancel: true,
      persistent: true
    }).onOk(() => {
      emits('sendObservation', observationsRequest);
    });
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

  async function uploadFile(file: unknown, questionCode: string) {
    const fileId = await scopeForm.uploadFileToAudit(
      String(props.scopeEvaluation.audit.id),
      questionCode,
      file as File
    );
    if (!fileReference.value[questionCode]) {
      fileReference.value[questionCode] = [];
    }
    fileReference.value[questionCode].push(Number(fileId));
  }

  function openFileUrl(event: Event, row: unknown) {
    event.preventDefault();
    const stringUrl = (row as { url: string }).url;
    window.open(stringUrl, '_blank');
  }

  watch(responseAnswers, () => {
    responseAnswers.value.forEach(val => {
      answers.value[val.question_code.toLowerCase()] = val.value;
      comments.value[val.question_code.toLowerCase()] = val.analyst_observation || '';
      answerStatus.value[val.question_code.toLowerCase()] = val.status;
      if (val.files?.length > 0) {
        fileUrl.value[val.question_code.toLowerCase()] = val.files.map(file => ({
          name: file.file_name,
          url: `${process.env.AUDITS_SERVER_URL}/api/v1/buckets/evidence/object/download?preview=true&prefix=${file.s3_key}`
        }));
      }
    });
  });

  onMounted(async () => {
    scopeQuestions.value = (await FrameworkService.getScopeQuestions()).data.questions;
  });
</script>
