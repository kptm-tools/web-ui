<template>
  <template v-if="isMounted">
    <Teleport :to="HEADER_ID">Auditor </Teleport>
  </template>

  <q-page>
    <template v-if="isFirstAudit">
      <div class="q-px-xl text-center">
        <h5 class="text-weight-medium text-center">PROCESO DE AUDITORIA</h5>
        <p class="q-px-xl text-justify">
          "Al iniciar el proceso de auditoría se solicitará información de su organización, tanto
          administrativa como tecnológica, por lo que es necesario tenga toda la información a la
          mano para completar un formulario de alcance que se le presentará a continuación si inicia
          el proceso de auditoría. Además, deberá también adjuntar un NDA para que Kriptome y su
          organización estén protegidos legalmente en cualquier caso de fuga de información"
        </p>

        <q-btn
          color="primary"
          no-caps
          label="Iniciar Auditoría"
          @click="audits.showCreateAuditDialog"
        ></q-btn>
      </div>
    </template>

    <template v-else>
      <div class="q-pa-md">
        <div class="row items-center q-mb-md">
          <q-btn
            label="Iniciar Auditoria"
            color="primary"
            @click="audits.showCreateAuditDialog"
          ></q-btn>
          <!-- <q-icon size="md" name="info" color="grey-5" v-ripple class="info-icon">
            <q-tooltip class="bg-white text-black" style="width: 180px; font-size: 0.8em">
              Para iniciar una auditoria debes contactarte a : <a>ejemplo@kriptome.com</a>
            </q-tooltip>
          </q-icon> -->
        </div>

        <q-table
          :rows="auditsList"
          :columns="AUDITS_TABLE_COLUMNS"
          row-key="organizacion"
          @row-click="goAudit"
        />
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { HEADER_ID } from 'src/constants/idHtmlReference.constants';
  import type { AuditResponse } from 'audits/models/audits';
  import { useAudits } from 'audits/composables/audits';
  import { useRouter } from 'vue-router';
  import { AUDITS_ROUTES } from 'audits/routes/route-names';
  import { AudiSteps } from '../enums/audits';

  const audits = useAudits();
  const router = useRouter();

  const { auditsList, AUDITS_TABLE_COLUMNS } = audits;

  const isMounted = ref(false);
  const isFirstAudit = computed(() => auditsList.value.length === 0);

  async function goAudit(e: Event, row: AuditResponse) {
    e.stopPropagation();
    let routeName = AUDITS_ROUTES.auditScopeForm.name;
    if (row.step == AudiSteps.FUNCTION_EVALUATION) {
      routeName = AUDITS_ROUTES.functions.name;
    }
    await router.push({
      name: routeName,
      params: { id: row.id }
    });
  }

  onMounted(async () => {
    isMounted.value = true;
    await audits.fetchAuditsData();
  });
</script>

<style lang="scss" scoped>
  .info-icon {
    cursor: pointer;
  }
</style>
