<template>
  <div class="q-pa-md">
    <table-host
      :rows="store.getFilteredList"
      @refresh-table="fetchDataToTable"
      @action="actionHandler"
    />
  </div>
</template>

<script setup lang="ts">
  import TableHost from 'src/components/Table/TableHost.vue';
  import { onMounted } from 'vue';
  import { deleteHost, getHosts, getHost } from 'src/services/host.service';
  import { Host } from 'src/models/hosts.models';
  import { useHosthStore } from 'src/stores/host-store';

  const store = useHosthStore();

  async function fetchDataToTable(): Promise<void> {
    const data: Host[] = (await getHosts()).data.map(host => ({
      id: host.id,
      domain: host.domain,
      ip: host.ip,
      hostName: host.name,
      creationDate: host.created_at,
      email:
        host.rapporteurs.find(({ is_principal }) => is_principal)?.email || '',
      rapporteurs: host.rapporteurs,
      credentials: host.credentials
    })) as Host[];
    store.setInitialList(data);
  }

  async function actionHandler(action: {
    action: string;
    col: Host;
  }): Promise<void> {
    const hostId = action.col.id || '';
    if (action.action === 'edit') {
      try {
        await getHost(hostId);
      } catch (e) {
        console.log(e);
      }
    } else if (action.action === 'delete') {
      try {
        await deleteHost(hostId);
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
