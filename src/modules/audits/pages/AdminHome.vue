<template>
  <q-splitter v-model="splitterModel" horizontal>
    <template v-slot:before>
      <q-tabs v-model="tabs" align="left">
        <q-tab name="unassigned" label="No Asignadas" />
        <q-tab name="all" label="Todas las Auditorias" />
      </q-tabs>
    </template>
    <template v-slot:after>
      <q-tab-panels
        v-model="tabs"
        animated
        swipeable
        vertical
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="unassigned">
          <unassigned-audits-table
            :loading="loading"
            :unassigned-audits-response="unassignedAuditsResponse"
            @fetch-data="onRequest"
            @set-analyst="handleAssignAnalyst"
          ></unassigned-audits-table>
        </q-tab-panel>

        <q-tab-panel name="all">
          <audits-table
            :loading="loading"
            :audits-response="allAuditsResponse"
            @fetch-data="onRequest"
            @set-analyst="handleAssignAnalyst"
            @unset-analyst="handleUnassignAnalyst"
          ></audits-table>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { onMounted, type Ref, ref, watch } from 'vue';
  import { useQuasar } from 'quasar';
  import { errorQuasarNotify, successQuasarNotify } from 'src/utils';
  import { AdminService } from '../services/admin';
  import type {
    AuditsResponse,
    UnassignedAuditsResponse,
    AvailableAnalyst
  } from 'audits/models/admin';
  import UnassignedAuditsTable from '../components/table/UnassignedAuditsTable.vue';
  import AuditsTable from '../components/table/AuditsTable.vue';
  import DialogSelectAnalyst from '../components/dialog/DialogSelectAnalyst.vue';

  const $q = useQuasar();
  const unassignedAuditsResponse: Ref<UnassignedAuditsResponse | null> = ref(null);
  const allAuditsResponse: Ref<AuditsResponse | null> = ref(null);
  const tabs = ref<'unassigned' | 'assigned'>('unassigned');
  const splitterModel = ref(50);
  const loading = ref(false);

  async function fetchData(page = 1, pageSize = 20): Promise<void> {
    loading.value = true;
    try {
      if (tabs.value === 'unassigned') {
        const response = await AdminService.getUnassignedAudits(page, pageSize);
        unassignedAuditsResponse.value = response.data;
      } else {
        const response = await AdminService.getAllAudits(page, pageSize);
        allAuditsResponse.value = response.data;
      }
    } catch (err) {
      errorQuasarNotify(String(err));
    } finally {
      loading.value = false;
    }
  }

  async function onRequest(props: {
    pagination: { page: number; rowsPerPage: number };
  }): Promise<void> {
    const { page, rowsPerPage } = props.pagination;
    if (page && rowsPerPage) {
      await fetchData(page, rowsPerPage);
    }
  }

  async function handleAssignAnalyst(audit: string, id: string): Promise<void> {
    try {
      $q.loading.show();
      const { analysts }: { analysts: AvailableAnalyst[] } = (
        await AdminService.getAvailableAnalysts()
      ).data;
      $q.dialog({
        component: DialogSelectAnalyst,
        componentProps: {
          analysts: analysts,
          audit: audit,
          id: id
        }
      }).onOk(() => {
        void (async () => {
          successQuasarNotify('Analista Asignado');
          await fetchData();
        });
      });
    } catch (err) {
      errorQuasarNotify(String(err));
    } finally {
      $q.loading.hide();
    }
  }

  function handleUnassignAnalyst(audit: { analyst: string; id: string }): void {
    $q.dialog({
      title: 'Desasignar Auditoría',
      message: `¿Estás seguro de que quieres desasignar a ${audit.analyst} de esta auditoría?`,
      cancel: true,
      persistent: true
    }).onOk(() => {
      void (async () => {
        try {
          loading.value = true;
          await AdminService.putUnassignAnalystAudit(audit.id);
          successQuasarNotify('Analista Desasignado');
          await fetchData();
        } catch (err) {
          errorQuasarNotify(String(err));
        } finally {
          loading.value = false;
        }
      });
    });
  }

  watch(tabs, async () => {
    await fetchData();
  });

  onMounted(async () => {
    await fetchData();
  });
</script>
