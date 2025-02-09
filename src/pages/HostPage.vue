<template>
  <div class="q-pa-md">
    <table-host
      :rows="store.getFilteredList"
      @refresh-table="setInitalDataToStore"
      @action="actionHandler"
    />
  </div>
</template>

<script setup lang="ts">
  import TableHost from 'src/components/Table/TableHost.vue';
  import { onMounted } from 'vue';
  import { Host } from 'src/models/hosts.models';
  import { useHosthStore } from 'src/stores/host-store';
  import {
    setInitalDataToStore,
    deleteHostById,
    getHostByIdFromService
  } from 'src/utils';

  const store = useHosthStore();

  async function actionHandler(action: {
    action: string;
    col: Host;
  }): Promise<void> {
    const hostId = action.col.id || '';

    switch (action.action) {
      case 'edit':
        await getHostByIdFromService(hostId);
        break;
      case 'delete':
        await deleteHostById(hostId);
        break;
    }
  }

  onMounted(async () => {
    await setInitalDataToStore();
  });
</script>

<style scoped></style>
