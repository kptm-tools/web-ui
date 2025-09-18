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
          <q-table
            :rows="unassignedAuditsRows"
            :columns="unassignedAuditsColumns"
            :pagination="pagination"
            :loading="loading"
            @request="onRequest"
            binary-state-sort
            row-key="name"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  label="Asignar Analista"
                  dense
                  color="secondary"
                  style="font-size: 0.8em"
                  @click="setAuditAnalyst(props.row.name, props.row.audit_id)"
                ></q-btn>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="all">
          <q-table
            :rows="auditsRows"
            :columns="allAuditsColumns"
            :pagination="allAuditsPagination"
            :loading="loading"
            @request="onRequest"
            binary-state-sort
            row-key="name"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <template v-if="props.row.is_assigned">
                  <q-btn
                    label="Desasignar Analista"
                    dense
                    color="primary"
                    style="font-size: 0.8em"
                    @click="unassignAnalystDialog(props.row.analyst_name, props.row.audit_id)"
                  ></q-btn>
                </template>
                <template v-else>
                  <q-btn
                    label="Asignar Analista"
                    dense
                    color="secondary"
                    style="font-size: 0.8em"
                    @click="setAuditAnalyst(props.row.name, props.row.audit_id)"
                  ></q-btn>
                </template>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { computed, type ComputedRef, onMounted, type Ref, ref, watch } from 'vue';
  import { AdminService } from '../services/admin';
  import DialogSelectAnalyst from '../components/dialog/DialogSelectAnalyst.vue';
  import type {
    AuditRow,
    AuditsResponse,
    UnassignedAuditRow,
    UnassignedAuditsResponse,
    AvailableAnalyst
  } from '../models/admin';
  import { type QTableColumn } from 'quasar';
  import { errorQuasarNotify } from 'src/utils';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();

  const unassignedAuditsResponse: Ref<UnassignedAuditsResponse | null> = ref(null);
  const allAuditsResponse: Ref<AuditsResponse | null> = ref(null);
  const availableAnalyst: Ref<AvailableAnalyst[] | null> = ref(null);
  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 20,
    rowsNumber: 20
  });
  const allAuditsPagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 20,
    rowsNumber: 20
  });
  const unassignedAuditsColumns: QTableColumn[] = [
    {
      name: 'title',
      align: 'center',
      label: 'Organización',
      field: 'title',
      sortable: true
    },
    {
      name: 'name',
      align: 'center',
      label: 'Nombre Auditoria',
      field: 'name',
      sortable: true
    },
    {
      name: 'created_at',
      align: 'center',
      label: 'Creación',
      field: 'created_at',
      sortable: true
    },
    {
      name: 'days_unassigned',
      align: 'center',
      label: 'Dias sin asignar',
      field: 'days_unassigned',
      sortable: true
    },
    {
      name: 'actions',
      align: 'center',
      label: '',
      field: 'actions',
      sortable: true
    }
  ];
  const allAuditsColumns: QTableColumn[] = [
    {
      name: 'audit_name',
      align: 'center',
      label: 'Nombre Auditoria',
      field: 'audit_name',
      sortable: true
    },
    {
      name: 'created_at',
      align: 'center',
      label: 'Creación',
      field: 'created_at',
      sortable: true
    },
    // {
    //   name: 'days_unassigned',
    //   align: 'center',
    //   label: 'Dias sin asignar',
    //   field: 'days_unassigned',
    //   sortable: true
    // },
    {
      name: 'analyst_name',
      align: 'center',
      label: 'Analista',
      field: 'analyst_name',
      sortable: true
    },
    {
      name: 'tenant_name',
      align: 'center',
      label: 'Tenant',
      field: 'tenant_name',
      sortable: true
    },
    {
      name: 'actions',
      align: 'center',
      label: '',
      field: 'actions',
      sortable: true
    }
  ];
  const splitterModel = ref(50);

  const tabs = ref('unassigned');
  const loading = ref(false);

  const unassignedAuditsRows: ComputedRef<UnassignedAuditRow[]> = computed(
    () => unassignedAuditsResponse.value?.data || []
  );

  const auditsRows: ComputedRef<AuditRow[]> = computed(() => allAuditsResponse.value?.data || []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onRequest(props: any) {
    if (props.pagination) {
      const { page, rowsNumber } = props.pagination;
      if (page && rowsNumber) {
        if (tabs.value === 'unassigned') {
          await setUnassignedAuditsData(page, rowsNumber);
        } else {
          await setAuditsData(page, rowsNumber);
        }
      }
    }
  }

  async function getAvailableAnalyst(): Promise<AvailableAnalyst[]> {
    return (await AdminService.getAvailableAnalysts()).data;
  }

  async function setUnassignedAuditsData(page: number, pageSize: number): Promise<void> {
    try {
      loading.value = true;
      unassignedAuditsResponse.value = (
        await AdminService.getUnassignedAudits(page, pageSize)
      ).data;
    } catch (err) {
      errorQuasarNotify(String(err));
    } finally {
      loading.value = false;
    }
  }

  async function setAuditsData(page: number, pageSize: number): Promise<void> {
    try {
      loading.value = true;
      allAuditsResponse.value = (await AdminService.getAllAudits(page, pageSize)).data;
    } catch (err) {
      errorQuasarNotify(String(err));
    } finally {
      loading.value = false;
    }
  }

  async function unassignAnalyst(id: string): Promise<void> {
    try {
      loading.value = true;
      await AdminService.putUnassignAnalystAudit(id);
    } catch (err) {
      errorQuasarNotify(String(err));
    } finally {
      loading.value = false;
    }
  }

  async function setData(): Promise<void> {
    if (tabs.value === 'unassigned') {
      await setUnassignedAuditsData(pagination.value.page, pagination.value.rowsPerPage);
    } else {
      await setAuditsData(allAuditsPagination.value.page, allAuditsPagination.value.rowsPerPage);
    }
  }

  async function setAuditAnalyst(audit: string, id: string): Promise<void> {
    try {
      $q.loading.show();
      availableAnalyst.value = await getAvailableAnalyst();
      $q.dialog({
        component: DialogSelectAnalyst,
        componentProps: {
          analysts: availableAnalyst.value,
          audit
        }
      });
    } catch (err) {
      errorQuasarNotify(String(err));
    } finally {
      $q.loading.hide();
      $q.dialog({
        component: DialogSelectAnalyst,
        componentProps: {
          analysts: [],
          audit,
          id
        }
      }).onOk(async () => {
        await setData();
      });
    }
  }

  async function unassignAnalystDialog(analyst: string, id: string): Promise<void> {
    $q.dialog({
      title: `Desasignar auditoria`,
      message: `¿Estás seguro de que quieres desasignar a ${analyst} de esta auditoría?`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      await unassignAnalyst(id);
      await setData();
    });
  }

  watch(tabs, async () => {
    await setData();
  });

  onMounted(async () => {
    await setData();
  });
</script>
