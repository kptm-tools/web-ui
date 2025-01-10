<template>
  <q-page class="q-pa-md">
    <table-host
      :rows="hostRows"
      @refresh-table="fetchDataToTable"
      @action="actionHandler"
    />
  </q-page>
</template>

<script setup lang="ts">
  import TableHost from 'src/components/Table/TableHost.vue';
  import { computed, onMounted, ref } from 'vue';
  import { getHosts, deleteHost } from 'src/services/host.service';
  import { Host } from 'src/models/hosts.models';

  const hostValues = ref([] as Host[]);
  const hostRows = computed(() =>
    hostValues.value.map(host => ({
      id: host.id,
      domain: host.domain,
      ip: host.ip,
      hostName: host.name,
      creationDate: host.created_at,
      email: ''
    }))
  );

  async function fetchDataToTable(): Promise<void> {
    hostValues.value = (await getHosts()).data;
  }

  async function actionHandler(action: {
    action: string;
    col: Host;
  }): Promise<void> {
    if (action.action === 'edit') {
      try {
        console.log('edit');
        console.log(action.col);
      } catch (e) {
        console.log(e);
      }
    } else if (action.action === 'delete') {
      try {
        await deleteHost(action.col.id || '');
        await fetchDataToTable();
      } catch (e) {
        console.log(e);
      }
    }
  }

  onMounted(async () => {
    await fetchDataToTable();
  });
</script>

<style scoped></style>
