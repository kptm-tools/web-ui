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

        <q-tab-panel name="assigned"> </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { computed, type ComputedRef, onMounted, type Ref, ref } from 'vue';
  import { AdminService } from '../services/admin';
  import { type UnassignedAuditRow, type UnassignedAuditsResponse } from '../models/admin';
  import { type QTableColumn } from 'quasar';

  const unassignedAuditsResponse: Ref<UnassignedAuditsResponse | null> = ref(null);
  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 20,
    rowsNumber: 10
  });
  const columns: QTableColumn[] = [
    {
      name: 'title',
      align: 'center',
      label: 'Organizacion',
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
      label: 'Creacion',
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
  const splitterModel = ref(50);

  const tabs = ref('unassigned');
  const loading = ref(false);

  const unassignedAuditsRows: ComputedRef<UnassignedAuditRow[]> = computed(
    () => unassignedAuditsResponse.value?.data || []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onRequest(props: any) {
    if (props.pagination) {
      const { page, rowsPerPage } = props.pagination;
      if (page && rowsPerPage) {
        await setUnassignedAuditsData(page, rowsPerPage);
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
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  onMounted(async () => {
    await setUnassignedAuditsData(pagination.value.page, pagination.value.rowsPerPage);
  });
</script>
