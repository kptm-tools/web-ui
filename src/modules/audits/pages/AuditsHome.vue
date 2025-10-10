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

        <q-btn color="primary" no-caps label="Iniciar Auditoría" @click="showCreateAudit"></q-btn>
      </div>
    </template>

    <template v-else>
      <div class="q-pa-md">
        <div class="row items-center q-mb-md">
          <q-btn disable label="Iniciar Auditoria" color="grey-5" text-color="black"></q-btn>
          <q-icon size="md" name="info" color="grey-5" v-ripple class="info-icon">
            <q-tooltip class="bg-white text-black" style="width: 180px; font-size: 0.8em">
              Para iniciar una auditoria debes contactarte a : <a>ejemplo@kriptome.com</a>
            </q-tooltip>
          </q-icon>
        </div>

        <q-table :rows="auditsList" :columns="AUDITS_COLUMNS" row-key="organizacion" />
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, type Ref } from 'vue';
  import { useQuasar } from 'quasar';
  import { type AxiosError } from 'axios';
  import { AuditService } from 'audits/services/audits';
  import { type AuditGeneralResponse } from 'audits/models/audits';
  import { AUDITS_COLUMNS } from 'audits/constants/table';
  import { HEADER_ID } from 'src/constants/idHtmlReference.constants';
  import { errorQuasarNotify } from 'src/utils';
  import { useRouter } from 'vue-router';
  import { AUDITS_ROUTES } from '../routes/route-names';

  const isMounted = ref(false);
  const isFirstAudit = computed(() => auditsList.value.length === 0);
  const auditsList: Ref<AuditGeneralResponse[]> = ref([]);
  const $q = useQuasar();
  const router = useRouter();

  async function fetchAuditsData(): Promise<void> {
    try {
      $q.loading.show();
      auditsList.value = (await AuditService.getAudits()).data;
      auditsList.value = [];
    } catch (err) {
      const error = err as AxiosError;
      errorQuasarNotify(error.message);
    } finally {
      $q.loading.hide();
    }
  }

  async function createAudit(name: string): Promise<void> {
    await router.push({
      name: AUDITS_ROUTES.auditScopeForm.name,
      params: { id: (await AuditService.postAudit({ name })).data.id }
    });
  }

  function showCreateAudit(): void {
    $q.dialog({
      title: 'Iniciar Auditoria',
      message: 'Elige el nombre de tu auditoria',
      prompt: {
        model: '',
        type: 'text'
      },
      cancel: true,
      persistent: true
    }).onOk(data => {
      void createAudit(data);
    });
  }

  onMounted(async () => {
    isMounted.value = true;
    await fetchAuditsData();
  });
</script>

<style lang="scss" scoped>
  .info-icon {
    cursor: pointer;
  }
</style>
