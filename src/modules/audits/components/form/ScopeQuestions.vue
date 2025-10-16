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
    <div class="text-right">
      <template v-if="allowToMakeObservation">
        <q-btn
          label="Observacion"
          type="submit"
          color="primary"
          class="q-mr-md"
          v-if="!canApprove"
        />
        <q-btn label="Aprobar" type="submit" color="primary" v-else />
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
          @click="makeDraftHandler"
          v-if="scopeEvaluation.can_submit"
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

  const scopeQuestions = ref([] as ScopeQuestion[]);
  const answers = ref({} as { [key: string]: string });
  const comments = ref({} as { [key: string]: string });
  const visibility = ref({} as { [key: string]: boolean });
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

  const emits = defineEmits(['saveDraft', 'sendObservation']);

  function handlerMultiText(code: string) {
    if (!multiText.value[code]) {
      multiText.value[code] = [];
    }
    multiText.value[code]?.push(auxInputText.value);
    auxInputText.value = '';
  }

  const responseAnswers = computed(() => props.scopeEvaluation.answers);
  const allowToMakeObservation = computed(
    () => authStore.userRole === USER_ROLES.ANALYST || authStore.userRole === USER_ROLES.SUPER_ADMIN
  );
  const canApprove = computed(() =>
    Object.values(comments.value).every(val => val === '' || val === undefined)
  );

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

  watch(responseAnswers, () => {
    responseAnswers.value.forEach(val => {
      answers.value[val.question_code.toLowerCase()] = val.value;
      comments.value[val.question_code.toLowerCase()] = val.analyst_observation || '';
    });
  });

  onMounted(() => {
    const data = {
      questions: [
        {
          code: 'nombre_organizacion',
          label: 'Nombre de la organización',
          question_type: 'text',
          validation_rules: {
            max_length: 30
          }
        },
        {
          code: 'sector',
          label: 'Sector',
          question_type: 'text',
          validation_rules: {
            max_length: 30
          }
        },
        {
          code: 'numero_empleados',
          label: 'Número de Empleados',
          question_type: 'number',
          validation_rules: {
            min: 1
          }
        },
        {
          code: 'lugares_fisicos',
          label: 'Lugares Físicos',
          question_type: 'number',
          validation_rules: {
            max: 99,
            min: 1
          }
        },
        {
          code: 'ubicacion_pais',
          label: 'Ubicación (País donde opera)',
          question_type: 'text',
          validation_rules: {
            max_length: 30
          }
        },
        {
          code: 'areas_auditadas',
          label: 'Áreas auditadas',
          question_type: 'multi-text',
          validation_rules: {
            max_length_per_item: 30
          }
        },
        {
          code: 'hardware',
          label:
            'Hardware (Servidores, estaciones de trabajo, laptops, dispositivos móviles, firewalls, switches, routers, etc.)',
          question_type: 'text',
          validation_rules: {
            max_length: 1000
          }
        },
        {
          code: 'software',
          label:
            'Software (Sistemas operativos, aplicaciones de negocio, ERP, CRM, antivirus, herramientas de gestión de seguridad, etc.)',
          question_type: 'text',
          validation_rules: {
            max_length: 1000
          }
        },
        {
          code: 'cloud',
          label:
            'Cloud (Servicios y recursos en nubes públicas, cómo instancias EC2, Bases de datos, M365, Google Workspace, etc.)',
          question_type: 'text',
          validation_rules: {
            max_length: 1000
          }
        },
        {
          code: 'outsourcing_ti',
          label: 'Outsorcing TI (Soporte Técnico, desarrollo, monitoreo, etc.)',
          question_type: 'text',
          validation_rules: {
            max_length: 1000
          }
        },
        {
          code: 'ambientes_segregados',
          label: 'Ambientes Segregados (Si tuviesen producción, desarrollo, pruebas, etc.)',
          question_type: 'text',
          validation_rules: {
            max_length: 1000
          }
        },
        {
          code: 'topologia_de_red',
          label: 'Topología de red (Diagrama lógico, segmentación de redes, conexiones, etc.)',
          question_type: 'file',
          validation_rules: {
            file_type: 'jpg',
            max_files: 10
          }
        },
        {
          code: 'accesos_remotos',
          label: 'Accesos remotos (VPN, RDP, etc.)',
          question_type: 'text',
          validation_rules: {
            max_length: 1000
          }
        },
        {
          code: 'herramientas_de_monitoreo',
          label:
            'Herramientas de monitoreo (SIEM, EDR, NDR, herramientas de análisis de logs, etc.)',
          question_type: 'text',
          validation_rules: {
            max_length: 1000
          }
        },
        {
          code: 'sistemas_de_respaldo_y_recuperacion',
          label: 'Sistemas de respaldo y recuperación',
          question_type: 'text',
          validation_rules: {
            max_length: 1000
          }
        },
        {
          code: 'controles_de_acceso_tecnologicos',
          label: 'Controles de acceso tecnológicos (SSO, MFA, IAM, gestión de privilegios, etc.)',
          question_type: 'text',
          validation_rules: {
            max_length: 1000
          }
        },
        {
          code: 'puntos_de_integracion_o_apis',
          label: 'Puntos de integración o APIS',
          question_type: 'text',
          validation_rules: {
            max_length: 1000
          }
        },
        {
          code: 'alcance_funcional_gobernar',
          label: 'Gobernar',
          question_type: 'checkbox'
        },
        {
          code: 'alcance_funcional_identificar',
          label: 'Identificar',
          question_type: 'checkbox'
        },
        {
          code: 'alcance_funcional_proteger',
          label: 'Proteger',
          question_type: 'checkbox'
        },
        {
          code: 'alcance_funcional_detectar',
          label: 'Detectar',
          question_type: 'checkbox'
        },
        {
          code: 'alcance_funcional_responder',
          label: 'Responder',
          question_type: 'checkbox'
        },
        {
          code: 'alcance_funcional_recuperar',
          label: 'Recuperar',
          question_type: 'checkbox'
        },
        {
          code: 'alcance_temporal_auditoria_puntual',
          label:
            'Auditoría Puntual: Se realiza la auditoría y termina con un reporte de mejoras y un detalle de tareas por realizar por la organización.',
          question_type: 'checkbox'
        },
        {
          code: 'alcance_temporal_auditoria_continua',
          label:
            'Auditoría Continua: La auditoría contempla un seguimiento de consultoría en la realización de las tareas.',
          question_type: 'checkbox'
        },
        {
          code: 'duracion_estimada_dias',
          label:
            'Duración estimada (días que le tomará completar la autoevaluación aproximadamente)',
          question_type: 'number',
          validation_rules: {
            max: 30
          }
        },
        {
          code: 'exclusiones',
          label:
            'Exclusiones (áreas, activos, recursos o funciones que no serán evaluados) y la justificación.',
          question_type: 'text',
          validation_rules: {
            max_length: 1000
          }
        },
        {
          code: 'nda_firmado_por_kriptome',
          label: 'NDA (Para ser firmado por parte de Kriptome)',
          question_type: 'file',
          validation_rules: {
            file_type: 'pdf',
            max_files: 1
          }
        }
      ]
    };
    // scopeQuestions.value = (await FrameworkService.getScopeQuestions()).data.questions;
    scopeQuestions.value = data.questions as ScopeQuestion[];
  });
</script>
