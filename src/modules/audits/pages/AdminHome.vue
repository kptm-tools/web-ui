<template>
  <q-splitter v-model="splitterModel" horizontal>
    <template v-slot:before>
      <q-tabs v-model="tabs" align="left">
        <q-tab name="unassigned" label="Unassigned" />
        <q-tab name="assigned" label="Assigned" />
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
            :columns="columns"
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
                  color="primary"
                  style="font-size: 0.8em"
                ></q-btn>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="assigned">
          <q-table
            :rows="auditsRows"
            :columns="auditsColumns"
            :pagination="auditsPagination"
            :loading="loading"
            @request="onRequest"
            binary-state-sort
            row-key="name"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  label="Deasignar Analista"
                  dense
                  color="primary"
                  style="font-size: 0.8em"
                ></q-btn>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { computed, type ComputedRef, onMounted, type Ref, ref } from 'vue';
  import { AdminService } from '../services/admin';
  import type {
    AuditRow,
    AuditsResponse,
    UnassignedAuditRow,
    UnassignedAuditsResponse
  } from '../models/admin';
  import { type QTableColumn } from 'quasar';
  import { errorQuasarNotify } from 'src/utils';

  const unassignedAuditsResponse: Ref<UnassignedAuditsResponse | null> = ref(null);
  const auditsResponse: Ref<AuditsResponse | null> = ref(null);
  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 20,
    rowsNumber: 20
  });
  const auditsPagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 20,
    rowsNumber: 20
  });
  const columns: QTableColumn[] = [
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
  const auditsColumns: QTableColumn[] = [
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
    {
      name: 'days_unassigned',
      align: 'center',
      label: 'Dias sin asignar',
      field: 'days_unassigned',
      sortable: true
    },
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
    }
  ];
  const splitterModel = ref(50);

  const tabs = ref('unassigned');
  const loading = ref(false);

  const unassignedAuditsRows: ComputedRef<UnassignedAuditRow[]> = computed(
    () => unassignedAuditsResponse.value?.data || []
  );

  const auditsRows: ComputedRef<AuditRow[]> = computed(() => auditsResponse.value?.data || []);

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
      auditsResponse.value = (await AdminService.getAllAudits(page, pageSize)).data;
    } catch (err) {
      errorQuasarNotify(String(err));
    } finally {
      loading.value = false;
    }
  }

  onMounted(async () => {
    if (tabs.value === 'unassigned') {
      await setUnassignedAuditsData(pagination.value.page, pagination.value.rowsPerPage);
    } else {
      await setAuditsData(auditsPagination.value.page, auditsPagination.value.rowsPerPage);
    }
  });
</script>
